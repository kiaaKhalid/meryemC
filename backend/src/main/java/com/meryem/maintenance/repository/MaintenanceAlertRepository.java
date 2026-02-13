package com.meryem.maintenance.repository;

import com.meryem.maintenance.entity.MaintenanceAlert;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceAlertRepository extends JpaRepository<MaintenanceAlert, Long> {
    List<MaintenanceAlert> findByEquipmentIdOrderByAlertDateDesc(Long equipmentId, Pageable pageable);
}
