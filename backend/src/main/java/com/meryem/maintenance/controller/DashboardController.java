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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

        // 1. Fetch Latest Risk History
        List<MaintenanceAlert> alerts = alertRepository.findByEquipmentIdOrderByAlertDateDesc(equipmentId,
                PageRequest.of(0, 10));

        List<KPIDashboardDTO.HistoricalRisk> history = alerts.stream()
                .map(a -> KPIDashboardDTO.HistoricalRisk.builder()
                        .date(a.getAlertDate().toString())
                        .score(a.getRiskScore())
                        .build())
                .toList();

        // 2. Fetch Live 7-Day Casablanca Forecast (Comprehensive)
        List<WeatherRequest> weatherList = weatherService.getWeeklyForecast();
        List<PredictionResponse> predictions = predictionClient.getWeeklyPredictions(weatherList);

        // 3. Map to Dashboard Forecast DTO
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
                    .windSpeed(w.getWind_speed())
                    .wmoCode(Boolean.TRUE.equals(w.getIs_lightning()) ? 95 : 0) // Simplified mapping
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

    /**
     * Fleet Intelligence: Aggregates risk telemetry for ALL industrial assets.
     * Computes city-wide average risk while adhering to worst-case recommendation logic.
     */
    @GetMapping("/fleet-kpi")
    public ResponseEntity<KPIDashboardDTO> getFleetKPI() {
        List<Equipment> equipments = equipmentRepository.findAll();
        if (equipments.isEmpty()) {
            return ResponseEntity.ok(createEmptyKPIDashboard());
        }

        List<WeatherRequest> weatherList = weatherService.getWeeklyForecast();
        List<PredictionResponse> basePredictions = predictionClient.getWeeklyPredictions(weatherList);

        int daysCount = (basePredictions != null) ? basePredictions.size() : 7;
        double[][] fleetGrid = calculateFleetGrid(equipments, basePredictions, daysCount);
        
        List<KPIDashboardDTO.DailyForecast> fleetForecast = generateFleetForecast(equipments.size(), daysCount, fleetGrid, weatherList, basePredictions);
        double fleetCurrentTotal = calculateCurrentFleetTotal(fleetGrid, equipments.size());

        KPIDashboardDTO globalDashboard = KPIDashboardDTO.builder()
                .equipmentId(0L)
                .equipmentName("Flotte de Casablanca (Global)")
                .currentRiskScore(Math.round(fleetCurrentTotal * 10.0) / 10.0)
                .recommendation(fleetCurrentTotal > 60 ? "ALERTE FLOTTE : Maintenance Requise" : "SYSTÈME FLOTTE NOMINAL")
                .urgencyLevel(calculateUrgencyLevel(fleetCurrentTotal))
                .history(new ArrayList<>())
                .forecast(fleetForecast)
                .build();

        return ResponseEntity.ok(globalDashboard);
    }

    private KPIDashboardDTO createEmptyKPIDashboard() {
        return KPIDashboardDTO.builder()
                .equipmentName("Aucun équipement trouvé")
                .currentRiskScore(0.0)
                .forecast(new ArrayList<>())
                .build();
    }

    private double[][] calculateFleetGrid(List<Equipment> equipments, List<PredictionResponse> basePredictions, int daysCount) {
        double[][] fleetGrid = new double[equipments.size()][daysCount];
        for (int eIdx = 0; eIdx < equipments.size(); eIdx++) {
            Equipment eq = equipments.get(eIdx);
            double equipmentOffset = calculateEquipmentOffset(eq);
            for (int dIdx = 0; dIdx < daysCount; dIdx++) {
                double baseScore = (basePredictions != null && dIdx < basePredictions.size()) 
                                   ? basePredictions.get(dIdx).getRisk_score() : 15.0;
                fleetGrid[eIdx][dIdx] = Math.min(95.0, baseScore + equipmentOffset);
            }
        }
        return fleetGrid;
    }

    private List<KPIDashboardDTO.DailyForecast> generateFleetForecast(int eqCount, int daysCount, double[][] fleetGrid, List<WeatherRequest> weatherList, List<PredictionResponse> basePredictions) {
        List<KPIDashboardDTO.DailyForecast> fleetForecast = new ArrayList<>();
        for (int dIdx = 0; dIdx < daysCount; dIdx++) {
            double dailySum = 0;
            for (int eIdx = 0; eIdx < eqCount; eIdx++) {
                dailySum += fleetGrid[eIdx][dIdx];
            }
            double dailyAvg = dailySum / eqCount;

            WeatherRequest w = (weatherList != null && dIdx < weatherList.size()) ? weatherList.get(dIdx) : new WeatherRequest();
            PredictionResponse p = (basePredictions != null && dIdx < basePredictions.size()) ? basePredictions.get(dIdx) : new PredictionResponse();

            fleetForecast.add(KPIDashboardDTO.DailyForecast.builder()
                    .date("Jour " + (dIdx + 1))
                    .riskScore(Math.round(dailyAvg * 10.0) / 10.0)
                    .recommendation(p.getRecommendation() != null ? p.getRecommendation() : "Surveillance")
                    .urgencyLevel(calculateUrgencyLevel(dailyAvg))
                    .temp(w.getTemperature())
                    .humidity(w.getHumidity())
                    .pressure(w.getPressure())
                    .uvIndex(w.getUvIndex())
                    .visibility(w.getVisibility())
                    .dewPoint(w.getDewPoint())
                    .windSpeed(w.getWind_speed())
                    .wmoCode(Boolean.TRUE.equals(w.getIs_lightning()) ? 95 : 0)
                    .build());
        }
        return fleetForecast;
    }

    private double calculateCurrentFleetTotal(double[][] fleetGrid, int eqCount) {
        double currentTotal = 0;
        for (int eIdx = 0; eIdx < eqCount; eIdx++) {
            currentTotal += fleetGrid[eIdx][0];
        }
        return currentTotal / eqCount;
    }

    @GetMapping("/fleet-day-details/{dayIndex}")
    public ResponseEntity<FleetDayRiskDTO> getFleetDayDetails(@PathVariable int dayIndex) {
        List<WeatherRequest> weatherList = weatherService.getWeeklyForecast();
        List<PredictionResponse> predictions = predictionClient.getWeeklyPredictions(weatherList);
        
        if (predictions == null || dayIndex >= predictions.size()) {
            return ResponseEntity.badRequest().build();
        }

        PredictionResponse p = predictions.get(dayIndex);
        LocalDate date = LocalDate.now().plusDays(dayIndex);
        
        List<FleetDayRiskDTO.EquipmentRiskDetail> details = equipmentRepository.findAll().stream()
            .map(eq -> {
                double finalScore = Math.min(98.0, (p.getRisk_score() != null ? p.getRisk_score() : 15.0) + calculateEquipmentOffset(eq));
                return FleetDayRiskDTO.EquipmentRiskDetail.builder()
                    .id(eq.getId())
                    .name(eq.getName())
                    .type(eq.getType())
                    .quartier(eq.getQuartier())
                    .riskScore(Math.round(finalScore * 10.0) / 10.0)
                    .urgencyLevel(calculateUrgencyLevel(finalScore))
                    .build();
            })
            .sorted((a, b) -> b.getRiskScore().compareTo(a.getRiskScore()))
            .toList();

        return ResponseEntity.ok(FleetDayRiskDTO.builder()
            .date(date.toString())
            .dayName(dayIndex == 0 ? "Aujourd'hui" : getDayName(date))
            .equipments(details)
            .build());
    }

    private double calculateEquipmentOffset(Equipment eq) {
        LocalDate installDate = eq.getInstallationDate();
        int age = installDate != null ? (int) ChronoUnit.YEARS.between(installDate, LocalDate.now()) : 0;
        return (age * 0.15) + (eq.getId() % 5);
    }

    private String calculateUrgencyLevel(double score) {
        if (score > 60) return "CRITICAL";
        if (score > 30) return "HIGH";
        return "LOW";
    }

    private String getDayName(LocalDate date) {
        String[] dayNames = {"Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"};
        return dayNames[date.getDayOfWeek().getValue() % 7];
    }

    private MaintenanceStatus calculateCurrentStatus(List<PredictionResponse> predictions) {
        if (predictions.isEmpty())
            return new MaintenanceStatus(0.0, "N/A", "NORMAL");
        PredictionResponse first = predictions.get(0);
        return new MaintenanceStatus(first.getRisk_score(), first.getRecommendation(), first.getUrgency_level());
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
}
