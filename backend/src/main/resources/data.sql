-- ---------------------------------------------------------
-- SAMPLE DATA FOR CASABLANCA (AUTO-INSERT AFTER JPA DDL)
-- ---------------------------------------------------------

-- 1. EQUIPMENTS
INSERT IGNORE INTO equipments (id, name, type, latitude, longitude, quartier, installation_type, installation_date, mttr, zone_density, nearby_work, financial_value, clients_affected, standard_mttr) VALUES 
(1, 'Centrale Solaire Casa-1', 'Solaire', 33.5731, -7.5898, 'Aïn Sebaâ', 'AERIEN', '2019-04-15', 4.2, 'INDUSTRIELLE', false, 2500000.0, 1200, 4.0),
(2, 'Parc Eolien Casa-Coast', 'Eolienne', 33.5883, -7.6114, 'Anfa', 'AERIEN', '2021-06-20', 6.5, 'RESIDENTIELLE', true, 4800000.0, 3500, 6.0),
(3, 'Hub Electrique Sidi Maarouf', 'Réseau Electrique', 33.5333, -7.6333, 'Sidi Maarouf', 'SOUTERRAIN', '2012-03-10', 2.8, 'COMMERCIALE', false, 1200000.0, 800, 3.0),
(4, 'Poste Source Oulfa', 'Réseau Electrique', 33.5512, -7.6745, 'Oulfa', 'SOUTERRAIN', '2015-11-22', 3.1, 'RESIDENTIELLE', false, 3200000.0, 5000, 3.5),
(5, 'Station Hybride Tit Mellil', 'Solaire', 33.5589, -7.4812, 'Tit Mellil', 'AERIEN', '2020-02-14', 5.0, 'INDUSTRIELLE', true, 1800000.0, 450, 4.5),
(6, 'Capteur Éolien Mohammedia', 'Eolienne', 33.6833, -7.3833, 'Mohammedia', 'AERIEN', '2022-01-05', 7.2, 'COMMERCIALE', false, 950000.0, 200, 7.0),
(7, 'Transformateur Maârif-Ext', 'Réseau Electrique', 33.5821, -7.6341, 'Maârif', 'SOUTERRAIN', '2010-08-30', 1.5, 'COMMERCIALE', true, 650000.0, 1500, 2.0),
(8, 'Centrale Photovoltaïque Bouskoura', 'Solaire', 33.4489, -7.6482, 'Bouskoura', 'AERIEN', '2023-05-12', 4.8, 'RESIDENTIELLE', false, 5500000.0, 4200, 5.0),
(9, 'Relais Basse Tension Belvédère', 'Réseau Electrique', 33.5950, -7.5980, 'Belvédère', 'SOUTERRAIN', '2018-09-17', 2.2, 'INDUSTRIELLE', false, 420000.0, 300, 2.5),
(10, 'Parc Eolien Zenata', 'Eolienne', 33.6100, -7.5000, 'Zenata', 'AERIEN', '2021-12-10', 6.0, 'COMMERCIALE', true, 3800000.0, 1100, 6.0),
(11, 'Sous-station Hay Hassani', 'Réseau Electrique', 33.5620, -7.6610, 'Hay Hassani', 'SOUTERRAIN', '2014-03-25', 3.5, 'RESIDENTIELLE', false, 2900000.0, 4800, 3.5),
(12, 'Panneau Solaire Ghandi', 'Solaire', 33.5705, -7.6450, 'Ghandi', 'AERIEN', '2022-11-30', 4.1, 'COMMERCIALE', false, 150000.0, 50, 4.0),
(13, 'Turbine Vent Nouaceur', 'Eolienne', 33.3600, -7.5800, 'Nouaceur', 'AERIEN', '2019-07-20', 8.5, 'INDUSTRIELLE', true, 12000000.0, 10000, 8.0),
(14, 'Nœud Electrique Derb Sultan', 'Réseau Electrique', 33.5700, -7.6000, 'Derb Sultan', 'SOUTERRAIN', '2008-05-15', 2.0, 'RESIDENTIELLE', true, 850000.0, 2500, 2.5),
(15, 'Centrale Bio-Masse Mediouna', 'Solaire', 33.4500, -7.5100, 'Mediouna', 'AERIEN', '2021-04-10', 5.5, 'INDUSTRIELLE', false, 4200000.0, 500, 6.0),
(16, 'Poste Distribution Mers Sultan', 'Réseau Electrique', 33.5800, -7.6100, 'Mers Sultan', 'SOUTERRAIN', '2016-02-12', 2.9, 'COMMERCIALE', false, 1100000.0, 1200, 3.0),
(17, 'Mât Éolien Lissasfa', 'Eolienne', 33.5300, -7.6800, 'Lissasfa', 'AERIEN', '2020-10-01', 6.8, 'INDUSTRIELLE', true, 7400000.0, 1500, 7.0),
(18, 'Générateur Solaire California', 'Solaire', 33.5400, -7.6200, 'Quartier California', 'AERIEN', '2023-01-20', 3.9, 'RESIDENTIELLE', false, 2800000.0, 900, 4.0),
(19, 'Antenne Réseau Roches Noires', 'Réseau Electrique', 33.6000, -7.5800, 'Roches Noires', 'AERIEN', '2013-06-18', 4.5, 'INDUSTRIELLE', true, 920000.0, 3000, 4.5),
(20, 'Station Solaire Casa-Finance', 'Solaire', 33.5750, -7.6550, 'Casa Finance City', 'AERIEN', '2024-02-15', 3.2, 'COMMERCIALE', false, 12000000.0, 2000, 3.5),
(21, 'Transformateur Oasis', 'Réseau Electrique', 33.5550, -7.6330, 'L\'Oasis', 'SOUTERRAIN', '2011-12-05', 1.8, 'RESIDENTIELLE', false, 550000.0, 1800, 2.0),
(22, 'Champ Solaire Had Soualem', 'Solaire', 33.4167, -7.8333, 'Had Soualem', 'AERIEN', '2021-08-22', 5.2, 'INDUSTRIELLE', false, 8500000.0, 600, 5.5),
(23, 'Ligne HT Ain Chock', 'Réseau Electrique', 33.5450, -7.6050, 'Ain Chock', 'AERIEN', '2017-03-30', 3.7, 'RESIDENTIELLE', true, 1900000.0, 4500, 3.5),
(24, 'Eolienne Port de Casa', 'Eolienne', 33.6050, -7.6020, 'Port de Casablanca', 'AERIEN', '2020-05-14', 7.5, 'INDUSTRIELLE', true, 11000000.0, 200, 8.0),
(25, 'Unité Solaire Sidi Moumen', 'Solaire', 33.5900, -7.5300, 'Sidi Moumen', 'AERIEN', '2019-11-11', 4.0, 'RESIDENTIELLE', false, 3100000.0, 6000, 4.0),
(26, 'Concentrateur Maârif 2', 'Réseau Electrique', 33.5850, -7.6380, 'Maârif', 'SOUTERRAIN', '2015-07-25', 2.4, 'COMMERCIALE', false, 1400000.0, 900, 2.5),
(27, 'Micro-grid Polo', 'Réseau Electrique', 33.5600, -7.6100, 'Polo', 'SOUTERRAIN', '2022-09-09', 2.1, 'RESIDENTIELLE', false, 480000.0, 400, 2.5),
(28, 'Installation Solaire Beauséjour', 'Solaire', 33.5680, -7.6550, 'Beauséjour', 'AERIEN', '2023-03-14', 4.3, 'RESIDENTIELLE', true, 2200000.0, 1100, 4.5),
(29, 'Eolienne Nord Mansouria', 'Eolienne', 33.7300, -7.3000, 'Mansouria', 'AERIEN', '2021-11-20', 6.2, 'COMMERCIALE', false, 5200000.0, 150, 6.0),
(30, 'Relais Energie Bourgogne', 'Réseau Electrique', 33.5950, -7.6400, 'Bourgogne', 'SOUTERRAIN', '2012-10-10', 3.0, 'RESIDENTIELLE', true, 890000.0, 3200, 3.5),
(31, 'Ferme Solaire Dar Bouazza', 'Solaire', 33.5200, -7.8100, 'Dar Bouazza', 'AERIEN', '2020-06-05', 5.4, 'RESIDENTIELLE', false, 7500000.0, 1200, 5.5),
(32, 'Station PV Tit Mellil 2', 'Solaire', 33.5600, -7.4700, 'Tit Mellil', 'AERIEN', '2022-04-18', 4.9, 'INDUSTRIELLE', false, 1500000.0, 300, 5.0),
(33, "Poste Blindé Ben M\'Sik", 'Réseau Electrique', 33.5600, -7.5700, "Ben M\'Sik", 'SOUTERRAIN', '2014-08-22', 2.7, 'RESIDENTIELLE', true, 2600000.0, 4100, 3.0),
(34, 'Eolienne Sud Bouskoura', 'Eolienne', 33.4200, -7.6500, 'Bouskoura', 'AERIEN', '2021-09-12', 6.9, 'INDUSTRIELLE', false, 4900000.0, 100, 7.0),
(35, 'Centrale Toiture Casa-Port', 'Solaire', 33.5990, -7.6110, 'Centre Ville', 'AERIEN', '2023-07-01', 3.8, 'COMMERCIALE', true, 1100000.0, 500, 4.0),
(36, 'Câblage HT Inara', 'Réseau Electrique', 33.5400, -7.5900, 'Inara', 'SOUTERRAIN', '2013-11-15', 3.3, 'RESIDENTIELLE', false, 1800000.0, 2200, 3.5),
(37, 'Eolienne Test Berrechid', 'Eolienne', 33.2600, -7.5800, 'Périphérie', 'AERIEN', '2022-05-20', 7.0, 'INDUSTRIELLE', false, 650000.0, 50, 7.5),
(38, 'Solaire Thermique 2 Mars', 'Solaire', 33.5650, -7.6150, '2 Mars', 'AERIEN', '2020-03-10', 4.6, 'COMMERCIALE', true, 1400000.0, 300, 4.5),
(39, 'Transformateur Val Fleuri', 'Réseau Electrique', 33.5750, -7.6350, 'Val Fleuri', 'SOUTERRAIN', '2011-04-14', 1.9, 'RESIDENTIELLE', false, 720000.0, 1300, 2.0),
(40, 'Centrale Solaire Logistique', 'Solaire', 33.5200, -7.5100, 'Sidi Moumen', 'AERIEN', '2019-12-25', 5.1, 'INDUSTRIELLE', true, 1900000.0, 800, 5.0),
(41, 'Poste Répartition Racine', 'Réseau Electrique', 33.5900, -7.6350, 'Racine', 'SOUTERRAIN', '2016-01-20', 2.5, 'COMMERCIALE', false, 3200000.0, 2500, 3.0),
(42, 'Eolienne Littorale 2', 'Eolienne', 33.6200, -7.5800, 'Ain Diab', 'AERIEN', '2021-02-14', 6.3, 'RESIDENTIELLE', true, 4100000.0, 1200, 6.5),
(43, 'Panneau Solaire Ecole', 'Solaire', 33.5800, -7.6200, 'Gauthier', 'AERIEN', '2023-08-10', 3.5, 'COMMERCIALE', false, 45000.0, 10, 3.5),
(44, 'Hub Energie Lissasfa 2', 'Réseau Electrique', 33.5250, -7.6850, 'Lissasfa', 'AERIEN', '2014-05-05', 4.4, 'INDUSTRIELLE', false, 1300000.0, 1100, 4.5),
(45, 'Station Hybride Errahma', 'Solaire', 33.5100, -7.7500, 'Errahma', 'AERIEN', '2022-02-28', 5.8, 'RESIDENTIELLE', true, 2600000.0, 4800, 6.0),
(46, 'Transformateur Derb Ghallef', 'Réseau Electrique', 33.5780, -7.6250, 'Derb Ghallef', 'SOUTERRAIN', '2009-11-12', 2.3, 'COMMERCIALE', true, 890000.0, 2100, 2.5),
(47, 'Parc Photovoltaïque Sapino', 'Solaire', 33.5400, -7.4500, 'Nouaceur', 'AERIEN', '2020-09-17', 4.7, 'INDUSTRIELLE', false, 1100000.0, 400, 5.0),
(48, 'Mât Mesure Vent Tit Mellil', 'Eolienne', 33.5550, -7.4750, 'Tit Mellil', 'AERIEN', '2021-10-30', 6.1, 'INDUSTRIELLE', false, 450000.0, 100, 6.5),
(49, 'Réseau MT Ferme Bretonne', 'Réseau Electrique', 33.5550, -7.6450, 'Ferme Bretonne', 'SOUTERRAIN', '2017-06-14', 2.8, 'RESIDENTIELLE', false, 1100000.0, 1400, 3.0),
(50, 'Générateur Solaire Technopark', 'Solaire', 33.5350, -7.6320, 'Sidi Maarouf', 'AERIEN', '2023-12-01', 3.4, 'COMMERCIALE', false, 320000.0, 100, 3.5),
(51, 'Unité Eolienne Mohammedia-Est', 'Eolienne', 33.6900, -7.3500, 'Mohammedia', 'AERIEN', '2022-07-20', 7.4, 'INDUSTRIELLE', true, 5800000.0, 50, 7.5),
(52, 'Poste Electrique Almaz', 'Réseau Electrique', 33.5100, -7.6900, 'Almaz', 'SOUTERRAIN', '2024-01-10', 3.0, 'RESIDENTIELLE', true, 1900000.0, 3200, 3.5),
(53, 'Solaire Toiture Hay Farah', 'Solaire', 33.5600, -7.5800, 'Hay Farah', 'AERIEN', '2021-03-15', 4.5, 'RESIDENTIELLE', false, 450000.0, 1500, 4.5);

-- 2. USERS (Default Admins/Operators)
-- 2. USERS (Default Admins/Operators)
INSERT IGNORE INTO users (id, username, password, email, role) VALUES 
(1, 'khalid_admin', 'p@ssword123', 'khalid@meryem.ma', 'ADMIN'),
(2, 'meryem_op', 'operator@123', 'meryem@meryem.ma', 'OPERATOR');

UPDATE users SET password = 'p@ssword123', email = 'khalid@meryem.ma' WHERE id = 1;
UPDATE users SET password = 'operator@123', email = 'meryem@meryem.ma' WHERE id = 2;

-- 3. COMPTES (Linked to Users)
INSERT IGNORE INTO comptes (id, account_number, status, user_id) VALUES 
(1, 'CASA-ACC-001', 'ACTIVE', 1),
(2, 'CASA-ACC-002', 'ACTIVE', 2);

-- 4. INCIDENTS (Historical Faults)
INSERT IGNORE INTO incidents (id, equipment_id, description, incident_date, severity, status, resolution_date, cost, maintenance_type, actual_repair_time) VALUES 
(1, 1, 'Surchauffe onduleur due à tempête de sable', '2026-03-15 10:30:00', 'MAJOR', 'CLOSED', '2026-03-15 14:00:00', 12000.0, 'CURATIVE', 3.5),
(2, 3, 'Infiltration eau dans tunnel souterrain', '2026-03-20 22:15:00', 'CRITICAL', 'CLOSED', '2026-03-21 02:30:00', 45000.0, 'CURATIVE', 4.25),
(3, 2, 'Vibration anormale pales éoliennes', '2026-04-01 09:00:00', 'MINOR', 'OPEN', NULL, 8000.0, 'PREVENTIVE', NULL),
(4, 5, 'Accumulation de poussière sur panneaux photovoltaïques', '2026-04-02 08:30:00', 'MINOR', 'CLOSED', '2026-04-02 12:00:00', 2500.0, 'PREVENTIVE', 3.5),
(5, 7, 'Court-circuit sur transformateur moyenne tension', '2026-04-03 14:20:00', 'CRITICAL', 'OPEN', NULL, 55000.0, 'CURATIVE', NULL),
(6, 10, 'Défaillance du système de freinage aérodynamique', '2026-04-05 11:45:00', 'MAJOR', 'OPEN', NULL, 18000.0, 'CURATIVE', NULL),
(7, 4, 'Baisse de tension inexpliquée en zone résidentielle', '2026-04-07 19:10:00', 'MINOR', 'CLOSED', '2026-04-07 20:30:00', 5200.0, 'CURATIVE', 1.33),
(8, 13, 'Impact de foudre sur le mât de mesure', '2026-04-10 23:05:00', 'MAJOR', 'CLOSED', '2026-04-11 09:00:00', 32000.0, 'CURATIVE', 10.0),
(9, 21, 'Rupture de câble souterrain lors de travaux tiers', '2026-04-12 10:00:00', 'CRITICAL', 'OPEN', NULL, 68000.0, 'CURATIVE', NULL),
(10, 8, 'Dysfonctionnement du tracker solaire (moteur bloqué)', '2026-04-15 07:15:00', 'MINOR', 'CLOSED', '2026-04-15 15:45:00', 7500.0, 'PREVENTIVE', 8.5),
(11, 14, 'Surcharge du poste source suite à pic de consommation', '2026-04-18 18:30:00', 'MAJOR', 'CLOSED', '2026-04-18 21:00:00', 12500.0, 'CURATIVE', 2.5),
(12, 24, 'Corrosion saline avancée sur structure métallique', '2026-04-20 09:00:00', 'MINOR', 'OPEN', NULL, 4500.0, 'PREVENTIVE', NULL),
(13, 17, 'Erreur logicielle du système de monitoring SCADA', '2026-04-22 13:00:00', 'MINOR', 'CLOSED', '2026-04-22 14:15:00', 1500.0, 'PREVENTIVE', 1.25),
(14, 33, 'Déclenchement intempestif du disjoncteur principal', '2026-04-25 04:40:00', 'MAJOR', 'OPEN', NULL, 9000.0, 'CURATIVE', NULL),
(15, 40, 'Vandalisme sur clôture de sécurité du parc solaire', '2026-04-26 22:50:00', 'MINOR', 'CLOSED', '2026-04-27 08:00:00', 3800.0, 'CURATIVE', 9.15),
(16, 6, 'Sifflement anormal du multiplicateur de vitesse', '2026-04-28 15:20:00', 'MAJOR', 'OPEN', NULL, 22000.0, 'PREVENTIVE', NULL),
(17, 46, 'Huile de refroidissement détectée hors du bac de rétention', '2026-04-30 11:10:00', 'CRITICAL', 'OPEN', NULL, 15000.0, 'PREVENTIVE', NULL),
(18, 12, 'Obstruction partielle par débris transportés par le vent', '2026-05-01 10:00:00', 'MINOR', 'CLOSED', '2026-05-01 13:00:00', 2000.0, 'PREVENTIVE', 3.0);

-- 5. MAINTENANCE ALERTS (Current Predictions)
INSERT IGNORE INTO maintenance_alerts (id, equipment_id, risk_score, recommendation, urgency_level, type_action, niveau_risque, alert_date, estimated_repair_time, legal_deadline) VALUES 
(1, 1, 85.5, 'Remplacement préventif onduleur', 'CRITICAL', 'REMPLACEMENT', 'HAUT', '2026-04-06 09:00:00', 5.0, 4.0),
(2, 2, 42.0, 'Inspection graissage pales', 'MEDIUM', 'MAINTENANCE', 'MOYEN', '2026-04-06 10:30:00', 2.0, 6.0),
(3, 4, 92.1, 'Urgence : Risque de fusion transformateur', 'CRITICAL', 'REPARATION', 'CRITIQUE', '2026-04-07 07:15:00', 8.5, 3.0),
(4, 13, 78.5, 'Calibrage anémomètre', 'HIGH', 'MAINTENANCE', 'HAUT', '2026-04-07 08:00:00', 4.0, 8.0),
(5, 20, 15.2, 'Nettoyage panneaux', 'LOW', 'NETTOYAGE', 'BAS', '2026-04-07 09:30:00', 1.5, 24.0),
(6, 24, 88.4, 'Traitement anti-corrosion urgent', 'CRITICAL', 'TRAITEMENT', 'HAUT', '2026-04-07 10:00:00', 12.0, 48.0),
(7, 25, 35.0, 'Vérification connectique', 'MEDIUM', 'INSPECTION', 'MOYEN', '2026-04-07 11:15:00', 2.5, 12.0),
(8, 30, 61.2, 'Mise à jour firmware relais', 'HIGH', 'LOGICIEL', 'HAUT', '2026-04-07 12:00:00', 0.5, 2.0),
(9, 45, 95.0, 'SLA BREACH ALERT: Rupture imminente isolation', 'CRITICAL', 'URGENCE', 'CRITIQUE', '2026-04-07 13:45:00', 14.0, 6.0),
(10, 52, 22.8, 'Remplacement batterie backup', 'LOW', 'REMPLACEMENT', 'BAS', '2026-04-07 14:30:00', 1.0, 48.0),
(11, 3, 45.5, 'Séchage tunnel', 'MEDIUM', 'MAINTENANCE', 'MOYEN', '2026-04-07 15:00:00', 3.0, 12.0),
(12, 11, 81.0, 'Equilibrage phases', 'CRITICAL', 'MAINTENANCE', 'HAUT', '2026-04-07 15:45:00', 2.0, 4.0),
(13, 8, 12.5, 'Test tracking annuel', 'LOW', 'INSPECTION', 'BAS', '2026-04-07 16:30:00', 4.0, 72.0),
(14, 17, 89.2, 'Vérification freins turbine', 'CRITICAL', 'REPARATION', 'HAUT', '2026-04-07 17:15:00', 6.5, 4.0),
(15, 33, 55.4, 'Inspection disjoncteur', 'HIGH', 'INSPECTION', 'MOYEN', '2026-04-07 18:00:00', 2.0, 6.0);
