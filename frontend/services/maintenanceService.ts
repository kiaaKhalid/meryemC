export interface DayForecast {
    date: string;
    dayName: string;
    temp: number;
    humidity: number;
    pressure: number;
    uvIndex: number;
    visibility: number;
    dewPoint: number;
    windSpeed: number;
    wmoCode: number;
    riskScore: number;
    recommendation: string;
    urgencyLevel: string;
}

export interface MaintenanceStatus {
    currentRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    currentRiskScore: number;
    recommendation: string;
    lastNotification: string;
    threshold: number;
    forecast: DayForecast[];
    isSimulation?: boolean; // Direct API (Level 2)
    isOffline?: boolean;   // Local Static (Level 3)
}

export interface Equipment {
    id: number;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    quartier?: string;
    installationType?: 'AERIEN' | 'SOUTERRAIN';
    installationDate?: string;
    age?: number;
    lastPreventiveMaintenance?: string;
    mttr?: number;
    zoneDensity?: 'COMMERCIALE' | 'INDUSTRIELLE' | 'RESIDENTIELLE';
    nearbyWork?: boolean;
    description?: string;
    standardMttr?: number;
    financialValue?: number;
    clientsAffected?: number;
    weeklyRiskAverage?: number;
}

export interface Incident {
    id: number;
    description: string;
    incidentDate: string;
    severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
    status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
    resolutionDate?: string;
}

export interface RiskForecast {
    dayName: string;
    date: string;
    riskScore: number;
    recommendation: string;
    urgencyLevel: string;
}

export interface EquipmentDetail extends Equipment {
    forecast: RiskForecast[];
}

export interface UserCompte {
    id: number;
    accountNumber: string;
    status: string;
}

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    role: string;
    civility?: string;
    profileImage?: string;
    compte?: Partial<UserCompte>;
}

export interface EquipmentRiskDetail {
    id: number;
    name: string;
    type: string;
    quartier?: string;
    riskScore: number;
    urgencyLevel: 'LOW' | 'HIGH' | 'CRITICAL';
}

export interface FleetDayRisk {
    date: string;
    dayName: string;
    equipments: EquipmentRiskDetail[];
}

export interface CriticalAsset {
    id: number;
    name: string;
    type: string;
    quartier: string;
    probability: number;
    urgency: string;
}

export interface PressureIndex {
    score: number;
    thermalStress: number[];
    windStress: number[];
    fragileZones: string[];
}

export interface AdvancedStats {
    evar: number;
    irg: number;
    populationShield: number;
    roiSavings: number;
    networkAvailability: number;
    anticipationRate: number;
    mttrCollapsed: number;
    iaConfidenceScore: number;
    top5CriticalAssets: CriticalAsset[];
    pressureIndex: PressureIndex;
    acceleratedDegradationRate: number;
    slaRuptureProbability: number;
}

/**
 * Senior Industrial Maintenance Service - TRIPLE-SAFE ARCHITECTURE.
 * 1. Primary: Spring Boot + ML.
 * 2. Secondary: Direct Open-Meteo API.
 * 3. Emergency: High-Quality Static Casablanca Defaults.
 */
export const getMaintenanceData = async (equipmentId?: number): Promise<MaintenanceStatus> => {
    // --- LEVEL 1: BACKEND ATTEMPT ---
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        const url = equipmentId
            ? `http://localhost:8080/api/dashboard/kpi/${equipmentId}`
            : `http://localhost:8080/api/dashboard/fleet-kpi`;

        const response = await fetch(url, {
            signal: controller.signal,
            headers: { ...getAuthHeaders() }
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Backend Offline");

        const data = await response.json();
        return processBackendData(data);

    } catch (error) {
        console.warn("⚠️ Level 1 Failed (Backend). Attempting Level 2 (Direct API)...", error);

        // --- LEVEL 2: DIRECT API ATTEMPT ---
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout for Open-Meteo

            const casaLat = 33.5731;
            const casaLon = -7.5898;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${casaLat}&longitude=${casaLon}&hourly=relative_humidity_2m,dew_point_2m,surface_pressure,visibility,uv_index&daily=weather_code,temperature_2m_max,wind_speed_10m_max&timezone=auto`;

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error("Meteo API Offline");

            const weather = await response.json();
            return processSimulatedData(weather);

        } catch (fallbackError) {
            console.error("⚠️ Level 2 Failed (Direct API). Activating Level 3 (Emergency Offline Mode).", fallbackError);

            // --- LEVEL 3: EMERGENCY OFFLINE MODE ---
            return processOfflineData();
        }
    }
};

/**
 * Logic to process real data from the Spring Boot orchestrator.
 */
const processBackendData = (data: any): MaintenanceStatus => {
    const forecast: DayForecast[] = (data.forecast || []).map((f: any, idx: number) => {
        const date = new Date();
        date.setDate(date.getDate() + idx);
        const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

        return {
            date: f.date || 'N/A',
            dayName: idx === 0 ? "Aujourd'hui" : dayNames[date.getDay()],
            temp: Math.round(f.temp || 0),
            humidity: Math.round(f.humidity || 0),
            pressure: Math.round(f.pressure || 1013),
            uvIndex: Math.round(f.uvIndex || 0),
            visibility: Math.round((f.visibility || 10000) / 1000),
            dewPoint: Math.round(f.dewPoint || 0),
            windSpeed: Math.round(f.windSpeed || 0),
            wmoCode: f.wmoCode || 0,
            riskScore: Math.round(f.riskScore || 0),
            recommendation: f.recommendation || 'Observation Nominale',
            urgencyLevel: f.urgencyLevel || 'LOW'
        };
    });

    return {
        currentRisk: mapRiskToCategory(data.currentRiskScore || 0),
        currentRiskScore: Math.round(data.currentRiskScore || 0),
        recommendation: data.recommendation || 'Système Stable',
        lastNotification: new Date().toLocaleTimeString(),
        threshold: 60,
        forecast,
        isSimulation: false,
        isOffline: false
    };
};

/**
 * Logic to process simulation data directly from Open-Meteo.
 */
const processSimulatedData = (weather: any): MaintenanceStatus => {
    const daily = weather.daily || { time: [], temperature_2m_max: [], wind_speed_10m_max: [], weather_code: [] };
    const hourly = weather.hourly || { relative_humidity_2m: [], surface_pressure: [], visibility: [], uv_index: [], dew_point_2m: [] };

    const forecast: DayForecast[] = (daily.time || []).map((t: string, i: number) => {
        const date = new Date(t);
        const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const sampleIdx = i * 24 + 12; // Midday sample for hourly

        const temp = daily.temperature_2m_max[i] || 20;
        const wind = daily.wind_speed_10m_max[i] || 15;
        const hum = (hourly.relative_humidity_2m && hourly.relative_humidity_2m[sampleIdx]) || 50;
        const code = daily.weather_code[i] || 0;
        const isLightning = code === 95 || code === 96 || code === 99;

        // Heuristic Inference
        let score = (wind * 0.8) + (hum * 0.15) + (temp * 0.2);
        if (isLightning) score += 40;
        score = Math.min(Math.max(score, 5), 98);

        return {
            date: t,
            dayName: i === 0 ? "Aujourd'hui" : dayNames[date.getDay()],
            temp: Math.round(temp),
            humidity: Math.round(hum),
            pressure: Math.round(hourly.surface_pressure[sampleIdx] || 1013),
            uvIndex: Math.round(hourly.uv_index[sampleIdx] || 0),
            visibility: Math.round((hourly.visibility[sampleIdx] || 10000) / 1000),
            dewPoint: Math.round(hourly.dew_point_2m[sampleIdx] || 10),
            windSpeed: Math.round(wind),
            wmoCode: code,
            riskScore: Math.round(score),
            recommendation: score > 60 ? "RÉPARATION D'URGENCE" : (score > 30 ? "MAINTENANCE REQUISE" : "SYSTÈME NOMINAL"),
            urgencyLevel: score > 60 ? "CRITICAL" : (score > 30 ? "HIGH" : "LOW")
        };
    });

    const current = forecast[0] || {} as any;
    return {
        currentRisk: mapRiskToCategory(current.riskScore || 0),
        currentRiskScore: current.riskScore || 0,
        recommendation: current.recommendation || 'Simulation Active',
        lastNotification: new Date().toLocaleTimeString(),
        threshold: 60,
        forecast,
        isSimulation: true,
        isOffline: false
    };
};

/**
 * --- LEVEL 3: EMERGENCY OFFLINE MODE ---
 * Static high-quality defaults for Casablanca.
 */
const processOfflineData = (): MaintenanceStatus => {
    const dayNames = ['Aujourd\'hui', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const forecast: DayForecast[] = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);

        return {
            date: date.toISOString().split('T')[0],
            dayName: dayNames[i],
            temp: 22 + Math.floor(Math.random() * 4),
            humidity: 65,
            pressure: 1015,
            uvIndex: 4,
            visibility: 10,
            dewPoint: 12,
            windSpeed: 20,
            wmoCode: 1,
            riskScore: 12,
            recommendation: "SYSTÈME NOMINAL : Sécurité locale garantie.",
            urgencyLevel: "LOW"
        };
    });

    return {
        currentRisk: 'LOW',
        currentRiskScore: 12,
        recommendation: "MODE HORS-LIGNE : Données de secours actives.",
        lastNotification: "N/A (HORS-LIGNE)",
        threshold: 60,
        forecast,
        isSimulation: false,
        isOffline: true
    };
};

const mapRiskToCategory = (score: number): MaintenanceStatus['currentRisk'] => {
    if (score > 60) return 'CRITICAL';
    if (score >= 30) return 'HIGH';
    return 'LOW';
};

/**
 * UI Mapper Logic
 */
export const mapRiskToUI = (score: number) => {
    if (score > 60) {
        return { status: "ALERTE CRITIQUE", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/30", badge: "RÉPARATION D'URGENCE", glow: "shadow-[0_0_50px_-12px_rgba(244,63,94,0.5)]" };
    } else if (score >= 30) {
        return { status: "RISQUE MODÉRÉ", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30", badge: "MAINTENANCE REQUISE", glow: "shadow-[0_0_50px_-12px_rgba(251,146,60,0.5)]" };
    } else {
        return { status: "SÉCURITÉ OPTIMALE", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30", badge: "SYSTÈME NOMINAL", glow: "shadow-[0_0_50px_-12px_rgba(52,211,153,0.5)]" };
    }
};

// --- NEW INDUSTRIAL APIs ---

const API_BASE = "http://localhost:8080/api";

/**
 * Helper to get authentication headers (Role-based for now).
 */
const getAuthHeaders = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    const storedUser = localStorage.getItem('monitor_ai_user');
    if (!storedUser) return {};
    try {
        const user = JSON.parse(storedUser);
        return { 'X-User-Role': user.role || 'VISITOR' };
    } catch {
        return {};
    }
};

/**
 * Fetch detailed diagnostic data for a specific asset, including its 7-day ML forecast.
 */
export const getEquipmentDetail = async (id: number): Promise<EquipmentDetail | null> => {
    try {
        const response = await fetch(`${API_BASE}/equipments/${id}`, {
            headers: { ...getAuthHeaders() }
        });
        if (!response.ok) throw new Error("Could not fetch equipment detail");
        return await response.json();
    } catch (error) {
        console.error("Equipment Detail API Failed:", error);
        return null;
    }
};

/**
 * Fetch all high-density industrial assets in Casablanca.
 */
export const getAllEquipments = async (): Promise<Equipment[]> => {
    try {
        const response = await fetch(`${API_BASE}/equipments`, {
            headers: { ...getAuthHeaders() }
        });
        if (!response.ok) throw new Error("Could not fetch equipments");
        return await response.json();
    } catch (error) {
        console.error("Equipment API Failed:", error);
        return []; // Fallback to empty list
    }
};

/**
 * Create a new industrial asset.
 */
export const createEquipment = async (equipment: Partial<Equipment>): Promise<Equipment | null> => {
    try {
        const response = await fetch(`${API_BASE}/equipments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(equipment)
        });
        if (!response.ok) throw new Error("Could not create equipment");
        return await response.json();
    } catch (error) {
        console.error("Create Equipment Failed:", error);
        return null;
    }
};

/**
 * Update an existing industrial asset.
 */
export const updateEquipment = async (id: number, equipment: Partial<Equipment>): Promise<Equipment | null> => {
    try {
        const response = await fetch(`${API_BASE}/equipments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(equipment)
        });
        if (!response.ok) throw new Error("Could not update equipment");
        return await response.json();
    } catch (error) {
        console.error("Update Equipment Failed:", error);
        return null;
    }
};

/**
 * Remove an industrial asset from the park.
 */
export const deleteEquipment = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE}/equipments/${id}`, {
            method: 'DELETE',
            headers: { ...getAuthHeaders() }
        });
        return response.ok;
    } catch (error) {
        console.error("Delete Equipment Failed:", error);
        return false;
    }
};

/**
 * Fetch historical diagnostic trace for a specific asset.
 */
export const getIncidentHistory = async (equipmentId: number): Promise<Incident[]> => {
    try {
        const response = await fetch(`${API_BASE}/incidents/equipment/${equipmentId}`, {
            headers: { ...getAuthHeaders() }
        });
        if (!response.ok) throw new Error("Could not fetch incidents");
        return await response.json();
    } catch (error) {
        console.error("Incident API Failed:", error);
        return [];
    }
};

/**
 * Fetch all incidents across the entire industrial park.
 */
export const getAllIncidents = async (): Promise<Incident[]> => {
    try {
        const response = await fetch(`${API_BASE}/incidents`, {
            headers: { ...getAuthHeaders() }
        });
        if (!response.ok) throw new Error("Could not fetch global incidents");
        return await response.json();
    } catch (error) {
        console.error("Global Incident API Failed:", error);
        return [];
    }
};

/**
 * Fetch all registered operators and system profiles.
 */
export const getUsers = async (): Promise<UserProfile[]> => {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            headers: { ...getAuthHeaders() }
        });
        if (!response.ok) throw new Error("Could not fetch users");
        return await response.json();
    } catch (error) {
        console.error("User API Failed:", error);
        return [];
    }
};

/**
 * Create a new user identity.
 */
export const createUser = async (user: Partial<UserProfile & { password?: string }>): Promise<UserProfile | null> => {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error("Could not create user");
        return await response.json();
    } catch (error) {
        console.error("Create User Failed:", error);
        return null;
    }
};

/**
 * Update an existing user trajectory.
 */
export const updateUser = async (id: number, user: Partial<UserProfile & { password?: string }>): Promise<UserProfile | null> => {
    try {
        const response = await fetch(`${API_BASE}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error("Could not update user");
        return await response.json();
    } catch (error) {
        console.error("Update User Failed:", error);
        return null;
    }
};

/**
 * Securely remove a user from the industrial baseline.
 */
export const deleteUser = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE}/users/${id}`, {
            method: 'DELETE',
            headers: { ...getAuthHeaders() }
        });
        return response.ok;
    } catch (error) {
        console.error("Delete User Failed:", error);
        return false;
    }
};
/**
 * Fetch detailed risk scores for the entire fleet for a specific day index (0-7).
 */
export const getFleetDayDetails = async (dayIndex: number): Promise<FleetDayRisk | null> => {
    try {
        const response = await fetch(`${API_BASE}/dashboard/fleet-day-details/${dayIndex}`, {
            headers: { ...getAuthHeaders() }
        });
        if (!response.ok) throw new Error("Could not fetch fleet day details");
        return await response.json();
    } catch (error) {
        console.error("Fleet Day Details API Failed:", error);
        return null;
    }
};

/**
 * Fetch advanced dashboard stats (12 specialized KPIs).
 */
export const getAdvancedStats = async (): Promise<AdvancedStats | null> => {
    try {
        const response = await fetch(`${API_BASE}/dashboard/advanced-stats`, {
            headers: { ...getAuthHeaders() }
        });
        if (!response.ok) throw new Error("Could not fetch advanced stats");
        return await response.json();
    } catch (error) {
        console.error("Advanced Stats API Failed:", error);
        return null;
    }
};

/**
 * --- NEW AUTHENTICATION & ACCOUNT APIs ---
 */

/**
 * Authenticate user via email and password.
 */
export const login = async (credentials: any): Promise<UserProfile | null> => {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (response.status === 401) {
            throw new Error("Identifiants incorrects");
        }
        if (!response.ok) {
            throw new Error("Authentification échouée");
        }
        return await response.json();
    } catch (error: any) {
        if (error.message === "Identifiants incorrects") {
            throw error;
        }
        console.error("Login API Failed:", error);
        throw new Error("Impossible de se connecter au serveur. Vérifiez votre connexion.");
    }
};

/**
 * Securely update a user's password.
 */
export const updateUserPassword = async (id: number, payload: any): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE}/users/${id}/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(payload)
        });
        return response.ok;
    } catch (error) {
        console.error("Update Password Failed:", error);
        return false;
    }
};

/**
 * Update partial account details (username, email) without full user replace.
 */
export const updateUserAccount = async (id: number, payload: any): Promise<UserProfile | null> => {
    try {
        const response = await fetch(`${API_BASE}/users/${id}/account`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Could not update account");
        return await response.json();
    } catch (error) {
        console.error("Update Account Failed:", error);
        throw error;
    }
};

/**
 * Update user's profile image (Base64 wrapper).
 */
export const updateUserImage = async (id: number, imageBase64: string): Promise<UserProfile | null> => {
    try {
        const response = await fetch(`${API_BASE}/users/${id}/image`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({ image: imageBase64 })
        });
        if (!response.ok) throw new Error(`Could not update profile image (Status: ${response.status})`);
        return await response.json();
    } catch (error) {
        console.error("Update Profile Image Failed:", error);
        throw error;
    }
};
