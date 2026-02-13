package com.meryem.maintenance.mapper;

import com.meryem.maintenance.dto.WeatherRequest;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Senior Mapper for transforming Open-Meteo responses into internal DTOs.
 * Optimized for Casablanca hourly expansion.
 */
@Component
public class WeatherMapper {

    /**
     * Maps the expanded Daily and Hourly arrays to a List of WeatherRequest objects.
     */
    public List<WeatherRequest> mapExpandedResponseToRequests(Map<String, Object> response) {
        List<WeatherRequest> requests = new ArrayList<>();
        
        Map<String, Object> daily = (Map<String, Object>) response.get("daily");
        Map<String, Object> hourly = (Map<String, Object>) response.get("hourly");

        List<String> dailyTimes = (List<String>) daily.get("time");
        List<?> weatherCodes = (List<?>) daily.get("weather_code");
        List<?> temps = (List<?>) daily.get("temperature_2m_max");
        List<?> precipitations = (List<?>) daily.get("precipitation_sum");
        List<?> winds = (List<?>) daily.get("wind_speed_10m_max");

        // Hourly-only parameters (Arrays of length 168)
        List<?> humidities = (List<?>) hourly.get("relative_humidity_2m");
        List<?> pressures = (List<?>) hourly.get("surface_pressure");
        List<?> visibilities = (List<?>) hourly.get("visibility");
        List<?> uvIndices = (List<?>) hourly.get("uv_index");
        List<?> dewPoints = (List<?>) hourly.get("dew_point_2m");
        List<?> directions = (List<?>) hourly.get("wind_direction_10m");
        List<?> apparentTemps = (List<?>) hourly.get("apparent_temperature");

        // Iterate through the 7 days
        for (int i = 0; i < dailyTimes.size(); i++) {
            WeatherRequest request = new WeatherRequest();
            
            // Representative hour: 12:00 PM for each day
            int sampleIdx = i * 24 + 12;

            // Map Daily fields
            request.setTemperature(Double.valueOf(temps.get(i).toString()));
            request.setPrecipitation(Double.valueOf(precipitations.get(i).toString()));
            request.setWind_speed(Double.valueOf(winds.get(i).toString()));

            // Map Hourly fields (sampling midday)
            request.setHumidity(Double.valueOf(humidities.get(sampleIdx).toString()));
            request.setPressure(Double.valueOf(pressures.get(sampleIdx).toString()));
            request.setVisibility(Double.valueOf(visibilities.get(sampleIdx).toString()));
            request.setUvIndex(Double.valueOf(uvIndices.get(sampleIdx).toString()));
            request.setDewPoint(Double.valueOf(dewPoints.get(sampleIdx).toString()));
            request.setWindDirection(Double.valueOf(directions.get(sampleIdx).toString()));
            request.setApparentTemperature(Double.valueOf(apparentTemps.get(sampleIdx).toString()));

            // Logic for isLightning based on WMO codes: 95, 96, 99
            int code = Integer.parseInt(weatherCodes.get(i).toString());
            boolean isLightning = (code == 95 || code == 96 || code == 99);
            request.setIs_lightning(isLightning);
            
            requests.add(request);
        }
        
        return requests;
    }

    public List<WeatherRequest> mapDailyResponseToRequests(Map<String, Object> daily) {
        // Keeping legacy for compatibility if needed elsewhere
        return new ArrayList<>(); 
    }
}
