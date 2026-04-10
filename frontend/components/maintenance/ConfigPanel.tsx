'use client';

import React, { useState } from 'react';
import { Sliders, Bell, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface Props {
  currentRisk: number;
  initialThreshold?: number;
  lastNotification: string;
}

const ConfigPanel = ({ currentRisk, initialThreshold = 60, lastNotification }: Props) => {
  const [threshold, setThreshold] = useState(initialThreshold);
  const { isAdmin } = useAuth();
  const isAlertTriggered = currentRisk > threshold;

  return (
    <div className="bg-bg-card/40 border border-border-main rounded-[2.5rem] p-8 h-full flex flex-col gap-8 relative overflow-hidden group transition-colors duration-300">
      {/* Dynamic Background Alert Glow */}
      <AnimatePresence>
        {isAlertTriggered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-rose-500 blur-[60px]"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-text-main uppercase italic tracking-tighter transition-colors">Paramétrage Alertes</h3>
        </div>
        {isAlertTriggered && (
          <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 px-3 py-1 rounded-full animate-pulse">
            <Bell className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-black text-rose-500 uppercase">Alerte Active</span>
          </div>
        )}
      </div>

      {/* Threshold Slider Section */}
      <div className="space-y-6 flex-1">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-xs font-black text-text-dim uppercase tracking-widest mb-1 transition-colors">Seuil Critique</span>
            <span className="text-5xl font-black italic tracking-tighter text-text-main transition-colors">{threshold}%</span>
          </div>
          <div className={`px-4 py-2 rounded-2xl border ${isAlertTriggered ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/5'}`}>
             <span className={`text-xs font-bold uppercase tracking-widest ${isAlertTriggered ? 'text-rose-500' : 'text-emerald-500'}`}>
                {isAlertTriggered ? 'Action Recommandée' : 'État Sécurisé'}
             </span>
          </div>
        </div>

        <div className="relative pt-4">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={threshold} 
            onChange={(e) => isAdmin && setThreshold(Number.parseInt(e.target.value))}
            disabled={!isAdmin}
            className={`w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {/* Visual Indicator of Current Risk on Slider */}
          <motion.div 
            style={{ left: `${currentRisk}%` }}
            className="absolute top-2 w-1 h-6 bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10 pointer-events-none"
          />
        </div>

        <p className="text-xs text-text-dim font-medium leading-relaxed italic opacity-80 transition-colors">
          Ajustez le curseur pour définir la limite de déclenchement des notifications. Toute probabilité supérieure à <span className="text-text-main font-bold">{threshold}%</span> enverra un rapport d'urgence.
        </p>
      </div>

      {/* Notification Logs / History */}
      <div className="mt-8 pt-6 border-t border-border-main space-y-4">
        <div className="flex items-center gap-3 bg-bg-main/40 border border-border-main p-4 rounded-3xl group-hover:bg-bg-main/60 transition-colors duration-300">
          <Clock className="w-4 h-4 text-text-dim" />
          <div className="flex flex-col">
             <span className="text-xs font-black text-text-dim uppercase tracking-widest transition-colors">Dernier rapport</span>
             <span className="text-sm font-bold text-text-main/80 transition-colors">{lastNotification}</span>
          </div>
          {isAlertTriggered ? (
            <AlertCircle className="w-4 h-4 text-rose-500 ml-auto animate-bounce" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-500 ml-auto" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
