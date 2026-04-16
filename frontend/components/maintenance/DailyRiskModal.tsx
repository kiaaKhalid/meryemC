'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, ArrowRight, Shield, AlertTriangle, Zap, MapPin } from 'lucide-react';
import { FleetDayRisk, DayForecast } from '@/services/maintenanceService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: FleetDayRisk | null;
  forecast?: DayForecast | null;
}

const DailyRiskModal = ({ isOpen, onClose, data, forecast }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!data) return null;

  const filteredEquipments = data?.equipments.filter(eq => 
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.quartier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusUI = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: Zap };
      case 'HIGH':
        return { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', icon: AlertTriangle };
      default:
        return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: Shield };
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-bg-card border border-border-main rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col transition-colors duration-300"
            >
              {/* Header */}
              <div className="p-8 border-b border-border-main flex justify-between items-center bg-bg-card/50 transition-colors duration-300">
                <div>
                  <h2 className="text-3xl font-black text-text-main italic tracking-tighter uppercase leading-none transition-colors">
                    Risque Flotte : {data.dayName}
                  </h2>
                  <p className="text-xs text-text-dim font-black uppercase tracking-[0.3em] mt-2 transition-colors">
                    Diagnostic Prédictif • {data.date}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 bg-bg-main/5 hover:bg-bg-main/10 rounded-2xl border border-border-main transition-all text-text-dim hover:text-text-main"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Weather Data Block (si la prévision est disponible) */}
              {forecast && (
                <div className="px-8 py-5 border-b border-border-main bg-bg-card/80 flex flex-wrap items-center justify-between gap-6 transition-colors">
                  <div className="flex flex-wrap gap-8">
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Météo Prévue</span>
                        <span className="text-xl font-bold text-text-main">{forecast.temp}°C</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Vent</span>
                        <span className="text-sm font-bold text-text-main mt-auto mb-1">{forecast.windSpeed} km/h</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Humidité</span>
                        <span className="text-sm font-bold text-text-main mt-auto mb-1">{forecast.humidity}%</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Pression</span>
                        <span className="text-sm font-bold text-text-main mt-auto mb-1">{forecast.pressure} hPa</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-text-dim tracking-widest mb-1">Index UV</span>
                        <span className="text-sm font-bold text-text-main mt-auto mb-1">{forecast.uvIndex}</span>
                     </div>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl flex flex-col items-center">
                     <span className="text-[10px] uppercase font-black text-indigo-400 tracking-widest">Score Risque Météo</span>
                     <span className="text-sm font-black text-indigo-300">{forecast.riskScore}/100</span>
                  </div>
                </div>
              )}

              {/* Search Bar */}
              <div className="px-8 py-6 border-b border-border-main bg-bg-main/5 flex gap-4 transition-colors duration-300">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
                  <input 
                    type="text"
                    placeholder="Rechercher un équipement ou un quartier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-bg-main/5 border border-border-main rounded-2xl py-3 pl-12 pr-4 text-sm text-text-main placeholder:text-text-dim focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <button className="px-6 py-2 bg-bg-input border border-border-main rounded-2xl text-xs font-black text-text-dim uppercase tracking-widest flex items-center gap-3 hover:bg-bg-hover transition-colors">
                  <Filter size={16} />
                  Filtrer
                </button>
              </div>

              {/* List Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                {filteredEquipments.length > 0 ? (
                  filteredEquipments.map((eq, idx) => {
                    const ui = getStatusUI(eq.urgencyLevel);
                    const Icon = ui.icon;

                    return (
                      <motion.div
                        key={eq.id ? `eq-${eq.id}` : `idx-${idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="group flex items-center justify-between p-5 bg-bg-hover border border-border-subtle hover:border-border-main rounded-3xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-6">
                          <div className={`p-4 rounded-2xl ${ui.bg} border ${ui.border} ${ui.color}`}>
                            <Icon size={24} />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-text-main italic tracking-tighter uppercase leading-none transition-colors duration-300">
                              {eq.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-2 font-bold transition-colors">
                              <span className="text-xs text-text-dim uppercase tracking-widest">{eq.type}</span>
                              <div className="w-1.5 h-1.5 bg-border-main rounded-full" />
                              <span className="text-xs text-text-dim uppercase tracking-widest flex items-center gap-2 opacity-80">
                                <MapPin size={12} />
                                {eq.quartier || 'Zone Industrielle'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="flex flex-col items-end">
                            <span className="text-3xl font-black italic tracking-tighter ${ui.color}">
                              {eq.riskScore}%
                            </span>
                            <span className="text-xs font-black text-text-muted uppercase tracking-widest">
                              Indice de Risque
                            </span>
                          </div>
                          <button className="p-3 bg-bg-input border border-border-main rounded-2xl text-text-muted group-hover:text-text-main group-hover:bg-blue-600/20 group-hover:border-blue-600/30 transition-all duration-500">
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-text-muted">
                    <Search size={48} className="opacity-20 mb-4" />
                    <p className="text-xs font-black uppercase tracking-[0.2em]">Aucun résultat trouvé</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border-subtle bg-bg-hover flex justify-between items-center text-xs font-black text-text-muted uppercase tracking-widest">
                <span>Total Equipements : {data.equipments.length}</span>
                <span>Casablanca Industry Park • Diagnostic IA v3.2</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border-subtle);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }
      `}</style>
    </>
  );
};

export default DailyRiskModal;
