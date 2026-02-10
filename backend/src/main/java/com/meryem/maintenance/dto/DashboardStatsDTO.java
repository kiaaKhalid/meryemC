package com.meryem.maintenance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    // Phase 1: Direction Générale
    private Double evar; // Economic Value-at-Risk
    private Double irg; // Score de Résilience Globale
    private Integer populationShield; // Citizens in red zone
    private Double roiSavings; // Money saved by AI
    private Double networkAvailability; // % availability

    // Phase 2: Commandement
    private Double anticipationRate; // % Preventive vs Curative
    private Double mttrCollapsed; // Hours saved
    private Double iaConfidenceScore; // Reliability %
    private List<CriticalAssetDTO> top5CriticalAssets;

    // Phase 3: Analyse Environnementale
    private PressureIndexDTO pressureIndex;
    private Double acceleratedDegradationRate; // % aging
    private Double slaRuptureProbability; // % risk of SLA breach

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CriticalAssetDTO {
        private Long id;
        private String name;
        private String type;
        private String quartier;
        private Double probability;
        private String urgency;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PressureIndexDTO {
        private Integer score; // 1-5
        private List<Double> thermalStress; // 48h forecast
        private List<Double> windStress; // 48h forecast
        private List<String> fragileZones;
    }
}
