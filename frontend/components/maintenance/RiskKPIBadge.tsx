'use client';

import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { mapRiskToUI } from '@/services/maintenanceService';

interface Props {
  score: number;
}

const RiskKPIBadge = ({ score }: Props) => {
  const ui = mapRiskToUI(score);
  const Icon = score > 60 ? AlertTriangle : (score >= 30 ? Zap : CheckCircle);
  
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative flex flex-col items-center justify-center p-12 rounded-[3.5rem] bg-white/[0.03] border-2 ${ui.border} ${ui.glow} transition-all duration-700 overflow-hidden group`}
    >
      {/* Dynamic Background Gradient */}
      <div className={`absolute inset-0 ${ui.bg} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
      
      {/* Badge Sector */}
      <div className={`mb-6 px-4 py-1.5 rounded-full border ${ui.border} ${ui.bg} backdrop-blur-md`}>
         <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${ui.color}`}>
            {ui.badge}
         </span>
      </div>

      {/* Main Metric */}
      <div className="flex flex-col items-center relative z-10">
        <div className="flex items-baseline gap-1">
          <span className={`text-8xl font-black italic tracking-tighter ${ui.color} drop-shadow-2xl`}>
            {Math.round(score)}
          </span>
          <span className={`text-2xl font-bold ${ui.color} opacity-60`}>%</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-widest uppercase italic mt-2">
          {ui.status}
        </h2>
      </div>

      {/* Visual Indicator Icon */}
      <div className={`absolute bottom-8 right-12 opacity-10 group-hover:opacity-20 transition-opacity`}>
        <Icon className={`w-32 h-32 ${ui.color}`} />
      </div>

      {/* Subtle Micro-Animation */}
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${ui.color.replace('text-', 'via-')} to-transparent`}
      />
    </motion.div>
  );
};

export default RiskKPIBadge;
