package com.meryem.maintenance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String description;
    
    private LocalDateTime incidentDate;
    
    private String severity; // MINOR, MAJOR, CRITICAL
    
    private String status; // OPEN, IN_PROGRESS, CLOSED
    
    private LocalDateTime resolutionDate;
    
    // --- INDUSTRIAL PERFORMANCE METRICS ---
    private Double cost; // Cost of the intervention in MAD
    
    @Enumerated(EnumType.STRING)
    private MaintenanceType maintenanceType; // PREVENTIVE / CURATIVE
    
    private Double actualRepairTime; // Time taken to resolve in hours

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    @JsonIgnore
    private Equipment equipment;
}
