'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamic Import is CRITICAL for Leaflet in Next.js to prevent "window is not defined"
const MapCore = dynamic<Props>(() => import('./LeafletMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-slate-900/50 animate-pulse rounded-xl flex items-center justify-center border border-white/5">
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
        Loading Casablanca Fleet Map...
      </div>
    </div>
  )
});

interface Props {
  equipments: any[];
  onEquipmentClick?: (id: number) => void;
}

const EquipmentMap = ({ equipments, onEquipmentClick }: Props) => {
  return (
    <div className="w-full h-full min-h-[400px] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
      <MapCore equipments={equipments} onEquipmentClick={onEquipmentClick} />
    </div>
  );
};

export default EquipmentMap;
