package com.meryem.maintenance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertPredictionResponse {
    private Double failure_probability;
    private Double risk_score;
    private Double impact_gravity;
    private Integer clients_affected;
    private String failure_type;
    private String urgency_level;
    private String recommendation;
    private String failure_horizon;
}
