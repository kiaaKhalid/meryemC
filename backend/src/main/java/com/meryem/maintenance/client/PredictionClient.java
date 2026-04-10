package com.meryem.maintenance.client;

import com.meryem.maintenance.dto.ExpertInferenceDTO;
import com.meryem.maintenance.dto.ExpertPredictionResponse;
import com.meryem.maintenance.dto.PredictionResponse;
import com.meryem.maintenance.dto.WeatherRequest;
import com.meryem.maintenance.dto.DetailedAIPredictionDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

/**
 * Technical Client for communicating with the Python ML Engine.
 */
@Component
public class PredictionClient {

    @Value("${api.predictive.url.weekly}")
    private String predictiveUrl;

    @Value("${api.predictive.url.expert}")
    private String expertUrl;

    @Value("${api.predictive.url.detailed}")
    private String detailedUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Sends 7 days of weather data and receives 7 risk predictions (XGBoost legacy).
     */
    @Cacheable("mlPredictions")
    public List<PredictionResponse> getWeeklyPredictions(List<WeatherRequest> weatherDataList) {
        try {
            PredictionResponse[] response = restTemplate.postForObject(predictiveUrl, weatherDataList, PredictionResponse[].class);
            return response != null ? Arrays.asList(response) : List.of();
        } catch (RestClientException e) {
            List<PredictionResponse> simulated = new ArrayList<>();
            for (int i = 0; i < weatherDataList.size(); i++) {
                PredictionResponse sim = new PredictionResponse();
                sim.setRisk_score(15.0 + (i * 2.5));
                sim.setUrgency_level("LOW");
                sim.setRecommendation("Syst\u00e8me en observation (Simulation)");
                simulated.add(sim);
            }
            return simulated;
        }
    }

    /**
     * EXPERT INFERENCE: Calls the Keras multi-head model for deep industrial insights.
     */
    public List<ExpertPredictionResponse> getExpertPredictions(List<ExpertInferenceDTO> inferenceData) {
        try {
            ExpertPredictionResponse[] response = restTemplate.postForObject(expertUrl, inferenceData, ExpertPredictionResponse[].class);
            return response != null ? Arrays.asList(response) : List.of();
        } catch (RestClientException e) {
            List<ExpertPredictionResponse> fallback = new ArrayList<>();
            for (int i = 0; i < inferenceData.size(); i++) {
                fallback.add(ExpertPredictionResponse.builder()
                        .failure_probability(1.5)
                        .risk_score(25.0)
                        .impact_gravity(5.0)
                        .clients_affected(400)
                        .failure_type("Interne")
                        .urgency_level("LOW")
                        .recommendation("Maintenance pr\u00e9ventive recommand\u00e9e")
                        .failure_horizon("No imminent failure")
                        .build());
            }
            return fallback;
        }
    }

    /**
     * DETAILED DRILLDOWN: Calls the dual-model inference (Keras + XGBoost).
     */
    public DetailedAIPredictionDTO getDetailedPrediction(ExpertInferenceDTO inferenceData) {
        try {
            return restTemplate.postForObject(detailedUrl, inferenceData, DetailedAIPredictionDTO.class);
        } catch (RestClientException e) {
            return DetailedAIPredictionDTO.builder()
                    .xgbDiagnosis("Non calcul\u00e9 (Fallback)")
                    .timestamp(java.time.LocalDateTime.now().toString())
                    .nnAnalysis(Map.of("probability", 0.0, "risk_score", 0.0, "impact_gravity", 0.0, "clients", 0))
                    .build();
        }
    }
}
