package com.meryem.maintenance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "weather_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeatherLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double temperature;
    private Double precipitation;
    private Double humidity;
    private Double windSpeed;
    private Boolean isLightning;
    private LocalDateTime logDate;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    @JsonIgnore
    private Equipment equipment;
}
