'use client';

import React from 'react';
import { 
  Sun, Cloud, CloudLightning, Wind, Thermometer, 
  Droplets, Gauge, Radiation, ScanEye, Zap
} from 'lucide-react';
import { DayForecast } from '@/services/maintenanceService';
import { motion } from 'framer-motion';

interface Props {
  forecast: DayForecast[];
  onDayClick?: (dayIndex: number) => void;
}

const WMO_MAP: Record<number, any> = {
  0: { icon: Sun, color: 'text-yellow-400', label: 'Dégagé' },
  1: { icon: Cloud, color: 'text-blue-200', label: 'Partiellement nuageux' },
  3: { icon: Cloud, color: 'text-slate-400', label: 'Couvert' },
  45: { icon: Cloud, color: 'text-slate-500', label: 'Brouillard' },
  95: { icon: CloudLightning, color: 'text-rose-500', label: 'Orage' },
};

const getBorderClass = (isCritical: boolean, isWarning: boolean) => {
  if (isCritical) return 'border-rose-500/30 bg-rose-500/5';
  if (isWarning) return 'border-orange-400/20';
  return 'border-border-main';
};

const getGaugeClass = (isCritical: boolean, isWarning: boolean) => {
  if (isCritical) return 'bg-rose-500 shadow-[0_2px_10px_rgba(244,63,94,0.6)]';
  if (isWarning) return 'bg-orange-500';
  return 'bg-emerald-500';
};

const getScoreColor = (isCritical: boolean, isWarning: boolean) => {
  if (isCritical) return 'text-rose-500';
  if (isWarning) return 'text-orange-400';
  return 'text-emerald-400';
};

const getRecommendationLabel = (isCritical: boolean, isWarning: boolean) => {
  if (isCritical) return "Réparation d'urgence";
  if (isWarning) return "Maintenance requise";
  return "Système nominal";
};

const WeeklyForecast = ({ forecast, onDayClick }: Props) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2 px-4 italic text-xs font-black text-text-dim uppercase tracking-[0.4em] transition-colors duration-300">
         <span>Chronologie Industrielle</span>
         <span>Analyse de Données Casablanca (Open-Meteo V3)</span>
      </div>

      {forecast.map((day, idx) => {
        const WeatherIcon = WMO_MAP[day.wmoCode]?.icon || Cloud;
        const weatherColor = WMO_MAP[day.wmoCode]?.color || 'text-slate-400';
        
        // ML Score Indicators
        const isCritical = day.riskScore > 60;
        const isWarning = day.riskScore >= 30;
        const forceAlert = day.wmoCode === 95;

        return (
          <motion.div 
            key={day.date || idx} 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onDayClick?.(idx)}
            className={`group flex flex-col lg:flex-row items-center gap-8 p-6 lg:px-10 bg-bg-card/40 border rounded-[2.5rem] hover:bg-bg-card/60 transition-all duration-700 relative overflow-hidden cursor-pointer active:scale-[0.98] shadow-sm ${getBorderClass(isCritical, isWarning)}`}
          >
            {/* NEW: Top Risk Level Bar (Visual Gauge) */}
            <div className="absolute top-0 left-0 w-full h-1 opacity-50 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${getGaugeClass(isCritical, isWarning)}`} 
                style={{ width: `${day.riskScore}%` }}
              />
            </div>

            {/* 1. Date & Action Badge */}
            <div className="flex flex-col min-w-[140px] relative">
              <span className="text-text-main font-black italic tracking-tighter text-4xl uppercase leading-none transition-colors duration-300">{day.dayName}</span>
              <span className="text-xs text-text-dim font-bold uppercase tracking-widest mt-2 transition-colors duration-300">{day.date}</span>
              
              {forceAlert && (
                <div className="absolute -top-4 -left-4 p-2 bg-rose-500 rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse">
                   <Zap className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* 2. Weather Icon & Temperature */}
            <div className="flex items-center gap-6 border-l border-border-main pl-8 transition-colors duration-300">
              <div className="p-4 rounded-3xl bg-bg-card border border-border-main group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <WeatherIcon className={`w-8 h-8 ${weatherColor} drop-shadow-[0_0_12px_rgba(var(--text-main),0.2)]`} />
              </div>
              <div className="flex flex-col">
                 <span className="text-2xl font-bold text-text-main tracking-tighter transition-colors duration-300">{day.temp}°C</span>
                 <span className="text-xs text-text-dim font-bold tracking-widest uppercase transition-colors duration-300">{WMO_MAP[day.wmoCode]?.label || 'Standard'}</span>
              </div>
            </div>

            {/* 3. EXHAUSTIVE METADATA GRID (Pressure, UV, Dew Point, etc.) */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 border-l border-border-subtle pl-8 py-2">
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-sky-400 opacity-60" />
                <div className="flex flex-col text-left">
                   <span className="text-xs text-text-dim font-black uppercase tracking-widest leading-none mb-1 transition-colors duration-300">Humidité</span>
                   <span className="text-sm font-bold text-text-main/80 transition-colors duration-300">{day.humidity}%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-emerald-400 opacity-60" />
                <div className="flex flex-col text-left">
                   <span className="text-xs text-text-dim font-black uppercase tracking-widest leading-none mb-1">Pression</span>
                   <span className="text-sm font-bold text-text-main">{day.pressure} hPa</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Radiation className="w-5 h-5 text-orange-400 opacity-60" />
                <div className="flex flex-col text-left">
                   <span className="text-xs text-text-dim font-black uppercase tracking-widest leading-none mb-1">UV Index</span>
                   <span className="text-sm font-bold text-text-main">{day.uvIndex}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-rose-400 opacity-60" />
                <div className="flex flex-col text-left">
                   <span className="text-xs text-text-dim font-black uppercase tracking-widest leading-none mb-1">Pt. Rosée</span>
                   <span className="text-sm font-bold text-text-main">{Math.round(day.dewPoint)}°C</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ScanEye className="w-5 h-5 text-indigo-400 opacity-60" />
                <div className="flex flex-col text-left">
                   <span className="text-xs text-text-dim font-black uppercase tracking-widest leading-none mb-1">Visibilité</span>
                   <span className="text-sm font-bold text-text-main">{day.visibility} km</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5 text-text-dim opacity-60" />
                <div className="flex flex-col text-left">
                   <span className="text-xs text-text-dim font-black uppercase tracking-widest leading-none mb-1">Vitesse Vent</span>
                   <span className="text-sm font-bold text-text-main">{day.windSpeed} km/h</span>
                </div>
              </div>
            </div>

            {/* 4. RECOMMENDATION & SCORE */}
            <div className="min-w-[280px] flex flex-col items-end gap-3 border-l border-border-main pl-8 transition-colors duration-300">
              <div className="flex flex-col items-end">
                <span className={`text-[30px] font-black uppercase tracking-[0.2em] mb-1 ${getScoreColor(isCritical, isWarning)}`}>
                  {Math.round(day.riskScore)}/100
                </span>
                <span className={`text-sm font-black italic tracking-tighter uppercase ${getScoreColor(isCritical, isWarning)}`}>
                   {getRecommendationLabel(isCritical, isWarning)}
                </span>
              </div>
              <p className={`text-right text-[11px] font-bold leading-tight ${isWarning ? 'text-text-main/90' : 'text-text-dim'} italic uppercase tracking-tighter max-w-[240px] transition-colors duration-300`}>
                 {day.recommendation}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WeeklyForecast;
