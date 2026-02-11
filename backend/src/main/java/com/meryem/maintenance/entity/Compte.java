package com.meryem.maintenance.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "comptes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Compte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;
    
    private String status; // ACTIVE, SUSPENDED
    
    // Associateur technique
    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
