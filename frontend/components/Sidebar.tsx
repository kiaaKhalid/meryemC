"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, MessageSquare, 
  Settings, LogOut,
  ChevronDown, ChevronUp, ChevronRight,
  ShieldCheck, Cpu, History, Users,
  FileText, Headphones, Sun, Moon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
  icon: any;
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
  badge?: number;
  adminOnly?: boolean;
}

// --- CONFIGURATION DES ÉLÉMENTS DU MENU ---
const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: ShieldCheck, label: "Maintenance", href: "/admin/maintenance" },
  { icon: Cpu, label: "Équipements", href: "/admin/equipments" },
  { icon: History, label: "Incidents", href: "/admin/incidents" },
  { icon: Users, label: "Personnel", href: "/admin/users", adminOnly: true },
];

const bottomItems = [
  { icon: FileText, label: "Documentation", href: "/docs" },
  { icon: Headphones, label: "Support", href: "/support" },
  { icon: Settings, label: "Settings", href: "#" }, 
];

interface SidebarProps {
  onSettingsClick: () => void;
}

export default function Sidebar({ onSettingsClick }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isReportingOpen, setIsReportingOpen] = useState(true);
  const pathname = usePathname(); 
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  
  // ÉTAT POUR LA MODALE DE DÉCONNEXION
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div 
      animate={{ width: isOpen ? 300 : 80 }}
      className="h-screen bg-bg-sidebar text-text-dim flex flex-col p-4 transition-all duration-300 relative border-r border-border-main shadow-2xl z-[100]"
    >
      {/* HEADER : LOGO & TITRE */}
      <div className="flex items-center justify-between mb-8 px-2">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#0070f3] to-[#2dd4bf] flex items-center justify-center shadow-[0_0_15px_rgba(0,112,243,0.5)] group-hover:shadow-[0_0_25px_rgba(0,112,243,0.8)] transition-all">
            <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
          </div>
          {isOpen && (
            <span className="font-black text-text-main text-lg tracking-tighter italic uppercase">
              Meryem <span className="text-indigo-500">C.</span>
            </span>
          )}
        </Link>
        
        {/* BOUTON TOGGLE */}
        {isOpen ? (
          <ChevronDown size={18} className="cursor-pointer hover:text-text-main transition-colors" onClick={() => setIsOpen(false)} />
        ) : (
          <div 
            className="absolute -right-3 top-10 w-6 h-6 bg-bg-sidebar border border-border-main rounded-full flex items-center justify-center cursor-pointer text-text-main shadow-lg hover:scale-110 transition-transform"
            onClick={() => setIsOpen(true)}
          >
            <ChevronRight size={14} />
          </div>
        )}
      </div>

      <div className="h-px bg-border-subtle mb-8" />

      {/* NAVIGATION PRINCIPALE */}
      <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems
          .filter(item => !item.adminOnly || isAdmin)
          .map((item, i) => {
            const isActive = pathname === item.href;
            
            return (
              <div key={i}>
                <Link href={item.href}>
                  <div className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group
                    ${isActive ? 'bg-bg-hover text-text-main' : 'hover:bg-bg-hover hover:text-text-main'}`}>
                    <div className="flex items-center gap-4">
                      <item.icon size={20} className={isActive ? 'text-text-main' : 'group-hover:text-text-main'} />
                      {isOpen && <span className="text-sm font-semibold tracking-wide">{item.label}</span>}
                    </div>
                    
                    {isOpen && (
                      <div className="flex items-center gap-2">
                        {item.subItems && (
                          <div onClick={(e) => { e.preventDefault(); setIsReportingOpen(!isReportingOpen); }}>
                            {isReportingOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>
                        )}
                        {item.badge && item.badge > 0 && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-black shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>

                {/* SOUS-MENU */}
                {isOpen && item.subItems && isReportingOpen && (
                  <div className="ml-6 mt-2 space-y-1 border-l border-border-main">
                    {item.subItems.map((sub, j) => (
                      <Link key={j} href={sub.href}>
                        <div className={`pl-6 py-2 text-xs font-medium hover:text-text-main cursor-pointer relative transition-colors ${pathname === sub.href ? 'text-text-main' : ''}`}>
                          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-3 h-px ${pathname === sub.href ? 'bg-indigo-500 w-4' : 'bg-border-main'}`} />
                          {sub.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </nav>

      {/* FOOTER ITEMS */}
      <div className="mt-auto pt-6 space-y-1">
        {bottomItems.map((item, i) => {
          if (item.label === "Settings") {
            return (
              <div 
                key={i} 
                onClick={onSettingsClick} 
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-bg-hover hover:text-text-main cursor-pointer transition-all"
              >
                <item.icon size={20} />
                {isOpen && <span className="text-sm font-semibold">{item.label}</span>}
              </div>
            );
          }

          return (
            <div key={i}>
              <Link href={item.href}>
                <div className={`flex items-center gap-4 p-3 rounded-xl hover:bg-bg-hover hover:text-text-main cursor-pointer transition-all ${pathname === item.href ? 'text-text-main bg-bg-hover' : ''}`}>
                  <item.icon size={20} />
                  {isOpen && <span className="text-sm font-semibold">{item.label}</span>}
                </div>
              </Link>
            </div>
          );
        })}

        {/* THEME TOGGLE */}
        <div 
          onClick={toggleTheme}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-bg-hover hover:text-text-main cursor-pointer transition-all border border-transparent hover:border-border-main"
        >
          {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
          {isOpen && <span className="text-sm font-semibold">{theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}</span>}
        </div>

        <div className="h-px bg-border-subtle my-4" />

        {/* PROFIL UTILISATEUR */}
        <div className="flex items-center justify-between px-1 group">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image 
                src={user?.profileImage || "/avatars/default-avatar.png"} 
                width={40} 
                height={40} 
                className="w-10 h-10 rounded-full border-2 border-border-main group-hover:border-indigo-500 transition-all object-cover" 
                alt="Profile" 
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-[var(--bg-sidebar)]" />
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text-main leading-none uppercase tracking-tight truncate max-w-[120px]">
                  {user?.username || "Profil"}
                </span>
                <span className="text-xs text-text-muted mt-1 uppercase font-black tracking-tighter truncate max-w-[150px]">
                  {user?.email || "chargement..."}
                </span>
              </div>
            )}
          </div>
          
          {/* BOUTON DÉCONNEXION (Déclenche la modale) */}
          {isOpen && (
            <button onClick={() => setIsLogoutModalOpen(true)} className="outline-none">
              <LogOut size={18} className="text-text-dim hover:text-red-400 cursor-pointer transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* POPUP DE CONFIRMATION DE DÉCONNEXION */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            
            {/* Arrière-plan sombre cliquable pour fermer */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsLogoutModalOpen(false)}
            />
            
            {/* Boîte de dialogue */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-bg-modal border border-border-main p-8 rounded-[2rem] shadow-2xl w-full max-w-sm text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <LogOut size={28} className="text-red-500" />
              </div>
              
              <h3 className="text-text-main font-black text-xl mb-2 uppercase italic tracking-tighter">Déconnexion</h3>
              <p className="text-text-dim text-sm mb-8">Êtes-vous sûr de vouloir quitter votre session MonitorAI ?</p>
              
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setIsLogoutModalOpen(false)} 
                  className="flex-1 px-4 py-3 bg-bg-hover hover:bg-border-subtle text-text-main rounded-xl text-sm font-bold transition-all cursor-pointer outline-none"
                >
                  Annuler
                </button>
                
                {/* Le vrai lien de déconnexion */}
                <button 
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 bg-red-500/10 hover:bg-red-600 hover:text-white text-red-500 border border-red-500/20 rounded-xl text-sm font-bold transition-all cursor-pointer outline-none"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}