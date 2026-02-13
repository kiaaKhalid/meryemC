package com.meryem.maintenance.repository;

import com.meryem.maintenance.entity.WeatherLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WeatherLogRepository extends JpaRepository<WeatherLog, Long> {
    List<WeatherLog> findByEquipmentIdOrderByLogDateDesc(Long equipmentId, Pageable pageable);
}
