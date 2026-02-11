package com.meryem.maintenance.dto;

public record RiskForecastDTO(
    String dayName,
    String date,
    Double riskScore,
    String recommendation,
    String urgencyLevel
) {}
