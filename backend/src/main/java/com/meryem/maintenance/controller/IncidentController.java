package com.meryem.maintenance.controller;

import com.meryem.maintenance.entity.Incident;
import com.meryem.maintenance.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*")
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping("/equipment/{id}")
    public ResponseEntity<List<Incident>> getIncidentHistory(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.getIncidentHistory(id));
    }

    @PostMapping("/report/{equipmentId}")
    public ResponseEntity<Incident> reportIncident(@PathVariable Long equipmentId, @RequestBody Incident incident) {
        return ResponseEntity.ok(incidentService.reportIncident(incident, equipmentId));
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }
}
