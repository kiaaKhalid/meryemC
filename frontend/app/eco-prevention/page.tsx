"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EcoPrevention from '@/components/ecoPrevetion';

export default function EcoPreventionPage() {

  return (
    <main className="flex flex-col min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="flex-grow">
        <EcoPrevention />
      </div>

      <Footer />
    </main>
  );
}