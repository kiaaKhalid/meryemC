package com.meryem.maintenance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "maintenance_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double riskScore;
    private String recommendation;
    private String urgencyLevel;
    private String typeAction;
    private String niveauRisque;
    private LocalDateTime alertDate;
    
    // --- SLA & FORECASTING ---
    private Double estimatedRepairTime; // Estimated duration in hours
    private Double legalDeadline; // Max duration authorized by SLA/Law (hours)

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    @JsonIgnore
    private Equipment equipment;
}
