package com.meryem.maintenance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Incoming weather data from the Open-Meteo API.
 * Uses @JsonProperty to handle snake_case JSON fields while keeping Java fields camelCase.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherRequest {
    private Double temperature;
    private Double precipitation;
    private Double humidity;

    @JsonProperty("wind_speed")
    private Double windSpeed;

    @JsonProperty("is_lightning")
    private Boolean isLightning;

    private Double pressure;
    private Double uvIndex;
    private Double dewPoint;
    private Double visibility;
    private Double windDirection;
    private Double apparentTemperature;
}
