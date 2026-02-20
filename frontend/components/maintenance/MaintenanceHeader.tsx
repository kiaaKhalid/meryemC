'use client';

import React from 'react';
import { Activity, ServerOff, Wifi, CloudOff } from 'lucide-react';
import { mapRiskToUI } from '@/services/maintenanceService';

interface Props {
  score: number;
  isSimulation?: boolean;
  isOffline?: boolean;
}

const MaintenanceHeader = ({ score, isSimulation = false, isOffline = false }: Props) => {
  const ui = mapRiskToUI(score);
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 border-b border-border-main mb-8 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${ui.bg} border ${ui.border} transition-colors duration-500`}>
          <Activity className={`w-6 h-6 ${ui.color}`} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-main tracking-tight uppercase italic transition-colors">
            Surveillance <span className="text-indigo-500">Flotte Globale</span>
          </h1>
          <p className="text-text-dim text-xs font-bold uppercase tracking-[0.2em] mt-1 opacity-60 transition-colors">
            Diagnostic IA Casablanca • Agrégation de l'Ensemble des Actifs
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        {/* Main Status Badge */}
        <div className={`flex items-center gap-4 px-6 py-2.5 rounded-full bg-bg-card/40 border ${ui.border} transition-all duration-500 backdrop-blur-md shadow-sm`}>
            <span className={`w-2 h-2 rounded-full ${ui.color.replace('text-', 'bg-')} animate-pulse shadow-[0_0_8px_rgba(var(--bg-main),0.4)]`}></span>
            <div className="flex items-center gap-3">
                <span className="text-xs font-black text-text-main uppercase tracking-widest leading-none">
                    {ui.status}
                </span>
                <span className={`text-xs font-black ${ui.color} border-l border-border-main pl-3 leading-none uppercase tracking-widest`}>
                    Score: {Math.round(score)}/100
                </span>
            </div>
        </div>

        {/* Resilience Badges (Triple-Safe Levels) */}
        <div className="flex items-center gap-2">
            {isOffline ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
                    <CloudOff className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-black text-rose-500 uppercase tracking-tighter">Mode Hors-Ligne : Données de Secours</span>
                </div>
            ) : null}
            {!isOffline && isSimulation ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                    <ServerOff className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black text-amber-500 uppercase tracking-tighter">Mode Simulation : Backend Hors-ligne</span>
                </div>
            ) : null}
            {!isOffline && !isSimulation ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full opacity-60">
                    <Wifi className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-tighter">Connexion Backend : Active</span>
                </div>
            ) : null}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceHeader;
