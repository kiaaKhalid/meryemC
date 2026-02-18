"use client";

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'; // Correction : Font supprimé car inutilisé

// Définition d'une interface pour l'incident (Correction : no-explicit-any)
interface IncidentData {
  label: string;
  severity: string;
  color: string;
  pos: [number, number];
  time: string;
  type?: string; // Optionnel car peut être absent
}

// Styles pour le PDF
const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  header: { borderBottom: 2, borderBottomColor: '#6366f1', marginBottom: 20, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  section: { marginBottom: 15, padding: 10, backgroundColor: '#f8fafc', borderRadius: 5 },
  label: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  badge: { padding: 4, borderRadius: 4, color: 'white', fontSize: 10, width: 70, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 10, textAlign: 'center', color: '#94a3b8' }
});

export const IncidentReport = ({ incident }: { incident: IncidentData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {/* Correction : échappement de l'apostrophe */}
        <Text style={styles.title}>Rapport d&apos;Incident IA</Text>
        <Text style={{ fontSize: 10, color: '#6366f1' }}>MonitorAI Casablanca - Système de Veille</Text>
      </View>

      {/* Informations Générales */}
      <View style={styles.section}>
        <Text style={styles.label}>Incident</Text>
        <Text style={styles.value}>{incident.label}</Text>
        <View style={[styles.badge, { backgroundColor: incident.color, marginTop: 5 }]}>
          <Text>{incident.severity}</Text>
        </View>
      </View>

      {/* Localisation & Temps */}
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <View style={[styles.section, { flex: 1 }]}>
          <Text style={styles.label}>Coordonnées GPS</Text>
          <Text style={styles.value}>{incident.pos[0]}, {incident.pos[1]}</Text>
        </View>
        <View style={[styles.section, { flex: 1 }]}>
          <Text style={styles.label}>Détecté le</Text>
          <Text style={styles.value}>20 Mars 2026 - {incident.time}</Text>
        </View>
      </View>

      {/* Analyse Prédictive */}
      <View style={styles.section}>
        {/* Correction : échappement de l'apostrophe */}
        <Text style={styles.label}>Analyse de l&apos;Intelligence Artificielle</Text>
        <Text style={{ fontSize: 12, lineHeight: 1.5, color: '#334155' }}>
          {/* Correction : échappement des guillemets et apostrophes */}
          Le modèle de Deep Learning a identifié une anomalie de type &quot;{incident.type || 'Inconnu'}&quot; avec un indice de confiance de 94%. 
          Causes probables : Corrélation entre les données historiques de maintenance et les prévisions météorologiques actuelles.
        </Text>
      </View>

      {/* Recommandations */}
      <View style={[styles.section, { backgroundColor: '#eff6ff' }]}>
        <Text style={[styles.label, { color: '#2563eb' }]}>Actions Recommandées</Text>
        <Text style={{ fontSize: 11 }}>1. Déploiement d&apos;une équipe technique sur site.</Text>
        <Text style={{ fontSize: 11 }}>2. Coupure préventive du secteur si la pression dépasse 15 bar.</Text>
        <Text style={{ fontSize: 11 }}>3. Notification des autorités locales.</Text>
      </View>

      <Text style={styles.footer}>Document généré automatiquement par MonitorAI. Confidentialité : Interne.</Text>
    </Page>
  </Document>
);