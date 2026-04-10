'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SettingsModal from '@/components/SettingsModal';
import MaintenanceHeader from '@/components/maintenance/MaintenanceHeader';
import ConfigPanel from '@/components/maintenance/ConfigPanel';
import WeeklyForecast from '@/components/maintenance/WeeklyForecast';
import { 
  getMaintenanceData, 
  getAllEquipments, 
  getFleetDayDetails,
  MaintenanceStatus, 
  Equipment,
  FleetDayRisk
} from '@/services/maintenanceService';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Navigation2, Info, MoreHorizontal, Orbit } from 'lucide-react';
import DailyRiskModal from '@/components/maintenance/DailyRiskModal';
import EquipmentDiagnosticModal from '@/components/maintenance/EquipmentDiagnosticModal';

// Dynamic Import for the Map to handle Leaflet SSR issues
const EquipmentMap = dynamic(() => import('@/components/Map/EquipmentMap'), { ssr: false });

// Default empty state for immediate UI rendering without loading barrier
const DEFAULT_STATUS: MaintenanceStatus = {
  currentRisk: 'LOW',
  currentRiskScore: 0,
  recommendation: 'Initialisation des senseurs...',
  lastNotification: '--:--',
  threshold: 60,
  forecast: Array.from({ length: 7 }).map((_, i) => ({
    date: `loading-${i}`,
    dayName: i === 0 ? "Aujourd'hui" : '...',
    temp: 0,
    humidity: 0,
    pressure: 1013,
    uvIndex: 0,
    visibility: 0,
    dewPoint: 0,
    windSpeed: 0,
    wmoCode: 0,
    riskScore: 0,
    recommendation: 'Analyse...',
    urgencyLevel: 'LOW'
  })),
  isOffline: true
};

export default function AdminMaintenancePage() {
  const [data, setData] = useState<MaintenanceStatus>(DEFAULT_STATUS);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedDayData, setSelectedDayData] = useState<FleetDayRisk | null>(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isLoadingDay, setIsLoadingDay] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDayClick = async (dayIndex: number) => {
    setIsLoadingDay(true);
    const details = await getFleetDayDetails(dayIndex);
    if (details) {
      setSelectedDayData(details);
      setIsDayModalOpen(true);
    }
    setIsLoadingDay(false);
  };

  const handleEquipmentClick = (id: number) => {
    setSelectedEquipmentId(id);
    setIsDiagnosticOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel fetch for maintenance data and equipment locations
        const [maintenanceData, equipmentList] = await Promise.all([
          getMaintenanceData(),
          getAllEquipments()
        ]);
        
        setData(maintenanceData);
        setEquipments(equipmentList);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error("Global Fleet Fetch Error:", err);
        setError("Impossible de récupérer le diagnostic global de la flotte de Casablanca.");
      }
    };
    fetchData();
  }, []);

  if (isLoading && equipments.length === 0) {
    return (
      <div className="flex min-h-screen bg-bg-main items-center justify-center">
        <Orbit className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex min-h-screen bg-bg-main items-center justify-center p-8 text-center bg-rose-500/5">
        <div className="max-w-md w-full p-8 border border-rose-500/30 bg-rose-500/10 rounded-3xl">
          <h2 className="text-xl font-bold text-white uppercase italic tracking-tighter">Erreur Système</h2>
          <p className="text-rose-400 mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen bg-bg-main transition-colors duration-300">

      {/* 1. Sidebar */}
      <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />

      {/* 2. Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 md:p-12 max-w-7xl mx-auto w-full"
        >
          {/* Header Section */}
          <MaintenanceHeader
            score={data.currentRiskScore}
            isSimulation={data.isSimulation}
            isOffline={data.isOffline}
          />

          {/* Top Section: Map & Config */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              {/* Glass Map Container */}
              <div className="bg-bg-card/80 border border-border-main rounded-3xl p-6 shadow-2xl relative overflow-hidden group h-[450px] flex flex-col transition-colors duration-300">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Navigation2 size={14} className="text-blue-500/70" strokeWidth={3} />
                    <h3 className="text-xs font-black text-text-dim uppercase tracking-[0.2em] transition-colors duration-300">Géolocalisation de la Flotte</h3>
                    <div className="group/info relative ml-1">
                      <Info size={14} className="text-text-dim/60 cursor-help hover:text-blue-500 transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-bg-card text-text-dim text-xs rounded-lg opacity-0 group-hover/info:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl border border-border-main backdrop-blur-xl italic text-center">
                        Visualisation en temps réel de tous les actifs industriels sur le maillage de Casablanca.
                      </div>
                    </div>
                  </div>
                  <MoreHorizontal size={16} className="text-text-dim cursor-pointer hover:text-text-main transition-colors" />
                </div>
                
                <div className="flex-1 w-full rounded-2xl overflow-hidden border border-border-main relative bg-bg-main/20 min-h-0">
                  <EquipmentMap 
                    equipments={equipments} 
                    onEquipmentClick={handleEquipmentClick}
                  />
                  
                  {/* Map Stats Overlay */}
                  <div className="absolute bottom-4 right-4 z-[1000] p-3 bg-bg-card/90 backdrop-blur-md rounded-xl border border-border-main shadow-2xl space-y-2 transition-colors duration-300">
                    <div className="flex items-center justify-between gap-6">
                      <span className="text-xs font-black text-text-dim uppercase tracking-widest">Actifs</span>
                      <span className="text-sm font-black text-text-main italic">{equipments.length}</span>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                      <span className="text-xs font-black text-text-dim uppercase tracking-widest">IA SRM</span>
                      <span className="text-sm font-black text-emerald-500 italic">ON</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ConfigPanel
                currentRisk={data.currentRiskScore}
                initialThreshold={60}
                lastNotification={data.lastNotification}
              />
            </div>
          </div>

          {/* Weekly View Section */}
          <div className="space-y-6">
            <WeeklyForecast 
              forecast={data.forecast} 
              onDayClick={handleDayClick}
            />
          </div>
        </motion.div>
      </main>

      {/* 3. Settings Modal */}
      <SettingsModal
        key="settings-modal"
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <EquipmentDiagnosticModal
        key="diagnostic-modal"
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        id={selectedEquipmentId}
      />

      <DailyRiskModal 
        key="daily-risk-modal"
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        data={selectedDayData}
      />

      {isLoadingDay && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
           <div className="bg-[#0F172A] border border-white/10 p-6 rounded-3xl shadow-2xl flex items-center gap-4">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Analyse Predictive en cours...</span>
           </div>
        </div>
      )}
    </div>
  );
}
