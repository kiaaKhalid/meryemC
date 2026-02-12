package com.meryem.maintenance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "equipments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private Double latitude;
    private Double longitude;

    // --- ENHANCED TELEMETRY & CONTEXT ---
    private String quartier;
    
    @Enumerated(EnumType.STRING)
    private InstallationType installationType; // SOUTERRAIN / AERIEN
    
    private LocalDate installationDate; // Commissioning date
    private LocalDateTime lastPreventiveMaintenance;
    private Double mttr; // Mean Time To Repair (in hours)
    private Double faultFrequency; // Avg failures per year
    
    @Enumerated(EnumType.STRING)
    private ZoneDensity zoneDensity; // COMMERCIALE, INDUSTRIELLE, RESIDENTIELLE
    
    private Boolean nearbyWork; // If there is ongoing construction nearby
    
    // --- ADVANCED INDUSTRIAL METRICS ---
    private Double financialValue; // Replacement/Insurance value in MAD
    private Integer clientsAffected; // Number of citizens impacted by failure
    private Double standardMttr; // Baseline Mean Time To Repair (hours)

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<MaintenanceAlert> alerts;
    
    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<WeatherLog> weatherLogs;

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Incident> incidents;
}
