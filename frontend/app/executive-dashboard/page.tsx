"use client";

import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from "recharts";
import { 
  ShieldCheck, TrendingUp, AlertTriangle, Users, Activity, 
  Wind, Thermometer, BrainCircuit, Timer, HeartPulse, 
  Banknote, Globe, ChevronRight, Zap
} from "lucide-react";
import { getAdvancedStats, AdvancedStats, mapRiskToUI } from "@/services/maintenanceService";
import Navbar from "@/components/Navbar";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

export default function ExecutiveDashboard() {
  const [stats, setStats] = useState<AdvancedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const data = await getAdvancedStats();
      if (data) setStats(data);
      setLoading(false);
    }
    loadStats();
    const interval = setInterval(loadStats, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-8">
      <div className="text-center p-8 glass rounded-2xl border border-red-500/20 max-w-md">
        <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text-main mb-2">Erreur système critique</h2>
        <p className="text-text-dim mb-6">Impossible de se connecter au moteur d'intelligence industrielle (Python API Offline).</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Réessayer</button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-bg-main pb-20">
      <Navbar />
      
      <div className="max-w-[1600px] mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-text-main">Plateforme Executive Predict-Casa</h1>
            </div>
            <p className="text-text-dim text-lg">Système d'Expertise Industrielle en Temps Réel • Casablanca Fleet</p>
          </div>
          <div className="flex gap-4">
             <div className="glass px-4 py-2 rounded-xl border border-border-main flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-medium text-text-main">IA Active : Moteur Keras Expert 2.0</span>
             </div>
             <div className="glass px-4 py-2 rounded-xl border border-border-main text-sm font-medium text-text-dim">
                Dernière analyse : {new Date().toLocaleTimeString()}
             </div>
          </div>
        </div>

        {/* PARTIE 1: DIRECTION GÉNÉRALE (L'EXÉCUTIF) */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <h2 className="text-2xl font-bold text-text-main uppercase tracking-wider">I. Vision Stratégique & Risque Financier</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <KPICard title="Economic Value-at-Risk" value={`${stats.evar.toLocaleString()} MAD`} subtitle="Risque financier critique" icon={<Banknote />} color="text-rose-500" />
            <KPICard title="Indice de Résilience (IRG)" value={`${stats.irg.toFixed(1)}%`} subtitle={stats.irg > 90 ? "Sécurité Optimale" : "Alerte de réunion"} icon={<HeartPulse />} color={stats.irg > 85 ? "text-emerald-500" : "text-rose-500"} isProgress progress={stats.irg} />
            <KPICard title="Bouclier Populationnel" value={stats.populationShield.toLocaleString()} subtitle="Citoyens en Zone Rouge" icon={<Users />} color="text-orange-500" />
            <KPICard title="ROI de l'IA" value={`${stats.roiSavings.toLocaleString()} MAD`} subtitle="Argent sauvé ce mois" icon={<TrendingUp />} color="text-blue-500" />
            <KPICard title="Disponibilité Réseau" value={`${stats.networkAvailability.toFixed(2)}%`} subtitle="Uptime Casablanca" icon={<Globe />} color="text-indigo-500" isProgress progress={stats.networkAvailability} />
          </div>
        </section>

        {/* PARTIE 2: COMMANDEMENT (LE TERRAIN) */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-amber-500" />
            <h2 className="text-2xl font-bold text-text-main uppercase tracking-wider">II. Contrôle Opérationnel & Anticipation</h2>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Chart: Ratio Curatif vs Préventif */}
            <div className="xl:col-span-2 glass rounded-3xl p-8 border border-border-main">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-1">Taux d'Anticipation Stratégique</h3>
                  <p className="text-sm text-text-dim">Ratio Maintenance Préventive vs Curative (IA Analytics)</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-emerald-500">{stats.anticipationRate.toFixed(1)}%</span>
                  <p className="text-xs text-text-muted mt-1">Niveau d'anticipation</p>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{n: 'T', p: stats.anticipationRate, c: 100 - stats.anticipationRate}, {n: 'T+1', p: stats.anticipationRate + 2, c: 100 - stats.anticipationRate - 2}]}>
                     <defs>
                      <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0a1016', border: '1px solid #334155'}} />
                    <Area type="monotone" dataKey="p" name="Maintenance Préventive" stroke="#10b981" fillOpacity={1} fill="url(#colorPrev)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-8 mt-8 border-t border-border-main pt-8">
                 <div>
                    <h4 className="text-text-dim text-sm mb-1 italic">Effondrement MTTR</h4>
                    <p className="text-2xl font-bold text-text-main">-{stats.mttrCollapsed.toFixed(1)}h <span className="text-emerald-500 text-xs font-normal">sauvées</span></p>
                 </div>
                 <div>
                    <h4 className="text-text-dim text-sm mb-1 italic">Confiance IA</h4>
                    <p className="text-2xl font-bold text-text-main">{stats.iaConfidenceScore.toFixed(1)}%</p>
                 </div>
                 <div>
                    <h4 className="text-text-dim text-sm mb-1 italic">Alertes Scannées</h4>
                    <p className="text-2xl font-bold text-text-main">44,821</p>
                 </div>
              </div>
            </div>

            {/* Top 5 Critical Assets */}
            <div className="glass rounded-3xl p-8 border border-border-main flex flex-col">
              <h3 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                TOP 5 Actifs Critiques
              </h3>
              <div className="flex-grow space-y-4">
                {stats.top5CriticalAssets.map((asset, i) => (
                  <div key={asset.id} className="group p-4 bg-bg-main/50 rounded-2xl border border-border-main hover:border-blue-500/50 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-tighter">#{i+1} • {asset.quartier}</span>
                        <h4 className="font-bold text-text-main truncate max-w-[180px]">{asset.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-rose-500">{asset.probability.toFixed(1)}%</span>
                        <p className="text-[10px] text-text-muted">Risque Panne</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-dashed border-border-main">
                       <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${asset.urgency === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500' : 'bg-orange-500/20 text-orange-500'}`}>
                         {asset.urgency}
                       </span>
                       <button className="flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors">
                         DÉPLOYER ÉQUIPE <ChevronRight className="w-3 h-3" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PARTIE 3: ANALYSE ENVIRONNEMENTALE (INGÉNIEURS) */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Wind className="w-8 h-8 text-indigo-500" />
            <h2 className="text-2xl font-bold text-text-main uppercase tracking-wider">III. Intelligence Environnementale & Climat</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Radar Heatmap: Pressure Index */}
            <div className="glass rounded-3xl p-8 border border-border-main h-[500px]">
               <h3 className="text-xl font-bold text-text-main mb-2">Indice de Pression (Stress 48h)</h3>
               <p className="text-sm text-text-dim mb-8 italic">Corrélation prédictive Stress Thermique vs Stress Éolien</p>
               <ResponsiveContainer width="100%" height="80%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.pressureIndex.thermalStress.map((t, i) => ({
                    subject: `Zone ${i+1}`,
                    A: t / 40 * 100,
                    B: stats.pressureIndex.windStress[i] / 80 * 100,
                    fullMark: 100
                  }))}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 12}} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                    <Radar name="Stress Thermique" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
                    <Radar name="Stress Éolien" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                    <Legend />
                  </RadarChart>
               </ResponsiveContainer>
            </div>

            <div className="space-y-8">
               <div className="glass rounded-3xl p-8 border border-border-main flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-orange-500/20 rounded-2xl">
                       <Activity className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-text-main mb-1">Taux de Dégradation Accélérée</h3>
                       <p className="text-sm text-text-dim">Le climat fait vieillir le réseau {stats.acceleratedDegradationRate}% plus vite</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <span className="text-3xl font-black text-rose-500">+{stats.acceleratedDegradationRate}%</span>
                  </div>
               </div>

               <div className="glass rounded-3xl p-8 border border-border-main">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-bold text-text-main uppercase tracking-tighter flex items-center gap-2">
                        <Timer className="w-5 h-5 text-indigo-500" />
                        Probabilité de Rupture SLA
                     </h3>
                     <span className={`text-xl font-black ${stats.slaRuptureProbability > 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                       {stats.slaRuptureProbability.toFixed(1)}%
                     </span>
                  </div>
                  <div className="w-full bg-bg-main rounded-full h-3 overflow-hidden border border-border-main mb-4">
                     <div 
                       className={`h-full transition-all duration-1000 ${stats.slaRuptureProbability > 5 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                       style={{ width: `${stats.slaRuptureProbability}%` }}
                     ></div>
                  </div>
                  <p className="text-xs text-text-muted italic">
                    {stats.slaRuptureProbability > 5 
                      ? "ATTENTION : Alerte juridique potentielle. Délais de réparation menacés par les conditions actuelles." 
                      : "SÉCURITÉ SLA : Le réseau respecte les engagements contractuels de l'État."}
                  </p>
               </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function KPICard({ title, value, subtitle, icon, color, isProgress, progress }: any) {
  return (
    <div className="glass rounded-3xl p-6 border border-border-main hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute -right-2 -top-2 opacity-5 scale-150 rotate-12 group-hover:scale-175 transition-transform duration-500 ${color}`}>
        {icon}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${color} bg-current/10 p-3`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-text-dim mb-1 italic tracking-tight">{title}</h3>
      <p className={`text-2xl font-black ${color} mb-3`}>{value}</p>
      {isProgress && progress !== undefined && (
        <div className="w-full bg-bg-main rounded-full h-1.5 overflow-hidden mb-3 border border-border-main">
           <div className={`h-full bg-current ${color}`} style={{ width: `${progress}%` }}></div>
        </div>
      )}
      <p className="text-[11px] text-text-muted font-medium">{subtitle}</p>
    </div>
  );
}
