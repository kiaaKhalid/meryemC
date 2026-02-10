package com.meryem.maintenance.dto;

import java.util.List;
import java.time.LocalDate;

public record EquipmentDetailDTO(
    Long id,
    String name,
    String type,
    LocalDate installationDate,
    Integer age,
    String zoneDensity,
    String quartier,
    Double mttr,
    List<RiskForecastDTO> forecast
) {}
