package com.meryem.maintenance.repository;

import com.meryem.maintenance.entity.Equipment;
import com.meryem.maintenance.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByEquipment(Equipment equipment);
    List<Incident> findByStatus(String status);
}
