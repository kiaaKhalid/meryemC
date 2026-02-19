'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, ShieldAlert, Sparkles } from 'lucide-react';

const IsometricHero = () => {
    return (
        <section className="relative min-h-screen w-full bg-[#050505] text-white flex items-center justify-center overflow-hidden py-24 px-6 md:px-12 font-sans">
            
            {/* Arrière-plan avec un grand cercle lumineux asymétrique */}
            {/* Correction Tailwind : w-200, h-200 et bg-linear */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-200 h-200 bg-linear-to-br from-[#0070f3]/20 to-[#2dd4bf]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
                
                {/* --- MOITIÉ GAUCHE : Contenu Textuel --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full lg:w-5/12 flex flex-col items-start text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-[#2dd4bf]" />
                        <span className="text-xs font-semibold tracking-widest text-[#2dd4bf] uppercase">
                            Génération 4.0
                        </span>
                    </div>

                    {/* Correction Tailwind : bg-linear-to-b */}
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.1] text-transparent bg-clip-text bg-linear-to-b from-white to-gray-400">
                        Visualisez <br/>
                        l&apos;invisible.
                    </h1>

                    {/* Correction ESLint : &apos; au lieu de ' */}
                    <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-md">
                        Supervisez vos réseaux d&apos;eau et d&apos;électricité grâce à notre IA. Détectez les anomalies en 3D et prévenez les risques avant toute défaillance physique.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        {/* Correction Tailwind : bg-linear-to-r */}
                        <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-linear-to-r from-[#0070f3] to-[#005bb5] text-white font-semibold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,112,243,0.4)]">
                            <ShieldAlert className="w-5 h-5" />
                            Démarrer l&apos;analyse
                        </button>
                        <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <Play className="w-4 h-4" fill="currentColor" />
                            </div>
                            Voir le fonctionnement
                        </button>
                    </div>
                </motion.div>

                {/* --- MOITIÉ DROITE : Vidéo Isométrique 3D --- */}
                <div className="w-full lg:w-7/12 flex justify-center lg:justify-end perspective-[2000px]">
                    
                    {/* Correction Tailwind : max-w-150 */}
                    <motion.div 
                        initial={{ opacity: 0, rotateY: -40, rotateX: 30, scale: 0.8 }}
                        animate={{ opacity: 1, rotateY: -20, rotateX: 15, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-150 transform-style-3d group"
                    >
                        {/* Calque fantôme 1 (Ombre portée en 3D) */}
                        <div className="absolute inset-0 bg-[#0070f3]/20 rounded-2xl blur-2xl transform translate-y-12 translate-x-8 -z-20 pointer-events-none"></div>

                        {/* Calque fantôme 2 (Plaque de verre en dessous) */}
                        <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md transform translate-y-6 translate-x-4 -z-10 transition-transform duration-500 group-hover:translate-y-8 group-hover:translate-x-6"></div>

                        {/* Conteneur principal de la vidéo */}
                        <div className="relative rounded-2xl border border-white/20 bg-gray-900 overflow-hidden shadow-2xl z-10">
                            
                            {/* Barre supérieure style application */}
                            <div className="absolute top-0 w-full h-8 bg-black/60 backdrop-blur-md z-20 flex items-center px-4 gap-2 border-b border-white/10">
                                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                <div className="text-[10px] text-gray-400 font-mono ml-2 uppercase tracking-widest">
                                    Kinova Vision Engine
                                </div>
                            </div>

                            {/* Vidéo */}
                            {/* Correction Tailwind : aspect-4/3 */}
                            <video 
                                autoPlay 
                                loop 
                                muted 
                                playsInline 
                                className="w-full h-full object-cover aspect-4/3 mt-8 opacity-90"
                            >
                                <source src="/hero.mp4" type="video/mp4" />
                            </video>

                            {/* Reflet lumineux animé sur la vidéo */}
                            {/* Correction Tailwind : bg-linear-to-tr */}
                            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent z-30 pointer-events-none"></div>
                        </div>

                        {/* Étiquette flottante attachée à la vidéo en 3D */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="absolute -bottom-6 -left-10 bg-[#0a0a0a] border border-[#0070f3]/50 p-4 rounded-xl shadow-xl flex items-center gap-4 z-40 transform translate-z-50"
                        >
                            <div className="w-3 h-3 rounded-full bg-[#0070f3] animate-pulse"></div>
                            <div>
                                <p className="text-white text-sm font-bold">Liaison Sécurisée</p>
                                <p className="text-gray-400 text-xs">Latence: 12ms</p>
                            </div>
                        </motion.div>

                    </motion.div>

                </div>

            </div>
        </section>
    );
};

export default IsometricHero;