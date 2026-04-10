package com.meryem.maintenance.service;

import com.meryem.maintenance.client.PredictionClient;
import com.meryem.maintenance.dto.DashboardStatsDTO;
import com.meryem.maintenance.dto.ExpertPredictionResponse;
import com.meryem.maintenance.dto.ExpertInferenceDTO;
import com.meryem.maintenance.dto.DetailedAIPredictionDTO;
import com.meryem.maintenance.dto.WeatherRequest;
import com.meryem.maintenance.entity.*;
import com.meryem.maintenance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Senior Industrial Dashboard Service.
 * Orchestrates KPI calculations and AI inference delegation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final EquipmentRepository equipmentRepository;
    private final IncidentRepository incidentRepository;
    private final MaintenanceAlertRepository alertRepository;
    private final WeatherService weatherService;
    private final PredictionClient predictionClient;

    public DashboardStatsDTO getAdvancedStats() {
        List<Equipment> equipments = equipmentRepository.findAll();
        List<Incident> incidents = incidentRepository.findAll();
        List<MaintenanceAlert> activeAlerts = alertRepository.findAll();
        
        // Fetch Real-Time Predictions from Keras Model
        List<WeatherRequest> forecast = weatherService.getWeeklyForecast();
        
        // Pick a representative equipment or average state for global KPIs
        Equipment defaultEq = !equipments.isEmpty() ? equipments.get(0) : new Equipment();
        ExpertInferenceDTO globalInference = mapToInferenceDTO(
            forecast != null && !forecast.isEmpty() ? forecast.get(0) : new WeatherRequest(),
            defaultEq,
            0 // Today
        );
        
        List<ExpertPredictionResponse> predictions = predictionClient.getExpertPredictions(List.of(globalInference));
        
        ExpertPredictionResponse globalRisk = (predictions != null && !predictions.isEmpty()) 
            ? predictions.get(0) : new ExpertPredictionResponse();

        return DashboardStatsDTO.builder()
                .evar(calculateEVaR(activeAlerts))
                .irg(calculateIRG(incidents, activeAlerts))
                .populationShield(calculatePopulationShield(activeAlerts))
                .roiSavings(calculateROI(incidents))
                .networkAvailability(calculateAvailability(incidents))
                .anticipationRate(calculateAnticipationRate(incidents))
                .mttrCollapsed(calculateMTTRCollapsed(incidents, equipments))
                .iaConfidenceScore(globalRisk.getRisk_score() != null ? 100.0 - (globalRisk.getRisk_score() / 10.0) : 92.5)
                .top5CriticalAssets(getTop5CriticalAssets(activeAlerts))
                .pressureIndex(calculatePressureIndex(forecast))
                .acceleratedDegradationRate(12.5)
                .slaRuptureProbability(calculateSLARuptureProb(activeAlerts))
                .build();
    }

    private Double calculateEVaR(List<MaintenanceAlert> alerts) {
        return alerts.stream()
                .filter(a -> a.getRiskScore() != null && a.getRiskScore() > 80)
                .mapToDouble(a -> {
                    Equipment e = a.getEquipment();
                    return (e != null && e.getFinancialValue() != null) ? e.getFinancialValue() : 0.0;
                })
                .sum();
    }

    private Double calculateIRG(List<Incident> incidents, List<MaintenanceAlert> alerts) {
        LocalDateTime monthAgo = LocalDateTime.now().minusMonths(1);
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        
        long pannesMois = incidents.stream().filter(i -> i.getIncidentDate().isAfter(monthAgo)).count();
        long alertesVeille = alerts.stream().filter(a -> a.getAlertDate().isAfter(yesterday)).count();
        
        return Math.max(0.0, 100.0 - (pannesMois + alertesVeille) / 2.0);
    }

    private Integer calculatePopulationShield(List<MaintenanceAlert> alerts) {
        return alerts.stream()
                .filter(a -> a.getRiskScore() != null && a.getRiskScore() > 80)
                .mapToInt(a -> {
                    Equipment e = a.getEquipment();
                    return (e != null && e.getClientsAffected() != null) ? e.getClientsAffected() : 0;
                })
                .sum();
    }

    private Double calculateROI(List<Incident> incidents) {
        double curativeAvoidedCost = incidents.stream()
                .filter(i -> i.getMaintenanceType() == MaintenanceType.CURATIVE && "CLOSED".equals(i.getStatus()))
                .mapToDouble(i -> i.getCost() != null ? i.getCost() : 50000.0)
                .sum();
        
        double preventiveCost = incidents.stream()
                .filter(i -> i.getMaintenanceType() == MaintenanceType.PREVENTIVE)
                .mapToDouble(i -> i.getCost() != null ? i.getCost() : 5000.0)
                .sum();
                
        return curativeAvoidedCost - preventiveCost;
    }

    private Double calculateAvailability(List<Incident> incidents) {
        double totalDowntime = incidents.stream()
                .filter(i -> i.getIncidentDate().isAfter(LocalDateTime.now().minusMonths(1)) && i.getActualRepairTime() != null)
                .mapToDouble(Incident::getActualRepairTime)
                .sum();
        return Math.max(0.0, ((720.0 - totalDowntime) / 720.0) * 100.0);
    }

    private Double calculateAnticipationRate(List<Incident> incidents) {
        if (incidents.isEmpty()) return 100.0;
        long preventive = incidents.stream().filter(i -> i.getMaintenanceType() == MaintenanceType.PREVENTIVE).count();
        return (double) preventive / incidents.size() * 100.0;
    }

    private Double calculateMTTRCollapsed(List<Incident> incidents, List<Equipment> equipments) {
        double standardTotal = equipments.stream().mapToDouble(e -> e.getStandardMttr() != null ? e.getStandardMttr() : 6.0).sum();
        double actualTotal = incidents.stream().filter(i -> i.getActualRepairTime() != null).mapToDouble(Incident::getActualRepairTime).sum();
        return Math.max(0.0, standardTotal - actualTotal);
    }

    private List<DashboardStatsDTO.CriticalAssetDTO> getTop5CriticalAssets(List<MaintenanceAlert> alerts) {
        return alerts.stream()
                .sorted((a, b) -> Double.compare(
                        b.getRiskScore() != null ? b.getRiskScore() : 0.0,
                        a.getRiskScore() != null ? a.getRiskScore() : 0.0))
                .limit(5)
                .map(a -> DashboardStatsDTO.CriticalAssetDTO.builder()
                        .id(a.getEquipment().getId())
                        .name(a.getEquipment().getName())
                        .type(a.getEquipment().getType())
                        .quartier(a.getEquipment().getQuartier())
                        .probability(a.getRiskScore())
                        .urgency(a.getUrgencyLevel())
                        .build())
                .toList();
    }

    private DashboardStatsDTO.PressureIndexDTO calculatePressureIndex(List<WeatherRequest> forecast) {
        if (forecast == null || forecast.isEmpty()) {
            return DashboardStatsDTO.PressureIndexDTO.builder().score(1).fragileZones(List.of()).build();
        }
        
        List<Double> temps = forecast.stream().limit(4).map(WeatherRequest::getTemperature).toList();
        List<Double> winds = forecast.stream().limit(4).map(WeatherRequest::getWindSpeed).toList();
        
        int score = (int) forecast.stream().filter(w -> w.getTemperature() > 35 || w.getWindSpeed() > 50).count();
        
        int clampedScore = Math.min(5, Math.max(1, score)); // NOSONAR: Math.clamp requires Java 21+, project targets Java 17
        return DashboardStatsDTO.PressureIndexDTO.builder()
                .score(clampedScore)
                .thermalStress(temps)
                .windStress(winds)
                .fragileZones(List.of("Anfa", "Sidi Ma\u00e2rouf", "Bourgogne"))
                .build();
    }

    public Double calculateSLARuptureProb(List<MaintenanceAlert> alerts) {
        if (alerts.isEmpty()) return 0.0;
        long problematic = alerts.stream()
                .filter(a -> a.getEstimatedRepairTime() != null && a.getLegalDeadline() != null 
                             && a.getEstimatedRepairTime() > a.getLegalDeadline())
                .count();
        return (double) problematic / alerts.size() * 100.0;
    }

    public DetailedAIPredictionDTO getDetailedAIPrediction(Long id, Integer dayIndex) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        
        List<WeatherRequest> forecast = weatherService.getWeeklyForecast();
        WeatherRequest targetWeather = (forecast != null && forecast.size() > dayIndex) 
            ? forecast.get(dayIndex) 
            : WeatherRequest.builder()
                .temperature(22.0)
                .precipitation(0.0)
                .humidity(70.0)
                .windSpeed(15.0)
                .isLightning(false)
                .build();
            
        ExpertInferenceDTO inferenceData = mapToInferenceDTO(targetWeather, equipment, dayIndex);
        return predictionClient.getDetailedPrediction(inferenceData);
    }

    private ExpertInferenceDTO mapToInferenceDTO(WeatherRequest w, Equipment e, int dayOffset) {
        LocalDateTime targetDate = LocalDateTime.now().plusDays(dayOffset);
        
        int age = e.getInstallationDate() != null 
            ? (int) java.time.temporal.ChronoUnit.YEARS.between(e.getInstallationDate(), java.time.LocalDate.now()) 
            : 10;

        long daysSinceMaint = e.getLastPreventiveMaintenance() != null 
            ? java.time.temporal.ChronoUnit.DAYS.between(e.getLastPreventiveMaintenance(), LocalDateTime.now())
            : 180;

        return ExpertInferenceDTO.builder()
            .mois(targetDate.getMonthValue())
            .jourSemaine(targetDate.getDayOfWeek().getValue() - 1)
            .saison(calculateSaison(targetDate.getMonthValue()))
            .humiditeMeteo(w.getHumidity() != null ? w.getHumidity() : 65.0)
            .ventVitesse(w.getWindSpeed() != null ? w.getWindSpeed() : 15.0)
            .foudre(Boolean.TRUE.equals(w.getIsLightning()) ? 1 : 0)
            .precipitations(w.getPrecipitation() != null ? w.getPrecipitation() : 0.0)
            .temperature(w.getTemperature() != null ? w.getTemperature() : 25.0)
            .uvExposure(w.getUvIndex() != null ? w.getUvIndex() : 5.0)
            .typeInstallation(e.getInstallationType() != null ? e.getInstallationType().name() : "AERIEN")
            .ageEquipementAns(age)
            .joursDerniereMainenance((int) daysSinceMaint)
            .dureeMoyenneReparationH(e.getMttr() != null ? e.getMttr() : 4.0)
            .frequencePannesPassees(e.getFaultFrequency() != null ? e.getFaultFrequency().intValue() : 2)
            .zoneDensite(e.getZoneDensity() != null ? e.getZoneDensity().name() : "RESIDENTIELLE")
            .travauxProximite(Boolean.TRUE.equals(e.getNearbyWork()) ? 1 : 0)
            .valeurFinanciereDh(e.getFinancialValue() != null ? e.getFinancialValue() : 50000.0)
            .build();
    }

    private String calculateSaison(int month) {
        if (month >= 3 && month <= 5) return "Printemps";
        if (month >= 6 && month <= 8) return "Et\u00e9";
        if (month >= 9 && month <= 11) return "Automne";
        return "Hiver";
    }
}