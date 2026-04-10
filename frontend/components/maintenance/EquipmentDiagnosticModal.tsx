'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Cpu, Activity, Clock, Zap, MapPin,
  ChevronRight
} from 'lucide-react';
import { getEquipmentDetail, EquipmentDetail, RiskForecast } from '@/services/maintenanceService';

interface EquipmentDiagnosticModalProps {
  readonly id: number | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function EquipmentDiagnosticModal({ id, isOpen, onClose }: EquipmentDiagnosticModalProps) {
  const [detail, setDetail] = useState<EquipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && isOpen) {
      const fetchDetail = async () => {
        setLoading(true);
        const data = await getEquipmentDetail(id);
        setDetail(data);
        setLoading(false);
      };
      fetchDetail();
    }
  }, [id, isOpen]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg-main/80 backdrop-blur-2xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-bg-card border border-border-main rounded-[3rem] overflow-hidden shadow-[0_0_100px_-20px_rgba(79,70,229,0.1)] flex flex-col md:flex-row transition-colors duration-300"
          >
            {/* Left Sidebar - Equipment Info */}
            <div className="w-full md:w-80 bg-bg-main/5 border-r border-border-main p-8 flex flex-col gap-8 transition-colors duration-300">
              <div>
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-6">
                  <Cpu className="text-indigo-400" size={32} />
                </div>
                <h2 className="text-text-main font-black italic uppercase tracking-tighter text-2xl leading-tight mb-2 transition-colors">
                  {detail?.name || 'Asset Diagnostic'}
                </h2>
                <div className="flex items-center gap-2 text-text-dim text-xs font-black uppercase tracking-widest transition-colors">
                  <Activity size={14} />
                  <span>{detail?.type || 'Type Inconnu'} • ID #{detail?.id}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-text-dim font-black uppercase tracking-widest">Localisation</span>
                  <div className="flex items-center gap-2 text-text-main font-bold italic text-base">
                    <MapPin size={16} className="text-indigo-400" />
                    <span>{detail?.quartier}, Casablanca</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-text-dim font-black uppercase tracking-widest">Âge de l'Actif</span>
                  <div className="flex items-center gap-2 text-text-main font-bold italic text-base">
                    <Clock size={16} className="text-emerald-400" />
                    <span>{detail?.age} ans d'opération</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-text-dim font-black uppercase tracking-widest">MTTR Moyen</span>
                  <div className="flex items-center gap-2 text-text-main font-bold italic text-base">
                    <Zap size={16} className="text-orange-400" />
                    <span>{detail?.mttr}h temps de réparation</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-border-main">
                <p className="text-xs text-text-muted font-bold uppercase tracking-widest leading-relaxed">
                  Calcul de risque basé sur télémétrie L3 et modèle XGBoost ML v.2.4
                </p>
              </div>
            </div>

            {/* Right Content - 7-Day Forecast */}
            <div className="flex-1 p-8 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                  <h3 className="text-text-main font-black italic uppercase tracking-tighter text-xl transition-colors">
                    Pronostic Vital <span className="text-text-dim">7 Jours</span>
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-2xl bg-bg-main/5 border border-border-main flex items-center justify-center text-text-dim hover:text-text-main hover:bg-bg-main/10 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <span className="text-text-dim text-xs font-black uppercase tracking-[0.3em]">Calibration IA...</span>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                  {detail?.forecast?.map((day: RiskForecast, idx: number) => (
                    <motion.div
                      key={`${detail.id}-forecast-${idx}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-bg-main/5 hover:bg-bg-main/10 border border-border-main rounded-2xl p-5 flex items-center justify-between transition-all duration-300 shadow-sm"
                    >
                      <div className="flex items-center gap-5">
                        <div className="text-center w-16">
                          <span className="block text-xs text-text-dim font-black uppercase tracking-widest mb-1">
                            {idx === 0 ? "Now" : "J+" + idx}
                          </span>
                          <span className="block text-sm text-text-main font-black italic group-hover:text-indigo-400 transition-colors">
                            {day.dayName.substring(0, 3)}
                          </span>
                        </div>
                        <div className="w-px h-12 bg-border-subtle" />
                        <div>
                          <div className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border inline-block mb-1.5 ${getRiskColor(day.urgencyLevel)}`}>
                            {day.urgencyLevel}
                          </div>
                          <p className="text-text-dim text-xs font-medium max-w-[240px] leading-tight">
                            {day.recommendation}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-text-dim font-black uppercase tracking-widest">Risque</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl text-text-main font-black italic tracking-tighter">
                            {day.riskScore}%
                          </span>
                          <ChevronRight size={14} className="text-text-muted group-hover:text-indigo-500 transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
