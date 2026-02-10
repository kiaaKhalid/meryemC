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
public class FleetDayRiskDTO {
    private String date;
    private String dayName;
    private List<EquipmentRiskDetail> equipments;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class EquipmentRiskDetail {
        private Long id;
        private String name;
        private String type;
        private String quartier;
        private Double riskScore;
        private String urgencyLevel;
    }
}
