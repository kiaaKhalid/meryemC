'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Navbar = () => {
    // État pour détecter le scroll
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Dashboard Expert', href: '/executive-dashboard' },
        { name: 'Éducation', href: '/eco-prevention' },
        { name: 'Crowdsourcing', href: '/crowdsourcing-portal' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-bg-main/80 backdrop-blur-lg border-b border-border-subtle py-4' 
                    : 'bg-transparent py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                
                {/* --- 1. LOGO (GAUCHE) --- */}
                <Link href="/" className="flex items-center gap-2 group">
                    {/* Correction Tailwind : bg-linear-to-br au lieu de bg-gradient-to-br */}
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#0070f3] to-[#2dd4bf] flex items-center justify-center shadow-[0_0_15px_rgba(0,112,243,0.5)] group-hover:shadow-[0_0_25px_rgba(0,112,243,0.8)] transition-all">
                        <Image src="/logo.png" alt="Logo" width={32} height={32} />
                    </div>
                    <span className="text-xl font-bold text-text-main tracking-tight">
                        Meryem C.
                    </span>
                </Link>

                {/* --- 2. LIENS (CENTRE) --- */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href}
                            className="text-sm font-medium text-text-dim hover:text-text-main transition-colors relative group"
                        >
                            {link.name}
                            {/* Correction Tailwind : h-0.5 au lieu de h-[2px] */}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2dd4bf] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                {/* --- 3. BOUTON LOGIN (DROITE) --- */}
                <div className="flex items-center gap-4">
                    <button className="md:hidden text-text-main">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    </button>

                    <Link href="/login" className="hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-bg-hover border border-border-main text-text-main text-sm font-medium transition-all hover:bg-border-subtle hover:border-border-main hover:shadow-[0_0_20px_rgba(var(--text-main),0.1)]">
                        Se connecter
                    </Link>
                </div>

            </div>
        </motion.nav>
    );
};

export default Navbar;