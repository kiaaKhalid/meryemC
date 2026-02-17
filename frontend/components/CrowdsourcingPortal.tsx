"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  MapPin, 
  Send, 
  AlertTriangle, 
  BrainCircuit, 
  Zap, 
  Droplets,
  Users
} from 'lucide-react';

// --- TYPES ---
interface ReportType {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const reportCategories: ReportType[] = [
  { id: 'eau', label: 'Fuite d\'eau', icon: <Droplets size={20} />, color: 'text-blue-500' },
  { id: 'elec', label: 'Poteau Électrique', icon: <Zap size={20} />, color: 'text-amber-500' },
  { id: 'obs', label: 'Obstacle / Danger', icon: <AlertTriangle size={20} />, color: 'text-red-500' },
];

export default function CrowdsourcingPortal() {
  const [mounted, setMounted] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <section className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 transition-colors duration-500">
      <div className="container mx-auto px-6">
        
        {/* HEADER EFFICACE */}
        <div className="max-w-4xl mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-6"
          >
            <Users size={14} className="mr-2" /> Portail Citoyen Actif
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-6">
            Signalez. <span className="text-indigo-600 italic">L&apos;IA valide.</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Votre signalement est la pièce manquante. Nos algorithmes comparent vos données avec nos prédictions pour une intervention ultra-rapide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* COLONNE GAUCHE : LE FORMULAIRE (7/12) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl shadow-slate-200 dark:shadow-none p-8 md:p-12 border border-slate-100 dark:border-white/5"
          >
            <div className="space-y-10">
              {/* 1. TYPE DE PROBLÈME */}
              <div>
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 block">1. Nature de l&apos;incident</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reportCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedType(cat.id)}
                      className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                        selectedType === cat.id 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600' 
                        : 'border-slate-100 dark:border-white/5 hover:border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className={`${selectedType === cat.id ? 'scale-110' : ''} transition-transform`}>
                        {cat.icon}
                      </div>
                      <span className="font-bold text-sm leading-none">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. LOCALISATION ET PHOTO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 block">2. Localisation</label>
                  <button 
                    onClick={() => setIsLocating(true)}
                    className="w-full p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center gap-3 text-slate-500 hover:text-indigo-600 hover:border-indigo-600 transition-all cursor-pointer"
                  >
                    {isLocating ? <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /> : <MapPin size={20} />}
                    <span className="font-bold text-sm italic">{isLocating ? "Géolocalisation..." : "Utiliser ma position"}</span>
                  </button>
                </div>
                <div>
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 block">3. Preuve visuelle</label>
                  <div className="relative group cursor-pointer">
                    <input type="file" className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                    <div className="w-full p-5 rounded-3xl bg-indigo-600 text-white flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-700 transition-all">
                      <Camera size={20} />
                      <span className="font-bold text-sm uppercase tracking-widest">Prendre Photo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. BOUTON ENVOI */}
              <button className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl cursor-pointer">
                Transmettre au Réseau <Send size={18} />
              </button>
            </div>
          </motion.div>

          {/* COLONNE DROITE : L'IA EN ACTION (5/12) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Widget IA de validation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <BrainCircuit className="mb-6 opacity-50" size={48} />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">Validation Neuronale</h3>
                <p className="text-indigo-100 text-sm leading-relaxed mb-8">
                  Dès l&apos;envoi, notre modèle <span className="font-bold">DeepCheck™</span> compare votre signalement avec les données satellites et les capteurs IoT pour confirmer l&apos;anomalie.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Confiance IA</span>
                    <span className="font-mono text-xl font-black">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 text-emerald-300">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Statut de Prédiction</span>
                    <span className="text-[10px] font-black uppercase">Prédit il y a 4h</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </motion.div>

            {/* Historique rapide ou Impact */}
            <div className="p-8 rounded-[3rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Derniers signalements validés</h4>
              <div className="space-y-6">
                {[
                  { loc: "Maarif, Rue 74", status: "Équipe en route", color: "bg-emerald-500" },
                  { loc: "Anfa, Boulevard 2", status: "En cours d'analyse", color: "bg-blue-500" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`} />
                      <span className="text-sm font-bold dark:text-white">{item.loc}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase opacity-40">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
      `}</style>
    </section>
  );
}