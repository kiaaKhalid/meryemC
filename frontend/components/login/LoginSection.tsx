"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, Eye, ArrowLeft, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { login as loginService } from '../../services/maintenanceService';

const loginImages = [
  '/login.png',
  '/login2.png',
  '/login3.png'
];

export default function LoginSection() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<'login' | 'forgot'>('login'); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
        const user = await loginService({ email, password });
        if (user) {
            login(user);
        } else {
            setError('Identifiants incorrects');
        }
    } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % loginImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 overflow-hidden relative font-sans">
      
      {/* --- EFFETS DE LUMIÈRE IA --- */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-950/40 backdrop-blur-2xl rounded-[40px] shadow-2xl w-full max-w-6xl min-h-175 flex flex-col lg:flex-row overflow-hidden relative z-10 border border-white/10"
      >
        
        {/* --- BOUTON RETOUR --- */}
        <button 
          onClick={() => router.push("/")}
          aria-label="Retourner à l&apos;accueil"
          className="absolute top-8 left-8 z-20 p-3 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all border border-white/10 outline-none"
        >
          <ArrowLeft size={20} />
        </button>

        {/* CÔTÉ GAUCHE : FORMULAIRES */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              {view === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="flex items-center gap-2 mb-4 text-blue-500">
                    <Cpu size={24} />
                    <span className="text-xs font-bold uppercase tracking-widest">Neural Access</span>
                  </div>
                  <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Connect AI</h1>
                  <p className="text-gray-500 text-sm mb-10">Authentifiez-vous pour accéder au réseau.</p>

                  <form className="space-y-6" onSubmit={handleLoginSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl mb-4 italic">
                            {error}
                        </div>
                    )}
                    <div>
                      <label htmlFor="email" className="block text-[10px] font-black text-blue-400/70 mb-2 uppercase tracking-[0.2em]">
                        Email Terminal
                      </label>
                      <input 
                        id="email"
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="khalid@meryem.ma" 
                        className="w-full px-5 py-4 rounded-2xl border border-white/5 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all bg-white/5 text-white outline-none placeholder:text-gray-700 font-medium"
                      />
                    </div>

                    <div className="relative">
                      <label htmlFor="password" className="block text-[10px] font-black text-blue-400/70 mb-2 uppercase tracking-[0.2em]">
                        Clé de Chiffrement
                      </label>
                      <input 
                        id="password"
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••" 
                        className="w-full px-5 py-4 rounded-2xl border border-white/5 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all bg-white/5 text-white outline-none placeholder:text-gray-700 font-medium"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 bottom-4 text-gray-600 hover:text-blue-500 transition-colors"
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold">
                      {/* Correction S6772 : Structure du label et de l'input nettoyée */}
                      <div className="flex items-center gap-2">
                        <input 
                            id="remember"
                            type="checkbox" 
                            className="rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                        />
                        <label htmlFor="remember" className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                            Maintenir la session
                        </label>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => setView('forgot')}
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>

                    <button type="submit" disabled={loading} className={`w-full py-4 text-white rounded-2xl font-black text-sm shadow-xl transition-all ${loading ? 'bg-blue-800 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 active:scale-95'}`}>
                      {loading ? 'Connexion en cours...' : 'Initialiser la Connexion'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Récupération</h1>
                  <p className="text-gray-500 text-sm mb-10">Entrez votre email pour réinitialiser la clé.</p>
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="reset-email" className="block text-[10px] font-black text-blue-400/70 mb-2 uppercase tracking-[0.2em]">
                        Email de secours
                      </label>
                      <input 
                        id="reset-email"
                        type="email" 
                        placeholder="votre@email.com" 
                        className="w-full px-5 py-4 rounded-2xl border border-white/5 focus:border-blue-500 transition-all bg-white/5 text-white outline-none font-medium"
                      />
                    </div>
                    <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl transition-all hover:bg-blue-500">
                      Envoyer le lien
                    </button>
                    <button type="button" onClick={() => setView('login')} className="w-full text-center text-xs font-bold text-gray-500 hover:text-white mt-4">
                      Retour
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CÔTÉ DROIT : CARROUSEL */}
        <div className="flex-1 bg-black/20 relative flex items-center justify-center border-l border-white/5 overflow-hidden group">
            <AnimatePresence mode="wait">
                <motion.div
                  key={loginImages[currentImageIndex]} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0"
                >
                    <Image 
                        src={loginImages[currentImageIndex]} 
                        alt="AI visualization" 
                        fill
                        priority
                        className="object-cover brightness-75 grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-linear-to-t from-[#030712] via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-10 flex gap-2 z-10">
                {loginImages.map((img) => (
                    <div 
                      key={img} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${img === loginImages[currentImageIndex] ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}
                    />
                ))}
            </div>
        </div>
      </motion.div>
    </div>
  );
}