'use client';

import React from 'react';
import { Equipment } from '@/services/maintenanceService';
import { motion } from 'framer-motion';
import { MapPin, Activity, Clock, Zap, Cpu, Edit, Trash } from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
  onClick?: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export default function EquipmentCard({ equipment, onClick, onEdit, onDelete }: EquipmentCardProps) {
  const riskScore = equipment.weeklyRiskAverage || 0;
  
  const getRiskStyle = (score: number) => {
    if (score >= 70) return 'border-rose-500/30 text-rose-400 bg-rose-500/5';
    if (score >= 30) return 'border-orange-500/30 text-orange-400 bg-orange-500/5';
    return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5';
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:border-indigo-500/50 transition-all group relative overflow-hidden cursor-pointer"
    >
      {/* Admin Actions - Hover reveal */}
      {(onEdit || onDelete) && (
        <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10 translate-y-2 group-hover:translate-y-0">
          {onEdit && (
            <button 
              onClick={onEdit}
              className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500 hover:text-white transition-all shadow-lg"
            >
              <Edit size={16} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={onDelete}
              className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
            >
              <Trash size={16} />
            </button>
          )}
        </div>
      )}
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 blur-[80px] group-hover:bg-indigo-500/20 transition-all" />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <Cpu className="text-indigo-400" size={24} />
          </div>
          <div>
            <h3 className="text-text-main font-black italic uppercase tracking-tighter text-lg leading-tight">
              {equipment.name}
            </h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
              {equipment.type} • ID #{equipment.id}
            </p>
          </div>
        </div>
        <div className={`flex flex-col items-center px-4 py-1.5 rounded-2xl border backdrop-blur-md transition-colors ${getRiskStyle(riskScore)}`}>
           <span className="text-sm font-black italic">{riskScore}%</span>
        </div>
      </div>

      {/* Technical Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-slate-500" />
          <span className="text-xs text-slate-300 font-medium">{equipment.quartier || 'Casablanca'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-slate-500" />
          <span className="text-xs text-slate-300 font-medium">{equipment.zoneDensity || 'Inconnue'}</span>
        </div>
      </div>

      <div className="h-px bg-white/5 my-4" />

      {/* KPI Section */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Âge Actif</span>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-indigo-400" />
            <span className="text-sm text-white font-black italic">{equipment.age || 0} ans</span>
          </div>
          {equipment.installationDate && (
            <span className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter ml-6">
              Installé: {new Date(equipment.installationDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">MTTR (Réparation)</span>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-orange-400" />
            <span className="text-sm text-white font-black italic">{equipment.mttr || '0.0'}h</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
