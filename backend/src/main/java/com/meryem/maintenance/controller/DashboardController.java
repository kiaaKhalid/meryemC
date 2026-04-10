package com.meryem.maintenance.controller;

import com.meryem.maintenance.client.PredictionClient;
import com.meryem.maintenance.dto.FleetDayRiskDTO;
import com.meryem.maintenance.dto.KPIDashboardDTO;
import com.meryem.maintenance.dto.PredictionResponse;
import com.meryem.maintenance.dto.WeatherRequest;
import com.meryem.maintenance.entity.Equipment;
import com.meryem.maintenance.entity.MaintenanceAlert;
import com.meryem.maintenance.repository.EquipmentRepository;
import com.meryem.maintenance.repository.MaintenanceAlertRepository;
import com.meryem.maintenance.service.WeatherService;
import com.meryem.maintenance.service.DashboardService;
import com.meryem.maintenance.dto.DashboardStatsDTO;
import com.meryem.maintenance.dto.DetailedAIPredictionDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Controller for the Industrial Diagnostic Dashboard.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*")
@Slf4j
public class DashboardController {

    private final EquipmentRepository equipmentRepository;
    private final MaintenanceAlertRepository alertRepository;
    private final WeatherService weatherService;
    private final PredictionClient predictionClient;
    private final DashboardService dashboardService;

    @GetMapping("/advanced-stats")
    public ResponseEntity<DashboardStatsDTO> getAdvancedStats() {
        return ResponseEntity.ok(dashboardService.getAdvancedStats());
    }

    @GetMapping("/kpi/{equipmentId}")
    public ResponseEntity<KPIDashboardDTO> getEquipmentKPI(@PathVariable Long equipmentId) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        List<MaintenanceAlert> alerts = alertRepository.findByEquipmentIdOrderByAlertDateDesc(equipmentId,
                PageRequest.of(0, 10));

        List<KPIDashboardDTO.HistoricalRisk> history = alerts.stream()
                .map(a -> KPIDashboardDTO.HistoricalRisk.builder()
                        .date(a.getAlertDate().toString())
                        .score(a.getRiskScore())
                        .build())
                .toList();

        List<WeatherRequest> weatherList = weatherService.getWeeklyForecast();
        List<PredictionResponse> predictions = predictionClient.getWeeklyPredictions(weatherList);

        List<KPIDashboardDTO.DailyForecast> forecast = new ArrayList<>();
        for (int i = 0; i < weatherList.size(); i++) {
            WeatherRequest w = weatherList.get(i);
            PredictionResponse p = predictions.get(i);

            forecast.add(KPIDashboardDTO.DailyForecast.builder()
                    .date(p.getRisk_score() != null ? "Jour " + (i + 1) : "N/A")
                    .riskScore(p.getRisk_score())
                    .recommendation(p.getRecommendation())
                    .urgencyLevel(p.getUrgency_level())
                    .temp(w.getTemperature())
                    .humidity(w.getHumidity())
                    .pressure(w.getPressure())
                    .uvIndex(w.getUvIndex())
                    .visibility(w.getVisibility())
                    .dewPoint(w.getDewPoint())
                    .windSpeed(w.getWindSpeed())
                    .wmoCode(Boolean.TRUE.equals(w.getIsLightning()) ? 95 : 0)
                    .build());
        }

        MaintenanceStatus currentStatus = calculateCurrentStatus(predictions);

        KPIDashboardDTO dashboard = KPIDashboardDTO.builder()
                .equipmentId(equipment.getId())
                .equipmentName(equipment.getName())
                .currentRiskScore(currentStatus.score)
                .recommendation(currentStatus.recommendation)
                .urgencyLevel(currentStatus.urgency)
                .history(history)
                .forecast(forecast)
                .build();

        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/fleet-kpi")
    public ResponseEntity<KPIDashboardDTO> getFleetKPI() {
        List<Equipment> equipments = equipmentRepository.findAll();
        if (equipments.isEmpty()) {
            return ResponseEntity.ok(KPIDashboardDTO.builder().equipmentName("N/A").forecast(new ArrayList<>()).build());
        }

        List<WeatherRequest> weatherList = weatherService.getWeeklyForecast();
        List<PredictionResponse> basePredictions = predictionClient.getWeeklyPredictions(weatherList);

        int daysCount = (basePredictions != null) ? basePredictions.size() : 7;
        double[][] fleetGrid = new double[equipments.size()][daysCount];
        for (int eIdx = 0; eIdx < equipments.size(); eIdx++) {
            double offset = calculateEquipmentOffset(equipments.get(eIdx));
            for (int dIdx = 0; dIdx < daysCount; dIdx++) {
                double base = (basePredictions != null && dIdx < basePredictions.size()) ? basePredictions.get(dIdx).getRisk_score() : 15.0;
                fleetGrid[eIdx][dIdx] = Math.min(95.0, base + offset);
            }
        }
        
        List<KPIDashboardDTO.DailyForecast> fleetForecast = new ArrayList<>();
        for (int dIdx = 0; dIdx < daysCount; dIdx++) {
            double dailySum = 0;
            for (int eIdx = 0; eIdx < equipments.size(); eIdx++) dailySum += fleetGrid[eIdx][dIdx];
            double avg = dailySum / equipments.size();
            
            WeatherRequest w = (weatherList != null && dIdx < weatherList.size()) ? weatherList.get(dIdx) : new WeatherRequest();
            fleetForecast.add(KPIDashboardDTO.DailyForecast.builder()
                    .date("Jour " + (dIdx + 1))
                    .riskScore(Math.round(avg * 10.0) / 10.0)
                    .temp(w.getTemperature())
                    .humidity(w.getHumidity())
                    .build());
        }

        return ResponseEntity.ok(KPIDashboardDTO.builder()
                .equipmentName("Global")
                .forecast(fleetForecast)
                .build());
    }

    @GetMapping("/fleet-day-details/{dayIndex}")
    public ResponseEntity<FleetDayRiskDTO> getFleetDayDetails(@PathVariable int dayIndex) {
        List<WeatherRequest> weatherList = weatherService.getWeeklyForecast();
        List<PredictionResponse> predictions = predictionClient.getWeeklyPredictions(weatherList);
        
        if (predictions == null || dayIndex >= predictions.size()) return ResponseEntity.badRequest().build();

        PredictionResponse p = predictions.get(dayIndex);
        List<FleetDayRiskDTO.EquipmentRiskDetail> details = equipmentRepository.findAll().stream()
            .map(eq -> {
                double score = Math.min(98.0, (p.getRisk_score() != null ? p.getRisk_score() : 15.0) + calculateEquipmentOffset(eq));
                return FleetDayRiskDTO.EquipmentRiskDetail.builder()
                    .id(eq.getId())
                    .name(eq.getName())
                    .riskScore(Math.round(score * 10.0) / 10.0)
                    .urgencyLevel(score > 60 ? "CRITICAL" : "LOW")
                    .build();
            }).toList();

        return ResponseEntity.ok(FleetDayRiskDTO.builder().date(LocalDate.now().plusDays(dayIndex).toString()).equipments(details).build());
    }

    @GetMapping("/equipment-prediction/{id}/{dayIndex}")
    public ResponseEntity<DetailedAIPredictionDTO> getEquipmentPrediction(@PathVariable Long id, @PathVariable Integer dayIndex) {
        return ResponseEntity.ok(dashboardService.getDetailedAIPrediction(id, dayIndex));
    }

    private double calculateEquipmentOffset(Equipment eq) {
        int age = eq.getInstallationDate() != null ? (int) ChronoUnit.YEARS.between(eq.getInstallationDate(), LocalDate.now()) : 0;
        return (age * 0.15) + (eq.getId() % 5);
    }

    private MaintenanceStatus calculateCurrentStatus(List<PredictionResponse> p) {
        if (p.isEmpty()) return new MaintenanceStatus(0.0, "N/A", "NORMAL");
        return new MaintenanceStatus(p.get(0).getRisk_score(), p.get(0).getRecommendation(), p.get(0).getUrgency_level());
    }

    private static class MaintenanceStatus {
        double score;
        String recommendation;
        String urgency;

        MaintenanceStatus(Double s, String r, String u) {
            this.score = s != null ? s : 0.0;
            this.recommendation = r;
            this.urgency = u;
        }
    }
}
