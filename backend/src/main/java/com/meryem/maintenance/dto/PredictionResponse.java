package com.meryem.maintenance.dto;

import lombok.Data;

@Data
public class PredictionResponse {
    private Double risk_score;
    private String recommendation;
    private String urgency_level;
    // Metadata weather info
    private Double temperature;
    private Double humidity;
    private Double pressure;
    private Double uvIndex;
    private Double visibility;
    private Double dewPoint;
    private Double wind_speed;
}
