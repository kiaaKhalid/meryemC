"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, BarChart3, Fingerprint } from 'lucide-react';

const pillars = [
  {
    id: "precision", // Ajout d'un ID unique pour les keys
    title: "Précision Absolue",
    subtitle: "ML & Deep Learning",
    description: "Nos algorithmes analysent des millions de points de données pour éliminer les faux positifs et garantir une fiabilité de 99.8%.",
    icon: <Target className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-400",
    delay: 0.1
  },
  {
    id: "anticipation",
    title: "Anticipation Native",
    subtitle: "Alertes Précoces",
    description: "Détectez les anomalies avant qu'elles ne deviennent des pannes. Gagnez jusqu'à 48h sur les interventions critiques.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-indigo-600 to-purple-500",
    delay: 0.2
  },
  {
    id: "roi",
    title: "Optimisation ROI",
    subtitle: "Ressources & Énergie",
    description: "Réduisez vos coûts opérationnels de 25% grâce à une allocation intelligente et prédictive de vos ressources.",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "from-emerald-500 to-teal-400",
    delay: 0.3
  }
];

export default function WhyUsSection() {
  return (
    <section className="py-24 bg-white dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* En-tête de section */}
        <div className="max-w-3xl mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.4em] mb-4"
          >
            <Fingerprint size={16} /> Notre ADN Technologique
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
            Pourquoi choisir <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">MonitorAI ?</span>
          </h2>
        </div>

        {/* Grille des 3 Piliers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.id} // Correction S6479 : Utilisation de l'ID au lieu de l'index
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: pillar.delay, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="relative group p-10 rounded-[3rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 overflow-hidden"
            >
              {/* Effet de Halo au survol - Correction Tailwind (bg-linear-to-br) */}
              <div className={`absolute -right-10 -top-10 w-40 h-40 bg-linear-to-br ${pillar.color} opacity-0 group-hover:opacity-10 blur-[80px] transition-opacity duration-500`} />

              <div className={`inline-flex p-4 rounded-2xl bg-linear-to-br ${pillar.color} text-white shadow-lg mb-8`}>
                {pillar.icon}
              </div>

              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">
                  {pillar.subtitle}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 italic">
                  {pillar.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                  {pillar.description}
                </p>
              </div>

              {/* Barre de décoration - Correction Tailwind (bg-linear-to-r) */}
              <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-linear-to-r ${pillar.color} transition-all duration-700`} />
            </motion.div>
          ))}
        </div>

        {/* Chiffre clé en bas (Preuve sociale) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-8 rounded-[2.5rem] bg-indigo-600 flex flex-col md:flex-row items-center justify-between gap-8 text-white"
        >
          <div className="flex flex-col items-center md:items-start">
            <span className="text-5xl font-black">+40%</span>
            <span className="text-xs uppercase font-bold tracking-widest opacity-80 italic">
              {/* Correction react/no-unescaped-entities */}
              D&apos;efficacité opérationnelle
            </span>
          </div>
          <div className="h-px w-full md:w-px md:h-12 bg-white/20" />
          <p className="text-center md:text-left text-sm font-medium max-w-md">
            {/* Correction react/no-unescaped-entities pour les guillemets */}
            &quot;MonitorAI a transformé notre gestion des risques en une stratégie proactive, réduisant nos pertes annuelles de manière significative.&quot;
          </p>
          <button className="px-8 py-4 bg-white text-indigo-600 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-colors shadow-xl">
            Découvrir l&apos;étude
          </button>
        </motion.div>
      </div>
    </section>
  );
}