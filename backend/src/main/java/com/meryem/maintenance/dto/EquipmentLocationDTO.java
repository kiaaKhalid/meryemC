package com.meryem.maintenance.dto;
import java.time.LocalDate;

public record EquipmentLocationDTO(
        Long id,
        String name,
        String type,
        Double latitude,
        Double longitude,
        LocalDate installationDate,
        Integer age,
        String zoneDensity,
        String quartier,
        Double mttr,
        Double weeklyRiskAverage) {
}
