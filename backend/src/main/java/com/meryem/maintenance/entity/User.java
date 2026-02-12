package com.meryem.maintenance.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private String password;
    
    private String email;
    private String role; // ADMIN, OPERATOR, ANALYST
    private String civility;

    @Column(columnDefinition="LONGTEXT")
    private String profileImage;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Compte compte;
}
