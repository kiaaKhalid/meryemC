"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, TrendingUp, AlertOctagon, BrainCircuit } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Collecte Historique",
    desc: "Extraction des données massives des capteurs et logs passés.",
    icon: Database,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "02",
    title: "Analyse Neuronale",
    desc: "Le ML identifie les corrélations invisibles à l'œil humain.",
    icon: BrainCircuit,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "03",
    title: "Modélisation",
    desc: "Création d'un jumeau numérique prédictif de votre système.",
    icon: Cpu,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
];

export default function AIAnalysisSection() {
  return (
    <section className="relative py-24 bg-[#030712] text-white overflow-hidden">
      {/* Grille de fond subtile - Syntaxe canonique mise à jour */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container relative mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-indigo-500 mb-4">Moteur Prédictif</h2>
          <p className="text-4xl md:text-6xl font-bold tracking-tighter">
            L&apos;IA qui anticipe <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">l&apos;invisible.</span>
          </p>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          
          {/* Ligne de connexion animée (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent -translate-y-1/2 -z-10">
            <motion.div 
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 w-24 h-full bg-linear-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_rgba(129,140,248,0.8)]"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative group p-8 rounded-4xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
            >
              <div className="absolute -top-6 left-8 text-6xl font-black text-white/5 group-hover:text-indigo-500/10 transition-colors">
                {step.id}
              </div>
              
              <div className={`inline-flex p-4 rounded-2xl ${step.bg} ${step.color} mb-6`}>
                <step.icon size={32} />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed italic">
                &quot;{step.desc}&quot;
              </p>
            </motion.div>
          ))}
        </div>

        {/* Section Résultat : La Prédiction */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-20 p-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[3rem]"
        >
          <div className="bg-[#030712] rounded-[2.9rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-500 font-mono text-sm font-bold tracking-widest">ALERT_PREDICTION</span>
              </div>
              <h4 className="text-3xl font-bold mb-4">Détection de fuite imminente</h4>
              <p className="text-slate-400">
                Grâce à l&apos;analyse des micro-variations de pression, l&apos;algorithme a identifié une anomalie avec <strong>98.4% de certitude</strong>, 48 heures avant la rupture physique.
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col items-center p-6 bg-white/5 rounded-3xl border border-white/10">
                <TrendingUp className="text-emerald-400 mb-2" size={30} />
                <span className="text-xs opacity-50 uppercase">Gain de temps</span>
                <span className="text-2xl font-bold">48h</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white/5 rounded-3xl border border-white/10">
                <AlertOctagon className="text-red-400 mb-2" size={30} />
                <span className="text-xs opacity-50 uppercase">Risque évité</span>
                <span className="text-2xl font-bold">Critique</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}