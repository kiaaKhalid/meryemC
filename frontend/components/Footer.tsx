'use client';

import React from 'react';
import Link from 'next/link';
import { Hexagon, Mail, Linkedin, ArrowRight, X } from 'lucide-react'; // X remplace Twitter

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8 font-sans">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                
                {/* --- GRILLE PRINCIPALE --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* Colonne 1 : Marque et Description */}
                    <div className="flex flex-col items-start">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#0070f3] to-[#2dd4bf] flex items-center justify-center shadow-[0_0_15px_rgba(0,112,243,0.3)]">
                                <Hexagon className="w-5 h-5 text-white" fill="currentColor" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Meryem C.
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            L&apos;intelligence artificielle au service de vos infrastructures critiques. Anticipez les risques hydriques et électriques avant qu&apos;ils ne surviennent.
                        </p>
                        <div className="flex gap-4">
                            {/* Utilisation de l'icône X au lieu de TwitterIcon dépréciée */}
                            <Link href="/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Lien vers X (Twitter)">
                                <X className="w-4 h-4" />
                            </Link>
                            {/* Utilisation du nom direct Linkedin non déprécié */}
                            <Link href="/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0077b5] transition-colors" aria-label="Lien vers Linkedin">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Colonne 2 : Liens Rapides */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Plateforme</h3>
                        <ul className="flex flex-col gap-4 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-[#2dd4bf] transition-colors">Dashboard IA</Link></li>
                            <li><Link href="/" className="hover:text-[#2dd4bf] transition-colors">Surveillance Météo</Link></li>
                            <li><Link href="/" className="hover:text-[#2dd4bf] transition-colors">Alertes en temps réel</Link></li>
                            <li><Link href="/" className="hover:text-[#2dd4bf] transition-colors">Intégration API</Link></li>
                        </ul>
                    </div>

                    {/* Colonne 3 : Entreprise */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Entreprise</h3>
                        <ul className="flex flex-col gap-4 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition-colors">À propos</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Cas d&apos;usage</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Carrières</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Colonne 4 : Newsletter / Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Restez informé</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Recevez nos dernières avancées sur l&apos;IA appliquée à la gestion des risques.
                        </p>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                    type="email" 
                                    placeholder="Adresse e-mail" 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#0070f3] transition-colors"
                                    aria-label="Votre adresse e-mail"
                                />
                            </div>
                            <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#0070f3] text-white text-sm font-medium hover:bg-[#005bb5] transition-colors">
                                S&apos;inscrire <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                </div>

                {/* --- LIGNE INFÉRIEURE : Légal --- */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        © {currentYear} Kinova Intelligence. Tous droits réservés.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-500">
                        <Link href="/" className="hover:text-white transition-colors">Mentions légales</Link>
                        <Link href="/" className="hover:text-white transition-colors">Politique de confidentialité</Link>
                        <Link href="/" className="hover:text-white transition-colors">CGU</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;