"use client";

import React, { useState } from 'react';
import Sidebar from "@/components/Sidebar";
import SettingsModal from '@/components/SettingsModal';
import DashboardContent from "@/components/DashboardContent"; // <-- Importez bien votre Dashboard

export default function DashboardPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-main">
      
      {/* 1. La Sidebar reçoit la fonction pour ouvrir le modal */}
      <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />

      {/* 2. La zone de contenu principal */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* C'EST ICI LA CORRECTION : On affiche directement le composant */}
        <DashboardContent />
      </main>

      {/* 3. Le Modal des paramètres */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      
    </div>
  );
}