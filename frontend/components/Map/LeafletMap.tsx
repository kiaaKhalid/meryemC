'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '@/components/ThemeProvider';

// Sub-component to handle map-instance dependent logic safely
const MapControlCenter = () => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;

    const timer = setTimeout(() => {
      try {
        map.invalidateSize();
      } catch (err) {
        console.warn("Map invalidateSize failed safely:", err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
};

const getRiskColor = (score: number) => {
  if (score >= 70) return '#ef4444'; // Industrial Red (Critical)
  if (score >= 30) return '#f59e0b'; // Amber Orange (Moderate)
  return '#10b981'; // Emerald Green (Low Risk)
};

// Fix for icon issues in Leaflet: Using Dynamic High-Fidelity points matching the Home Map
const createPulseIcon = (score: number = 0) => {
  if (globalThis.window === undefined) return null;
  
  const color = getRiskColor(score);
  
  return L.divIcon({
    html: `<div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full animate-ping opacity-40" style="background-color: ${color}"></div>
            <div class="w-3.5 h-3.5 rounded-full border-2 border-white shadow-[0_0_15px_${color}]" style="background-color: ${color}"></div>
          </div>`,
    className: 'custom-pulse-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface Props {
  equipments: any[];
  onEquipmentClick?: (id: number) => void;
}

const LeafletMap = ({ equipments, onEquipmentClick }: Props) => {
  // Center of Casablanca industrial zone (Port / Aïn Sebaâ)
  const center: [number, number] = [33.59, -7.55];
  const { theme } = useTheme();

  const tileUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="w-full h-full min-h-[400px]">
      <MapContainer 
        key="casablanca-industrial-map"
        center={center} 
        zoom={12} 
        scrollWheelZoom={false} 
        zoomControl={false}
        className="w-full h-full z-0 h-[400px] bg-bg-main transition-colors duration-300"
      >
        <MapControlCenter />
        {/* Safe ZoomControl: Only render if L is properly initialized and we are in client context */}
        {typeof window !== 'undefined' && L.Control && <ZoomControl position="bottomright" />}
        
        {/* Dynamic Industrial Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />

        {/* Dynamic Industrial Pins: Casablanca Industrial Fleet */}
        {Array.isArray(equipments) && equipments
          .filter(eq => eq.latitude !== null && eq.longitude !== null && eq.latitude !== undefined && eq.longitude !== undefined)
          .map((eq) => {
            const score = eq.weeklyRiskAverage || 0;
            return (
              <Marker 
                key={`${eq.id}-${eq.latitude}-${eq.longitude}`} 
                position={[eq.latitude, eq.longitude]} 
                icon={createPulseIcon(score) as L.DivIcon}
                eventHandlers={{
                  click: () => onEquipmentClick?.(eq.id),
                }}
              >
                <Tooltip direction="top" offset={[0, -16]} opacity={1} permanent={false}>
                  <div className="bg-bg-card border border-border-main p-3 rounded-xl shadow-2xl backdrop-blur-md min-w-[200px] transition-colors duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-black text-text-main uppercase tracking-widest">{eq.name || 'Actif Inconnu'}</p>
                      <span className="text-[9px] font-black italic ml-2" style={{ color: getRiskColor(score) }}>
                        {score}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 pb-2 border-b border-white/5 mb-2">
                      <div>
                        <p className="text-[7px] text-slate-500 uppercase font-black">Quartier</p>
                        <p className="text-[8px] text-white font-bold">{eq.quartier || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[7px] text-slate-500 uppercase font-black">Age</p>
                        <p className="text-[8px] text-white font-bold">{eq.age || 0} ans</p>
                      </div>
                      <div>
                        <p className="text-[7px] text-slate-500 uppercase font-black">MTTR</p>
                        <p className="text-[8px] text-blue-400 font-bold">{eq.mttr || 0}h</p>
                      </div>
                      <div>
                        <p className="text-[7px] text-slate-500 uppercase font-black">Freq. Panne</p>
                        <p className="text-[8px] text-orange-400 font-bold">{eq.faultFrequency || 0}/an</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                       <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: getRiskColor(score) }} />
                       <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">IA : Moyenne Hebdo</span>
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            );
          })
        }
      </MapContainer>

      {/* Map Aesthetic Overlay (Legend/Vignette) */}
      <div className="absolute top-4 left-4 z-[999] pointer-events-none">
          <div className="bg-bg-card/80 backdrop-blur-xl border border-border-main p-3 rounded-lg shadow-2xl space-y-2 transition-colors duration-300">
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]" />
                <span className="text-[8px] font-black text-text-dim uppercase tracking-widest">Risque Critique (&gt;70%)</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" />
                <span className="text-[8px] font-black text-text-dim uppercase tracking-widest">Risque Modéré (30-70%)</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                <span className="text-[8px] font-black text-text-dim uppercase tracking-widest">Risque Faible (&lt;30%)</span>
             </div>
          </div>
      </div>

      <style jsx global>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2.8);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LeafletMap;
