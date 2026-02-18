"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, Zap, Leaf, ArrowRight, 
  BarChart3, Users, X, CheckCircle2 
} from 'lucide-react'; // ShieldCheck supprimé (inutilisé)
import { useRouter } from "next/navigation"; // Remplacement de react-router-dom

// --- 1. COMPOSANT MODALE ---
const WaterModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-2000 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
        >
          <div className="p-10">
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-600">
                <Droplets size={32} />
              </div>
              <button 
                onClick={onClose} 
                aria-label="Fermer"
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors text-slate-400 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white mb-4 uppercase italic">
              Objectif <span className="text-blue-600">-25%</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Optimisez votre consommation quotidienne grâce à nos solutions technologiques :
            </p>

            <div className="space-y-4">
              {[
                { id: "reg", t: "Régulateurs de jet", d: "Réduisez le débit de vos robinets de 12L/min à 6L/min." },
                { id: "eco", t: "Douchettes Éco-Air", d: "Sensation identique avec 50% de volume en moins." },
                { id: "mon", t: "Monitoring Pulse", d: "Notification immédiate en cas de micro-fuite détectée." }
              ].map((item) => (
                <div key={item.id} className="flex gap-4 p-5 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10">
                  <CheckCircle2 className="text-blue-500 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.t}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={onClose}
              className="w-full mt-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[15px] tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 cursor-pointer"
            >
              Appliquer ces conseils
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- 2. COMPOSANT D'EN-TÊTE ---
const SectionHeader = ({ title, subtitle, badge }: { title: string, subtitle: string, badge: string }) => (
  <div className="mb-12">
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4 block">
      {badge}
    </span>
    <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">
      {title}
    </h2>
    <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl leading-relaxed">{subtitle}</p>
  </div>
);

// --- 3. PAGE PRINCIPALE ---
export default function EcoPrevention() {
  const [mounted, setMounted] = useState(false);
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Utilisation d'un timeout de 0 pour éviter le setState synchrone
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-[#020617] transition-colors duration-500 min-h-screen pb-20">
      
      <WaterModal 
        isOpen={isWaterModalOpen} 
        onClose={() => setIsWaterModalOpen(false)} 
      />

      {/* SECTION 1: HERO */}
      <section className="pt-24 pb-16 border-b border-slate-100 dark:border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] mb-8 dark:text-white uppercase">
              L&apos;IMPACT <span className="text-emerald-500">CITOYEN.</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed italic">
              L&apos;IA MonitorAI prévoit les crises, mais votre réactivité les neutralise.
            </p>
          </motion.div>

          <div className="relative p-1 bg-linear-to-br from-emerald-500 to-blue-600 rounded-[3.5rem] shadow-2xl">
            <div className="bg-slate-900 rounded-[3.3rem] p-10 text-white">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-white/10 rounded-2xl text-emerald-400">
                  <BarChart3 size={24} />
                </div>
                <span className="px-4 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Live Status
                </span>
              </div>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest">Stress Hydrique Régional</p>
              <div className="text-7xl font-black my-2 tracking-tighter">68%</div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden mt-4">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: "68%" }}
                  className="h-full bg-emerald-500 shadow-[0_0_20px_#10b981]" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: GUIDE BENTO */}
      <section className="py-24 bg-slate-50/5 dark:bg-white/2">
        <div className="container mx-auto px-6">
          <SectionHeader 
            badge="Sensibilisation" 
            title="Le Guide des Éco-Gestes" 
            subtitle="Des solutions concrètes pour transformer votre domicile." 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }} 
              className="md:col-span-2 p-10 rounded-[3rem] bg-blue-600 text-white flex flex-col justify-between h-100 shadow-xl shadow-blue-500/20 relative overflow-hidden group"
            >
              <div className="relative z-10">
                <Droplets size={48} className="mb-8 opacity-80" />
                <h3 className="text-4xl font-bold italic uppercase tracking-tighter leading-none">Optimisation <br /> de l&apos;or bleu</h3>
                <p className="text-blue-100 mt-4 max-w-sm leading-relaxed font-medium">Réduisez la consommation de 25% sans effort.</p>
              </div>
              <div className="relative z-10 flex justify-end">
                <button 
                  onClick={() => setIsWaterModalOpen(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all cursor-pointer shadow-lg"
                >
                  Voir les détails <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-10 rounded-[3rem] bg-amber-500 text-white flex flex-col justify-between shadow-xl">
              <Zap size={40} className="opacity-80" />
              <h3 className="text-2xl font-black uppercase tracking-tighter">Pics <br /> Électriques</h3>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-10 rounded-[3rem] bg-emerald-500 text-white flex flex-col justify-between shadow-xl">
              <Leaf size={40} className="opacity-80" />
              <h3 className="text-2xl font-black uppercase tracking-tighter">Végétalisation <br /> Urbaine</h3>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-indigo-600 rounded-[4rem] p-12 md:p-20 text-white text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <Users className="mx-auto mb-8 opacity-50" size={56} />
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-none">
                Rejoignez la <span className="text-indigo-300 italic">Vigilance.</span>
              </h2>
              <button 
                onClick={() => router.push("/login")}
                className="px-12 py-5 bg-white text-indigo-600 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-slate-100 transition-all shadow-2xl cursor-pointer"
              >
                S&apos;inscrire aux alertes
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}