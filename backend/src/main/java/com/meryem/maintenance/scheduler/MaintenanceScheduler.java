package com.meryem.maintenance.scheduler;

import com.meryem.maintenance.client.PredictionClient;
import com.meryem.maintenance.dto.PredictionResponse;
import com.meryem.maintenance.dto.WeatherRequest;
import com.meryem.maintenance.entity.Equipment;
import com.meryem.maintenance.entity.MaintenanceAlert;
import com.meryem.maintenance.repository.EquipmentRepository;
import com.meryem.maintenance.repository.MaintenanceAlertRepository;
import com.meryem.maintenance.service.WeatherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Senior Maintenance Scheduler orchestrating weekly risk analysis.
 * Adheres to 7-day predictive strategy with a 60% alert threshold.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MaintenanceScheduler {

    private final EquipmentRepository equipmentRepository;
    private final MaintenanceAlertRepository alertRepository;
    private final WeatherService weatherService;
    private final PredictionClient predictionClient;

    /**
     * Automated hourly check for all industrial equipment.
     * Analyzes 7-day forecasts and persists alerts for high-risk scenarios.
     */
    @Scheduled(fixedRate = 3600000) // Hourly
    public void performWeeklyMaintenanceScan() {
        log.info("Starting optimized weekly maintenance scan...");
        
        try {
            // 1. Fetch 7-day weather forecast (ONCE per scan)
            List<WeatherRequest> weeklyForecast = weatherService.getWeeklyForecast();
            
            // 2. Batch Inference via FastAPI ML Engine (ONCE per scan)
            List<PredictionResponse> predictions = predictionClient.getWeeklyPredictions(weeklyForecast);

            if (predictions.isEmpty()) {
                log.warn("No predictions available for this scan cycle.");
                return;
            }

            // 3. Process each equipment using the SAME batch predictions
            List<Equipment> equipments = equipmentRepository.findAll();
            for (Equipment equipment : equipments) {
                analyzeAndRecordRisks(equipment, predictions);
            }
            
            log.info("Scan completed successfully for {} assets.", equipments.size());
            
        } catch (Exception e) {
            log.error("Fatal error during maintenance scan: {}", e.getMessage());
        }
    }

    private void analyzeAndRecordRisks(Equipment equipment, List<PredictionResponse> predictions) {
        for (int day = 0; day < predictions.size(); day++) {
            PredictionResponse prediction = predictions.get(day);
            
            // Critical Threshold check: 60% (as per senior specs)
            if (prediction.getRisk_score() >= 60.0) {
                MaintenanceAlert alert = new MaintenanceAlert();
                alert.setEquipment(equipment);
                alert.setRiskScore(prediction.getRisk_score());
                alert.setRecommendation(prediction.getRecommendation());
                alert.setUrgencyLevel(prediction.getUrgency_level());
                alert.setNiveauRisque(calculateNiveauRisque(prediction.getRisk_score()));
                alert.setTypeAction(prediction.getRecommendation() != null ? "Inspection / Maintenance" : "Surveillance");
                alert.setAlertDate(LocalDateTime.now().plusDays(day)); // Projected alert date
                
                alertRepository.save(alert);
                log.warn("High risk detected for equipment {} on D+{}: {}%", equipment.getId(), day, prediction.getRisk_score());
            }
        }
    }

    private String calculateNiveauRisque(Double score) {
        if (score >= 80) return "CRITIQUE";
        if (score >= 60) return "ÉLEVÉ";
        return "MODÉRÉ";
    }
}
