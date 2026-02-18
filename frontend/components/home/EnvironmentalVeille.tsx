"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  Wind, 
  Thermometer, 
  ShieldAlert, 
  Activity,
  ChevronRight,
  ChevronLeft,
  MapPin,
  FileText
} from 'lucide-react';
import { IncidentReport } from './IncidentReport';

// --- TYPES (CORRIGÉ : LeafletMap supprimé car inutilisé) ---
import type { DivIcon } from 'leaflet';

// --- IMPORTS DYNAMIQUES (SÉCURITÉ SSR) ---
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

import 'leaflet/dist/leaflet.css';


interface Incident {
  id: number;
  pos: [number, number];
  label: string;
  severity: string;
  color: string;
  time: string;
}

const incidents: Incident[] = [
  { id: 1, pos: [33.605, -7.589], label: "Inondation - Port", severity: "Critique", color: "#ff4d4d", time: "Il y a 5 min" },
  { id: 2, pos: [33.582, -7.632], label: "Panne Réseau - Maarif", severity: "Moyen", color: "#fbbf24", time: "Il y a 12 min" },
  { id: 3, pos: [33.598, -7.532], label: "Pollution - Ain Sebaa", severity: "Stable", color: "#3b82f6", time: "Il y a 1h" },
  { id: 4, pos: [33.573, -7.655], label: "Surcharge Transformateur - Hay Hassani", severity: "Critique", color: "#ff4d4d", time: "Il y a 2 min" },
  { id: 5, pos: [33.541, -7.602], label: "Baisse de Pression Eau - Bouskoura", severity: "Faible", color: "#10b981", time: "Il y a 45 min" },
  { id: 6, pos: [33.589, -7.603], label: "Maintenance Préventive - Mers Sultan", severity: "Moyen", color: "#f97316", time: "Prévu à 14:00" },
  { id: 7, pos: [33.612, -7.515], label: "Alerte Tempête - Zone Industrielle", severity: "Critique", color: "#7c3aed", time: "Imminent" },
  { id: 8, pos: [33.525, -7.55], label: "Fuite Canalisation Majeure - Sidi Maarouf", severity: "Critique", color: "#ff4d4d", time: "Il y a 18 min" }
];

export default function ModernEnvironmentalVeille() {
  const [mounted, setMounted] = useState(false);
  const [activeIncident, setActiveIncident] = useState<Incident>(incidents[0]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Remplacement de 'any' par l'objet Leaflet importé
  const [leafletInstance, setLeafletInstance] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import('leaflet');
      setLeafletInstance(leaflet);
      setMounted(true);
    };
    loadLeaflet();
  }, []);

  const customIcon = useMemo(() => (color: string): DivIcon | null => {
    // Utilisation de globalThis.window selon S7764
    if (!leafletInstance || globalThis.window === undefined) return null;
    
    return leafletInstance.divIcon({
      html: `<div class="relative flex items-center justify-center">
              <div class="absolute w-8 h-8 rounded-full animate-ping opacity-40" style="background-color: ${color}"></div>
              <div class="w-4 h-4 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}"></div>
            </div>`,
      className: '', 
      iconSize: [32, 32],
    });
  }, [leafletInstance]);

  return (
    <section className="relative py-20 bg-slate-50 dark:bg-[#020617] overflow-hidden transition-colors duration-500 min-h-screen">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8 text-slate-900 dark:text-white">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.3em] mb-3">
              {mounted && <Activity size={14} className="animate-pulse" />}
              Système de Veille Géo-Spatiale
            </div>
            <h2 className="text-5xl font-black tracking-tight uppercase leading-none">
              Casablanca <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500 text-6xl italic text-shadow-sm">Pulse</span>
            </h2>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-slate-900 shadow-xl rounded-4xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4 min-w-45 transition-transform hover:scale-105">
              <div className="p-3 bg-orange-100 dark:bg-orange-500/10 rounded-2xl text-orange-600">
                {mounted && <Thermometer size={24} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Température</p>
                <p className="text-2xl font-black italic">21°C</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 shadow-xl rounded-4xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4 min-w-45 transition-transform hover:scale-105">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-2xl text-blue-600">
                {mounted && <Wind size={24} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Vent</p>
                <p className="text-2xl font-black italic">15 km/h</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAP SECTION --- */}
        <div className="relative h-187.5 rounded-4xl overflow-hidden shadow-2xl border-12 border-white dark:border-slate-900 transition-all duration-700">
          {mounted && leafletInstance ? (
            <div className="w-full h-full">
               <MapContainer 
                center={[33.5731, -7.5898]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }} 
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {incidents.map((inc) => (
                  <Marker 
                    key={inc.id} 
                    position={inc.pos} 
                    icon={customIcon(inc.color) as DivIcon}
                    eventHandlers={{ click: () => setActiveIncident(inc) }}
                  >
                    <Popup>
                      <div className="p-1 text-sm font-bold">{inc.label}</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest font-mono animate-bounce text-center">Initialisation du flux IA...</p>
            </div>
          )}

          {/* --- FLOTTANT PANEL --- */}
          <AnimatePresence>
            {isPanelOpen && (
              <motion.div 
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="absolute right-8 top-8 bottom-8 w-80 z-1001 pointer-events-none"
              >
                <div className="h-full flex flex-col gap-4 pointer-events-auto">
                  <div className="bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl p-7 rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8 text-slate-500">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                          {mounted && <ShieldAlert size={16} className="text-indigo-500" />} Flux Alertes
                        </div>
                        <button 
                            onClick={() => setIsPanelOpen(false)}
                            aria-label="Fermer"
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                      {incidents.map((inc) => (
                        <button
                          key={inc.id}
                          onClick={() => setActiveIncident(inc)}
                          className={`w-full text-left p-5 rounded-3xl transition-all border-2 cursor-pointer ${
                            activeIncident.id === inc.id 
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/40' 
                            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tight ${
                              activeIncident.id === inc.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
                            }`}>
                              {inc.severity}
                            </span>
                            <span className="text-[9px] opacity-60 font-mono italic">{inc.time}</span>
                          </div>
                          <p className="font-bold text-xs leading-tight">{inc.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto bg-slate-900 dark:bg-white p-8 rounded-3xl text-white dark:text-slate-900 shadow-2xl transition-colors duration-500">
                    <div className="flex items-center gap-3 mb-3 opacity-60">
                      {mounted && <MapPin size={18} />}
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Coordonnées</span>
                    </div>
                    <p className="text-3xl font-black tracking-tight uppercase leading-none mb-1">Casa Center</p>
                    <p className="text-[10px] font-mono opacity-50 uppercase italic font-bold">
                      33.5731° N | 7.5898° W
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- BOUTON OUVERTURE --- */}
          {!isPanelOpen && (
            <motion.button
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={() => setIsPanelOpen(true)}
              className="absolute right-10 top-1/2 -translate-y-1/2 z-1002 bg-white dark:bg-slate-900 p-4 rounded-full shadow-2xl border border-slate-200 dark:border-slate-800 text-indigo-500 hover:scale-110 transition-transform flex flex-col items-center gap-2 cursor-pointer"
            >
              <ChevronLeft size={24} />
              <span className="text-[10px] font-black uppercase vertical-text">Alertes</span>
            </motion.button>
          )}

          {/* --- BARRE NAVIGATION BASSE --- */}
          <div className="absolute bottom-8 left-8 z-1001 pointer-events-auto">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-10 py-5 rounded-full shadow-2xl border border-white/20 flex items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Flux Temps Réel</span>
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                
                {mounted && globalThis.window !== undefined && (
                    <PDFDownloadLink 
                        document={<IncidentReport incident={activeIncident} />} 
                        fileName={`rapport-pulse-${activeIncident.id}.pdf`}
                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:underline transition-all cursor-pointer"
                    >
                        {({ loading }) => (
                            <>
                                <FileText size={14} />
                                {loading ? 'Calcul...' : 'Export Rapport PDF'}
                            </>
                        )}
                    </PDFDownloadLink>
                )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container { border-radius: 4rem; z-index: 1 !important; }
        .custom-popup .leaflet-popup-content-wrapper { border-radius: 1.5rem; padding: 10px; font-weight: bold; }
        .vertical-text { writing-mode: vertical-rl; text-orientation: mixed; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
        @keyframes ping { 75%, 100% { transform: scale(2.8); opacity: 0; } }
      `}</style>
    </section>
  );
}