"use client";

import React, { useState } from 'react';
import Sidebar from "@/components/Sidebar";
import SettingsModal from '@/components/SettingsModal';

export default function SettingLayout({ children }: { children: React.ReactNode }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-main">
      {/* On passe la fonction d'ouverture à la Sidebar */}
      <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />

      <main className="flex-1 h-screen overflow-y-auto">
        {children}
      </main>

      {/* Le Modal est placé ici, au niveau global du layout */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}