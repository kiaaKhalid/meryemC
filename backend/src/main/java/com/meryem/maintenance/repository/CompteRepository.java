package com.meryem.maintenance.repository;

import com.meryem.maintenance.entity.Compte;
import com.meryem.maintenance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {
    Optional<Compte> findByUser(User user);
    Optional<Compte> findByAccountNumber(String accountNumber);
}
