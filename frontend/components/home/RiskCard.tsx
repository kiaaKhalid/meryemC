"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Lock, ArrowUpRight } from 'lucide-react';

export default function BentoRiskSection() {
  return (
    <section className="bg-white py-24 dark:bg-[#050505] text-slate-900 dark:text-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* En-tête minimaliste */}
        <div className="mb-12 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-light tracking-tight opacity-70">Analyse de sécurité</h2>
            <p className="text-4xl font-bold italic tracking-tighter uppercase">Live Pulse</p>
          </div>
          <div className="hidden md:block h-px flex-1 bg-slate-200 dark:bg-white/10 mx-10" />
          <div className="flex items-center gap-2 font-mono text-sm bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full">
            {/* Correction SonarLint S6772 : Espacement explicite après le span */}
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            {" "}
            SYSTEM_ACTIVE: 100%
          </div>
        </div>

        {/* Grille Bento */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-full">
          
          {/* Carte Principale (Large) */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-indigo-600 p-10 text-white shadow-2xl shadow-indigo-500/20"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <ShieldCheck size={48} className="mb-6 opacity-80" />
                <h3 className="text-4xl font-bold leading-tight">Indice de Risque Global</h3>
                {/* Correction Tailwind (max-w-62.5) et Apostrophe (react/no-unescaped-entities) */}
                <p className="mt-4 text-indigo-100 max-w-62.5 leading-relaxed">
                  Protection multicouche active sur l&apos;ensemble du périmètre réseau.
                </p>
              </div>
              <div className="mt-12 flex items-end justify-between">
                <span className="text-8xl font-black tracking-tighter leading-none">1.2</span>
                <div className="text-right">
                  <p className="text-sm font-bold uppercase tracking-widest opacity-60 leading-tight">Score de menace</p>
                  <p className="text-2xl font-mono">EXTRÊMEMENT FAIBLE</p>
                </div>
              </div>
            </div>
            {/* Décoration d'arrière-plan animée */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
          </motion.div>

          {/* Carte 2: Monde */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="md:col-span-2 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-white dark:bg-white/10 rounded-2xl">
                <Globe size={24} className="text-indigo-500" />
              </div>
              <ArrowUpRight size={20} className="opacity-30" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium leading-none">Origine du trafic</p>
                <h4 className="text-2xl font-bold uppercase mt-1">Global Node Map</h4>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#050505] bg-slate-300 dark:bg-slate-700 transition-transform hover:scale-110" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Carte 3: Lock */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 p-8 text-emerald-600 dark:text-emerald-400"
          >
            <Lock size={28} className="mb-4" />
            <p className="text-xs font-bold uppercase tracking-wider">SSL Status</p>
            <h4 className="text-2xl font-bold mt-1 tracking-tight">Sécurisé</h4>
          </motion.div>

          {/* Carte 4: Performance */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="rounded-[2.5rem] bg-slate-900 p-8 text-white flex flex-col justify-between"
          >
            <Zap size={28} className="text-yellow-400" />
            <div>
              <p className="text-4xl font-bold tracking-tighter">99.9%</p>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold leading-none">Uptime garanti</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}