"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  TrendingUp, AlertCircle, Zap, 
  CloudRain, Wind, Activity,
  MoreHorizontal,
  Tornado, Waves, Orbit, Navigation2,
  ChevronUp, ChevronDown,
  Info, Gauge, Globe, Shield, 
  Timer, BarChart3, Database, 
  Thermometer, UserCheck, CheckCircle2,
  TrendingDown, ShoppingCart, 
  Hammer, AlertTriangle, Play
} from 'lucide-react';
import { getAdvancedStats, getAllEquipments, AdvancedStats } from '../services/maintenanceService';

// Dynamic Import for the Map to handle Leaflet SSR issues
const EquipmentMap = dynamic(() => import('./Map/EquipmentMap'), { ssr: false });

// --- SUB-COMPONENTS (High Fidelity UI) ---

const Tooltip = ({ text }: { text: string }) => (
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-bg-modal text-text-dim text-xs rounded-lg opacity-0 group-hover/info:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl border border-border-main backdrop-blur-xl italic">
    {text}
  </div>
);

const GlassCard = ({ children, title, className, icon: Icon, info, subtitle }: any) => (
  <div className={`bg-bg-card/80 border border-border-main rounded-xl p-6 shadow-2xl relative overflow-hidden group ${className}`}>
    <div className="flex justify-between items-start mb-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-blue-500/70" strokeWidth={3} />}
          <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.25em]">{title}</h3>
          {info && (
            <div className="group/info relative ml-1">
              <Info size={14} className="text-text-muted cursor-help hover:text-blue-500 transition-colors" />
              <Tooltip text={info} />
            </div>
          )}
        </div>
        {subtitle && <p className="text-xs font-bold text-text-dim/60 italic lowercase">{subtitle}</p>}
      </div>
      <MoreHorizontal size={18} className="text-text-muted cursor-pointer hover:text-text-main transition-colors" />
    </div>
    {children}
  </div>
);

const CircularGauge = ({ value, subValue, color = "emerald", size = 100 }: any) => {
  const radius = size * 0.34;
  const stroke = size * 0.07;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  const colors: any = {
    emerald: { stroke: "#10B981" },
    blue: { stroke: "#3B82F6" },
    amber: { stroke: "#F59E0B" },
    rose: { stroke: "#F43F5E" },
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} stroke="#1E293B" strokeWidth={stroke} fill="transparent" />
        <motion.circle 
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx={size/2} cy={size/2} r={radius} stroke={colors[color].stroke} strokeWidth={stroke} fill="transparent" 
          strokeDasharray={circumference} strokeLinecap="round"
          className={`drop-shadow-[0_0_8px_${colors[color].stroke}66]`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-text-main italic tracking-tighter leading-none">{Math.round(value)}</span>
        {subValue && <span className="text-xs text-text-muted font-black uppercase tracking-widest mt-1">{subValue}</span>}
      </div>
    </div>
  );
};

const RollingNumber = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
    return (
        <span className="tabular-nums">
            {prefix}{value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}{suffix}
        </span>
    );
};

export default function DashboardContent() {
  const [equipments, setEquipments] = useState<any[]>([]);
  const [stats, setStats] = useState<AdvancedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eqData, statsData] = await Promise.all([
          getAllEquipments(),
          getAdvancedStats()
        ]);
        setEquipments(eqData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
        <div className="flex-1 bg-bg-main min-h-screen flex items-center justify-center">
            <Orbit className="text-blue-500 animate-spin" size={48} />
        </div>
    );
  }

  return (
    <div className="flex-1 bg-bg-main min-h-screen p-6 transition-colors duration-500 overflow-y-auto selection:bg-blue-500/30 text-text-main font-sans">
      
      {/* --- HEADER: OPERATIONAL STATUS --- */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-text-main flex items-center gap-4">
                <Shield className="text-blue-500" size={36} />
                MERYEM <span className="text-blue-500/50">|</span> ECOSYSTÈME INDUSTRIEL
            </h1>
            <p className="text-xs font-black text-text-muted uppercase tracking-[0.3em] mt-2 ml-14">Surveillance temps réel • Casablanca Hub</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-bg-card border border-border-main px-6 py-3 rounded-lg flex items-center gap-4 shadow-xl">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                <span className="text-xs font-black text-text-dim uppercase tracking-widest">Connectivité IA: OPTIMALE</span>
            </div>
            <div className="bg-bg-card border border-border-main px-6 py-3 rounded-lg flex items-center gap-4 shadow-xl">
                <Timer className="text-blue-400" size={18} />
                <span className="text-sm font-black text-text-dim uppercase tracking-widest tabular-nums">{new Date().toLocaleTimeString()}</span>
            </div>
        </div>
      </div>

      {/* --- PART 1: DIRECTION GÉNÉRALE (EXECUTIVE) --- */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-main to-transparent opacity-30" />
            <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.5em] whitespace-nowrap">PARTIE 1 : DIRECTION GÉNÉRALE (L&apos;EXÉCUTIF)</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-main to-transparent opacity-30" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <GlassCard 
                title="Value-at-Risk (EVaR)" 
                subtitle="Argent en Danger"
                icon={Zap}
                info="Estimation financière (MAD) des équipements en alerte critique (>80%)."
            >
                <div className="mt-3">
                    <h4 className="text-4xl font-black text-rose-500 italic tracking-tighter leading-none">
                        <RollingNumber value={stats?.evar || 0} suffix=" MAD" />
                    </h4>
                    <div className="flex items-center gap-2 mt-3">
                        <TrendingUp size={14} className="text-rose-500" />
                        <span className="text-xs font-black text-rose-500">+12.4%</span>
                        <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">vs mois préc.</span>
                    </div>
                </div>
            </GlassCard>

            <GlassCard 
                title="Score de Résilience" 
                subtitle="Indice de Santé Global"
                icon={Globe}
                info="Si >98% : Ville en sécurité. Si <85% : Réunion d'urgence DG requise."
            >
                <div className="flex items-center gap-6 mt-2">
                    <CircularGauge value={stats?.irg || 0} color={(stats?.irg || 0) < 85 ? "rose" : "emerald"} size={80} />
                    <div>
                        <p className={`text-base font-black italic ${(stats?.irg || 0) < 85 ? "text-rose-500" : "text-emerald-500"}`}>
                            {(stats?.irg || 0) >= 98 ? "SÉCURITÉ" : (stats?.irg || 0) < 85 ? "URGENCE" : "STABLE"}
                        </p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Seuil Alerte : 85%</p>
                    </div>
                </div>
            </GlassCard>

            <GlassCard 
                title="Bouclier Populationnel" 
                subtitle="Citoyens Impactés"
                icon={UserCheck}
                info="Nombre de citoyens directement exposés à une coupure imminente (Zone Rouge)."
            >
                <div className="mt-3">
                    <h4 className="text-4xl font-black text-text-main italic tracking-tighter leading-none">
                        <RollingNumber value={stats?.populationShield || 0} />
                    </h4>
                    <span className="text-xs font-black text-text-muted uppercase tracking-widest">Citoyens en zone rouge</span>
                    <div className="flex gap-1 mt-3">
                        {[1,2,3,4,5,6,7].map(i => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 4 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-slate-800'}`} />
                        ))}
                    </div>
                </div>
            </GlassCard>

            <GlassCard 
                title="ROI IA Industrielle" 
                subtitle="Economies Réalisées"
                icon={TrendingUp}
                info="Argent sauvé depuis le début du mois grâce à l'Action 'Maintenance préventive'."
            >
                <div className="mt-3">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-emerald-500 italic tracking-tighter leading-none">+</span>
                        <h4 className="text-3xl font-black text-emerald-500 italic tracking-tighter leading-none">
                            <RollingNumber value={stats?.roiSavings || 0} suffix=" MAD" />
                        </h4>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded px-2.5 py-1 mt-3 inline-block">
                        <span className="text-xs font-black text-emerald-500 uppercase tracking-tighter animate-pulse">ROI : 3.4x</span>
                    </div>
                </div>
            </GlassCard>

            <GlassCard 
                title="Disponibilité Réseau" 
                subtitle="Zero Coupure"
                icon={CheckCircle2}
                info="Temps total où l'électricité a fonctionné sans interruption sur 30 jours."
            >
                <div className="mt-3">
                    <h4 className="text-4xl font-black text-blue-400 italic tracking-tighter leading-none">
                        {stats?.networkAvailability.toFixed(2)}<span className="text-base ml-1">%</span>
                    </h4>
                    <div className="h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stats?.networkAvailability}%` }}
                            className="h-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                        />
                    </div>
                </div>
            </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- PART 2: COMMANDEMENT (OPERATIONAL) --- */}
        <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-4">
                <h2 className="text-xs font-black text-amber-500 uppercase tracking-[0.5em] whitespace-nowrap text-left">PARTIE 2 : COMMANDEMENT (OPERATIONNEL)</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-border-main to-transparent opacity-30" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard title="Taux d&apos;Anticipation" icon={Activity} info="Ratio Curatif vs Préventif. Preuve de l'efficacité de la détection précoce IA.">
                    <div className="h-32 flex flex-col justify-center">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-xs font-black text-text-muted uppercase">Préventif (IA)</span>
                            <span className="text-2xl font-black text-emerald-500 italic">{stats?.anticipationRate.toFixed(0)}%</span>
                        </div>
                        <div className="h-8 bg-slate-800 rounded-lg overflow-hidden flex border border-border-main p-1">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${stats?.anticipationRate}%` }}
                                className="h-full bg-emerald-500 rounded shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                            />
                            <div className="h-full flex-1 bg-rose-500/20" />
                        </div>
                        <div className="flex justify-between mt-3 font-black text-[10px] uppercase tracking-widest text-text-muted">
                            <span>SÉCURITÉ</span>
                            <span>URGENCE</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard title="Effondrement du MTTR" icon={Timer} info="Cumul des heures de réparation évitées grâce à l'IA.">
                    <div className="flex flex-col items-center justify-center h-32">
                        <div className="bg-blue-500/5 p-5 rounded-full border border-blue-500/20 relative">
                            <TrendingDown className="text-blue-400 absolute top-0 -right-2" size={24} />
                            <h4 className="text-5xl font-black text-blue-400 italic tracking-tighter leading-none">
                                <RollingNumber value={stats?.mttrCollapsed || 0} />
                            </h4>
                        </div>
                        <p className="text-xs font-black text-text-dim uppercase tracking-widest mt-6">Heures de panne évitées</p>
                    </div>
                </GlassCard>

                <GlassCard title="Score de Confiance IA" icon={CheckCircle2} info="Fiabilité moyenne des prédictions actuelles certifiées par l'algorithme.">
                    <div className="flex flex-col items-center justify-center h-32">
                        <div className="relative">
                            <CircularGauge value={stats?.iaConfidenceScore || 0} color="blue" size={100} />
                            <div className="absolute -bottom-3 -right-3 bg-emerald-500 px-2 py-1 rounded text-[10px] font-black text-slate-900 border border-emerald-400 shadow-xl">
                                CERTIFIÉ
                            </div>
                        </div>
                        <p className="text-xs font-bold text-text-muted italic mt-6 text-center">Basé sur {stats?.top5CriticalAssets?.length || 0} alertes actives</p>
                    </div>
                </GlassCard>
            </div>

            <GlassCard title="Top 5 des Actifs Critiques" icon={AlertTriangle} info="Classement dynamique des équipements à haute probabilité de panne.">
                <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-main bg-bg-modal/30">
                                <th className="p-4 text-xs font-black text-text-muted uppercase tracking-[0.2em]">ACTIF INDUSTRIEL</th>
                                <th className="p-4 text-xs font-black text-text-muted uppercase tracking-[0.2em]">LOCALISATION</th>
                                <th className="p-4 text-xs font-black text-text-muted uppercase tracking-[0.2em]">PROBABILITÉ</th>
                                <th className="p-4 text-xs font-black text-text-muted uppercase tracking-[0.2em]">URGENCE</th>
                                <th className="p-4 text-xs font-black text-text-muted uppercase tracking-[0.2em] text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.top5CriticalAssets?.map((asset, idx) => (
                                <tr key={asset.id} className="border-b border-border-subtle hover:bg-white/5 transition-colors group/row">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-1.5 h-10 rounded-full ${idx === 0 ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                            <div>
                                                <p className="text-sm font-black text-text-main italic">{asset.name}</p>
                                                <p className="text-xs font-bold text-text-muted uppercase">{asset.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs font-black text-text-dim/80 tabular-nums uppercase">{asset.quartier}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-black italic ${idx === 0 ? 'text-rose-500' : 'text-amber-500'}`}>{asset.probability.toFixed(1)}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded border ${asset.urgency === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                                            {asset.urgency}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2 rounded transition-all opacity-0 group-hover/row:opacity-100 flex items-center gap-2 ml-auto shadow-lg">
                                            <Play size={12} fill="currentColor" />
                                            DÉPLOYER ÉQUIPE
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* --- MAP INTEGRATION --- */}
            <GlassCard 
                title="Géolocalisation de la Flotte" 
                icon={Navigation2}
                info="Visualisation en temps réel de tous les actifs industriels sur le maillage de Casablanca."
                className="h-[500px] flex flex-col"
            >
                <div className="flex-1 w-full mt-2 rounded-lg overflow-hidden border border-border-subtle relative bg-bg-main/5">
                    <EquipmentMap equipments={equipments} />
                    <div className="absolute bottom-8 right-8 z-[1000] p-4 bg-bg-modal/80 backdrop-blur-md rounded-xl border border-border-main shadow-2xl space-y-3 min-w-[180px]">
                        <div className="flex items-center justify-between gap-8">
                            <span className="text-xs font-black text-text-dim uppercase tracking-widest">Actifs Totaux</span>
                            <span className="text-sm font-black text-text-main italic">{equipments.length}</span>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>

        {/* --- PART 3: ANALYSE ENVIRONNEMENTALE --- */}
        <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
                <h2 className="text-xs font-black text-emerald-500 uppercase tracking-[0.5em] whitespace-nowrap text-left">PARTIE 3 : ANALYSE ENVIRONNEMENTALE</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-border-main to-transparent opacity-30" />
            </div>

            <GlassCard title="Indice de Pression" icon={Thermometer} info="Stress Thermique & Éolien : Graphique croisant la Température (°C) et la Vitesse vent (km/h) sur 48h.">
                <div className="space-y-6 mt-4">
                    <div className="flex justify-between items-center bg-bg-hover/50 p-4 rounded-lg border border-border-subtle">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/10 rounded-lg">
                                <Thermometer className="text-amber-500" size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-text-muted uppercase">Stress Thermique</p>
                                <p className="text-base font-black text-text-main italic">MODÉRÉ</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-amber-500 italic tracking-tighter">28.4°C</p>
                            <p className="text-[10px] font-bold text-text-muted tracking-widest">PIC PRÉVU</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-bg-hover/50 p-4 rounded-lg border border-border-subtle">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Wind className="text-blue-500" size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-text-muted uppercase">Stress Éolien</p>
                                <p className="text-base font-black text-text-main italic">STABLE</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-blue-500 italic tracking-tighter">45 km/h</p>
                            <p className="text-[10px] font-bold text-text-muted tracking-widest">RAFALES 48H</p>
                        </div>
                    </div>

                    <div className="p-4 bg-bg-modal/30 rounded-xl border border-border-main relative h-32 overflow-hidden shadow-inner">
                        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                            <motion.path 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                d="M0,25 Q15,5 30,22 T60,10 T100,5" 
                                fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="1,2"
                            />
                            <motion.path 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                d="M0,15 Q25,8 50,18 T100,12" 
                                fill="none" stroke="#3B82F6" strokeWidth="1"
                            />
                        </svg>
                        <div className="absolute bottom-3 left-4 flex gap-6 text-[10px] font-black uppercase text-text-muted tracking-widest">
                            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-emerald-500" /> Temp.</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-blue-500" /> Vent</div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            <GlassCard title="Dégradation Accélérée" icon={TrendingUp} info="Identifie les équipements qui vieillissent prématurément à cause du climat local.">
                <div className="py-2">
                    <div className="flex items-center gap-6">
                        <CircularGauge value={stats?.acceleratedDegradationRate || 0} color="amber" size={90} subValue="USURE" />
                        <div className="flex-1 space-y-2">
                            <p className="text-sm font-black text-text-main uppercase tracking-widest leading-tight">Facteur Climatique</p>
                            <p className="text-xs font-medium text-text-muted italic leading-tight">Vieillissement prématuré détecté sur 12 assets côtiers.</p>
                        </div>
                    </div>
                </div>
            </GlassCard>

            <GlassCard title="Probabilité Rupture SLA" icon={AlertTriangle} info="Alerte si une panne risque de dépasser le temps maximum autorisé (Service Level Agreement).">
                <div className={`p-6 rounded-lg border flex items-center justify-between transition-all ${ (stats?.slaRuptureProbability || 0) > 10 ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 animate-pulse' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'}`}>
                    <div className="flex items-center gap-6">
                        <ShoppingCart size={32} />
                        <div>
                            <p className="text-3xl font-black italic tracking-tighter leading-none">{stats?.slaRuptureProbability.toFixed(1)}%</p>
                            <p className="text-xs font-black uppercase tracking-widest mt-2">Niveau d&apos;alerte SLA</p>
                        </div>
                    </div>
                    {(stats?.slaRuptureProbability || 0) > 10 && <ShoppingCart size={24} className="animate-bounce" />}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-bg-card p-4 rounded border border-border-main text-center shadow-inner">
                        <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-1.5">Délai Légal MOY.</p>
                        <p className="text-2xl font-black text-text-main italic tabular-nums">4h 00</p>
                    </div>
                    <div className="bg-bg-card p-4 rounded border border-border-main text-center shadow-inner">
                        <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-1.5">Est. Réparation</p>
                        <p className="text-2xl font-black text-rose-500 italic tabular-nums">5h 12</p>
                    </div>
                </div>
            </GlassCard>
        </div>

      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: var(--bg-main);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--border-subtle);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--border-main);
        }
      `}</style>

    </div>
  );
}