package com.meryem.maintenance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * High-fidelity DTO containing the 17 features required for industrial AI inference.
 * Uses @JsonProperty to preserve the snake_case field names expected by the Python ML engine
 * while keeping Java field names compliant with camelCase conventions.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertInferenceDTO {
    // --- Weather Features ---
    private Integer mois;

    @JsonProperty("jour_semaine")
    private Integer jourSemaine;

    private String saison;

    @JsonProperty("humidite_meteo")
    private Double humiditeMeteo;

    @JsonProperty("vent_vitesse")
    private Double ventVitesse;

    private Integer foudre; // 0 or 1
    private Double precipitations;
    private Double temperature;

    @JsonProperty("uv_exposure")
    private Double uvExposure;

    // --- Equipment Features ---
    @JsonProperty("type_installation")
    private String typeInstallation;

    @JsonProperty("age_equipement_ans")
    private Integer ageEquipementAns;

    @JsonProperty("jours_depuis_derniere_maintenance")
    private Integer joursDerniereMainenance;

    @JsonProperty("duree_moyenne_reparation_h")
    private Double dureeMoyenneReparationH;

    @JsonProperty("frequence_pannes_passees")
    private Integer frequencePannesPassees;

    @JsonProperty("zone_densite")
    private String zoneDensite;

    @JsonProperty("travaux_proximite")
    private Integer travauxProximite; // 0 or 1

    @JsonProperty("valeur_financiere_dh")
    private Double valeurFinanciereDh;
}
