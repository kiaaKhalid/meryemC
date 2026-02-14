package com.meryem.maintenance.service;

import com.meryem.maintenance.entity.Equipment;
import com.meryem.maintenance.entity.Incident;
import com.meryem.maintenance.repository.EquipmentRepository;
import com.meryem.maintenance.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService {
    
    private final IncidentRepository incidentRepository;
    private final EquipmentRepository equipmentRepository;

    @Transactional
    public Incident reportIncident(Incident incident, Long equipmentId) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        
        incident.setEquipment(equipment);
        if (incident.getStatus() == null) incident.setStatus("OPEN");
        return incidentRepository.save(incident);
    }

    public List<Incident> getIncidentHistory(Long equipmentId) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        return incidentRepository.findByEquipment(equipment);
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }
}
