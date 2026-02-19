"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Importation du composant optimisé

export default function ForgotPasswordSection() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] flex items-center justify-center p-4 overflow-hidden relative font-sans">
      
      {/* --- EFFETS D'ARRIÈRE-PLAN --- */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-blue-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />

      {/* --- CARTE PRINCIPALE --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-6xl min-h-175 flex flex-col lg:flex-row overflow-hidden relative z-10 border border-white/50"
      >
        
        {/* BOUTON RETOUR */}
        <button 
          onClick={() => router.push('/login')}
          className="absolute top-8 left-8 z-20 p-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all border border-gray-100 group"
          aria-label="Retour à la connexion"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* CÔTÉ GAUCHE : FORMULAIRE DE RÉCUPÉRATION */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck className="text-blue-600" size={32} />
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Mot de passe oublié ?</h1>
            <p className="text-gray-400 text-sm mb-10 leading-relaxed">
              Pas d&apos;inquiétude. Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre accès.
            </p>

            <form className="space-y-8">
              <div className="relative">
                {/* Accessibilité : htmlFor lié à l'id de l'input */}
                <label htmlFor="email-field" className="block text-xs font-black text-gray-700 mb-2 uppercase tracking-widest cursor-pointer">
                    Votre Email
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
                    <Mail size={18} />
                  </span>
                  <input 
                    id="email-field"
                    type="email" 
                    placeholder="exemple@domaine.com" 
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all bg-gray-50/50 text-gray-900 outline-none font-medium"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm shadow-xl shadow-black/10 hover:bg-gray-800 transition-all active:scale-95">
                Envoyer le lien de récupération
              </button>
            </form>

            <button 
              onClick={() => router.push('/login')}
              className="w-full text-center mt-10 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
            >
              Retourner à la connexion
            </button>
          </div>
        </div>

        {/* CÔTÉ DROIT : VISUEL */}
        <div className="flex-1 bg-[#F9FAFB] relative hidden lg:flex items-center justify-center border-l border-gray-50 overflow-hidden">
          <div className="absolute inset-0">
             <div className="absolute top-[20%] right-[-10%] w-100 h-100 bg-blue-500/5 rounded-full blur-[100px]" />
             <div className="absolute bottom-[20%] left-[-10%] w-75 h-75 bg-cyan-500/5 rounded-full blur-[100px]" />
          </div>

          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-full max-w-lg p-10"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white shadow-blue-500/10 grayscale-[0.2] aspect-square">
              {/* Utilisation de Next/Image pour l'optimisation */}
              <Image 
                src="/login.png" 
                alt="Sécurité AquaVolt" 
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}