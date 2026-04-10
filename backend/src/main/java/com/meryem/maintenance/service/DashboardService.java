package com.meryem.maintenance.service;

import com.meryem.maintenance.client.PredictionClient;
import com.meryem.maintenance.dto.DashboardStatsDTO;
import com.meryem.maintenance.dto.ExpertPredictionResponse;
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
        
        List<WeatherRequest> forecast = weatherService.getWeeklyForecast();
        
        List<ExpertPredictionResponse> predictions = (forecast != null && !forecast.isEmpty())
            ? predictionClient.getExpertPredictions(List.of(forecast.get(0)))
            : Collections.emptyList();
        
        ExpertPredictionResponse globalRisk = (!predictions.isEmpty()) 
            ? predictions.get(0) : ExpertPredictionResponse.builder().risk_score(15.0).build();

        return DashboardStatsDTO.builder()
                .evar(calculateEVaR(equipments, activeAlerts))
                .irg(calculateIRG(incidents, activeAlerts))
                .populationShield(calculatePopulationShield(equipments, activeAlerts))
                .roiSavings(calculateROI(incidents))
                .networkAvailability(calculateAvailability(incidents))
                .anticipationRate(calculateAnticipationRate(incidents))
                .mttrCollapsed(calculateMTTRCollapsed(incidents, equipments))
                .iaConfidenceScore(globalRisk.getRisk_score() != null ? 100.0 - (globalRisk.getRisk_score() / 10.0) : 92.5)
                .top5CriticalAssets(getTop5CriticalAssets(equipments, activeAlerts))
                .pressureIndex(calculatePressureIndex(forecast))
                .acceleratedDegradationRate(12.5)
                .slaRuptureProbability(calculateSLARuptureProb(activeAlerts))
                .build();
    }

    private Double calculateEVaR(List<Equipment> equipments, List<MaintenanceAlert> alerts) {
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

    private Integer calculatePopulationShield(List<Equipment> equipments, List<MaintenanceAlert> alerts) {

                .filter(a -> a.getRiskScore() != null && a.getRiskScore() > 80)
                .mapToInt(a -> {

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

    private List<DashboardStatsDTO.CriticalAssetDTO> getTop5CriticalAssets(List<Equipment> equipments, List<MaintenanceAlert> alerts) {
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
                .collect(Collectors.toList());
    }

    private DashboardStatsDTO.PressureIndexDTO calculatePressureIndex(List<WeatherRequest> forecast) {
        if (forecast == null || forecast.isEmpty()) {
            return DashboardStatsDTO.PressureIndexDTO.builder().score(1).fragileZones(List.of()).build();
        }
        
        List<Double> temps = forecast.stream().limit(4).map(WeatherRequest::getTemperature).collect(Collectors.toList());
        List<Double> winds = forecast.stream().limit(4).map(WeatherRequest::getWind_speed).collect(Collectors.toList());
        
        int score = (int) forecast.stream().filter(w -> w.getTemperature() > 35 || w.getWind_speed() > 50).count();
        
        return DashboardStatsDTO.PressureIndexDTO.builder()
                .score(Math.min(5, Math.max(1, score)))
         

                .fragileZones(List.of("Anfa", "Sidi Maârouf", "Bourgogne"))
                
                .build();
}