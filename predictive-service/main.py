from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os
import logging
from typing import List, Optional, Dict, Any
import traceback
import tensorflow as tf

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("predictive-service")

app = FastAPI(title="Industrial Predictive Maintenance AI", version="3.0.0")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    body = await request.body()
    logger.error(f"\ud83d\udce6 Request Body: {body}")
    logger.error(f"\u274c Validation Error: {exc.errors()}")
    return JSONResponse(status_code=422, content={"detail": exc.errors(), "body": body.decode()})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Model Paths
KERAS_PATH = os.path.join(MODELS_DIR, "expert_casablanca_final.keras")
XGB_PATH = os.path.join(MODELS_DIR, "xgboost_type_panne.joblib")
LEGACY_XGB_PATH = os.path.join(MODELS_DIR, "modele_maintenance_final.joblib")

# Load Engines
try:
    keras_model = tf.keras.models.load_model(KERAS_PATH) if os.path.exists(KERAS_PATH) else None
    xgb_model = joblib.load(XGB_PATH) if os.path.exists(XGB_PATH) else None
    legacy_model = joblib.load(LEGACY_XGB_PATH) if os.path.exists(LEGACY_XGB_PATH) else None
    logger.info("\u2705 All ML engines loaded successfully.")
except Exception as e:
    logger.error(f"\u274c Initialization Failure: {e}")
    keras_model = xgb_model = legacy_model = None

class InferenceRequestData(BaseModel):
    mois: int
    jour_semaine: int
    saison: str
    humidite_meteo: float
    vent_vitesse: float
    foudre: int
    precipitations: float
    temperature: float
    uv_exposure: float
    type_installation: str
    age_equipement_ans: int
    jours_depuis_derniere_maintenance: int
    duree_moyenne_reparation_h: float
    frequence_pannes_passees: int
    zone_densite: str
    travaux_proximite: int
    valeur_financiere_dh: float

class WeatherRequestData(BaseModel):
    temperature: float
    precipitation: float
    humidity: float
    wind_speed: float
    is_lightning: bool

class ExpertPredictionResponse(BaseModel):
    failure_probability: float
    risk_score: float
    impact_gravity: float
    clients_affected: int
    failure_type: str
    urgency_level: str
    recommendation: str
    failure_horizon: str

def prepare_features(data: InferenceRequestData) -> np.ndarray:
    # Categorical Encoding (LabelEncoder Alphabetical)
    saison_map = {"Automne": 0, "Et\u00e9": 1, "Hiver": 2, "Printemps": 3}
    inst_map = {"AERIEN": 0, "SOUTERRAIN": 1}
    zone_map = {"COMMERCIALE": 0, "INDUSTRIELLE": 1, "RESIDENTIELLE": 2}

    f = np.zeros((1, 17))
    f[0, 0] = data.mois
    f[0, 1] = data.jour_semaine
    f[0, 2] = saison_map.get(data.saison, 0)
    f[0, 3] = data.humidite_meteo
    f[0, 4] = data.vent_vitesse
    f[0, 5] = data.foudre
    f[0, 6] = data.precipitations
    f[0, 7] = data.temperature
    f[0, 8] = data.uv_exposure
    f[0, 9] = inst_map.get(data.type_installation, 0)
    f[0, 10] = data.age_equipement_ans
    f[0, 11] = data.jours_depuis_derniere_maintenance
    f[0, 12] = data.duree_moyenne_reparation_h
    f[0, 13] = data.frequence_pannes_passees
    f[0, 14] = zone_map.get(data.zone_densite, 0)
    f[0, 15] = data.travaux_proximite
    f[0, 16] = data.valeur_financiere_dh / 100000.0 # Basic normalization for NN
    return f

# ---- Helper labels for multi-head decoding ----
_FAILURE_TYPES = ["Interne", "Externe", "Surcharge", "Usure"]
_URGENCY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
_RECOMMENDATIONS = ["SURVEILLANCE", "MAINTENANCE PR\u00c9VENTIVE", "REPRODUCTION", "R\u00c9PARATION IMM\u00c9DIATE"]
_FAILURE_HORIZONS = ["No imminent failure", "Short term", "Medium term", "Critical"]


def _decode_keras_output(preds) -> dict:
    """Decode the multi-head Keras model output into a structured result dict."""
    prob = float(preds[0][0][0]) * 10.0
    gravity = float(preds[1][0][0])
    clients = int(abs(preds[2][0][0] * 500))
    raw_risk = float(preds[3][0][0])
    risk = raw_risk * 100.0 if raw_risk < 1 else raw_risk

    f_type = _FAILURE_TYPES[np.argmax(preds[4][0])] if len(preds) > 4 else "Inconnu"
    u_level = _URGENCY_LEVELS[np.argmax(preds[5][0])] if len(preds) > 5 else "LOW"
    recomm = _RECOMMENDATIONS[np.argmax(preds[6][0])] if len(preds) > 6 else "SURVEILLANCE"
    horizon = _FAILURE_HORIZONS[np.argmax(preds[7][0])] if len(preds) > 7 else "No imminent danger"

    return {"failure_probability": round(prob, 2), "risk_score": round(risk, 2),
            "impact_gravity": round(gravity, 2), "clients_affected": clients,
            "failure_type": f_type, "urgency_level": u_level,
            "recommendation": recomm, "failure_horizon": horizon}


def _fallback_expert_result() -> dict:
    """Return a safe fallback when the Keras model is unavailable."""
    return {"failure_probability": 1.5, "risk_score": 25.0, "impact_gravity": 5.0,
            "clients_affected": 400, "failure_type": "Fallback",
            "urgency_level": "LOW", "recommendation": "OK", "failure_horizon": "N/A"}


def _score_to_urgency(score: float) -> str:
    """Convert a numeric risk score to an urgency level string."""
    if score >= 70:
        return "CRITICAL"
    if score >= 40:
        return "HIGH"
    return "LOW"


@app.post("/predict-expert", response_model=List[ExpertPredictionResponse])
async def predict_expert(data_list: List[InferenceRequestData]):
    results = []
    for data in data_list:
        try:
            f = prepare_features(data)
            result = _decode_keras_output(keras_model.predict(f, verbose=0)) if keras_model else _fallback_expert_result()
            results.append(result)
        except Exception as e:
            logger.error(f"Inference error: {e}")
            results.append({"failure_probability": 0, "risk_score": 0, "impact_gravity": 0,
                            "clients_affected": 0, "failure_type": "Error",
                            "urgency_level": "LOW", "recommendation": str(e), "failure_horizon": "N/A"})
    return results

@app.post("/predict-detailed")
async def predict_detailed(data: InferenceRequestData):
    try:
        f = prepare_features(data)
        res = {"nn_analysis": {}, "xgb_diagnosis": "Non calcul\u00e9", "timestamp": pd.Timestamp.now().isoformat()}
        
        if keras_model:
            preds = keras_model.predict(f, verbose=0)
            res["nn_analysis"] = {
                "risk_score": round(float(preds[3][0][0]) * 1.0, 4),
                "probability": round(float(preds[0][0][0]), 4),
                "impact_gravity": round(float(preds[1][0][0]), 4),
                "clients": int(abs(preds[2][0][0] * 500))
            }
        
        if xgb_model:
            f_xgb = np.pad(f, ((0, 0), (0, 55 - 17)), mode='constant')
            xgb_pred = xgb_model.predict(f_xgb)
            failure_types = ["Coupure Localis\u00e9e", "Surcharge Transformateur", "D\u00e9faut d'Isolation", "Foudre / Surtension"]
            idx = int(xgb_pred[0])
            res["xgb_diagnosis"] = failure_types[idx] if idx < len(failure_types) else "Inconnu"
            
        return res
    except Exception as e:
        logger.error(f"Detailed inference error: {e}")
        traceback.print_exc()
        return {"error": str(e), "nn_analysis": {"risk_score": 0, "probability": 0}, "xgb_diagnosis": "Fallback"}

@app.post("/predict-weekly")
async def predict_weekly(data_list: List[WeatherRequestData]):
    results = []
    for data in data_list:
        score = (data.wind_speed * 0.5) + (data.humidity * 0.1) + (data.temperature * 0.05)
        if data.is_lightning:
            score += 30
        recommendation = "Surveillance" if score < 60 else "Maintenance Requise"
        results.append({
            "risk_score": min(95.0, score),
            "recommendation": recommendation,
            "urgency_level": _score_to_urgency(score)
        })
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
