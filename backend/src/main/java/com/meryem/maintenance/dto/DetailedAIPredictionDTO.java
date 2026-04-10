package com.meryem.maintenance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

/**
 * Result DTO for the dual-model AI diagnosis (Keras NN + XGBoost).
 * Uses @JsonProperty to preserve the snake_case field names from the Python service response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetailedAIPredictionDTO {

    @JsonProperty("nn_analysis")
    private Map<String, Object> nnAnalysis;

    @JsonProperty("xgb_diagnosis")
    private String xgbDiagnosis;

    private String timestamp;
}
