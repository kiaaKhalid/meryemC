package com.meryem.maintenance.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class KPIDashboardDTO {
    private Long equipmentId;
    private String equipmentName;
    private Double currentRiskScore;
    private String recommendation;
    private String urgencyLevel;
    private List<HistoricalRisk> history;
    private List<DailyForecast> forecast;

    @Data
    @Builder
    public static class DailyForecast {
        private String date;
        private Double riskScore;
        private String recommendation;
        private String urgencyLevel;
        private Double temp;
        private Double humidity;
        private Double pressure;
        private Double uvIndex;
        private Double visibility;
        private Double dewPoint;
        private Double windSpeed;
        private Integer wmoCode;
    }

    @Data
    @Builder
    public static class HistoricalRisk {
        private String date;
        private Double score;
    }
}
