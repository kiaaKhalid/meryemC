package com.meryem.maintenance.dto;

import lombok.Data;

@Data
public class WeatherRequest {
    private Double temperature;
    private Double precipitation;
    private Double humidity;
    private Double wind_speed;
    private Boolean is_lightning;
    private Double pressure;
    private Double uvIndex;
    private Double dewPoint;
    private Double visibility;
    private Double windDirection;
    private Double apparentTemperature;
}
