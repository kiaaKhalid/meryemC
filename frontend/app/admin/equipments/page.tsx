'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SettingsModal from '@/components/SettingsModal';
import { getAllEquipments, deleteEquipment, Equipment } from '@/services/maintenanceService';
import EquipmentCard from '@/components/maintenance/EquipmentCard';
import EquipmentDiagnosticModal from '@/components/maintenance/EquipmentDiagnosticModal';
import EquipmentManageModal from '@/components/maintenance/EquipmentManageModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Server, MapPin, Search, Plus, Loader2, Orbit } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function EquipmentsPage() {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Status State
    const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
    const [manageEquipment, setManageEquipment] = useState<Equipment | null | undefined>(undefined); // null = Create, undefined = Hidden
    const { isAdmin } = useAuth();

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAllEquipments();
            setEquipments(data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (globalThis.confirm("Êtes-vous sûr de vouloir retirer cet actif du parc ? Cette action est irréversible.")) {
            setLoading(true);
            const success = await deleteEquipment(id);
            if (success) {
                await fetchData();
            } else {
                setLoading(false);
            }
        }
    };

    const handleEdit = (e: React.MouseEvent, eq: Equipment) => {
        e.stopPropagation();
        setManageEquipment(eq);
    };

    const handleModalClose = (refetch?: boolean) => {
        setManageEquipment(undefined);
        if (refetch) fetchData();
    };

    const showContent = !loading || equipments.length > 0;

    return (
        <div className="flex min-h-screen bg-bg-main">
            <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />

            <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
                {!showContent ? (
                    <div className="flex h-full items-center justify-center">
                        <Orbit className="text-blue-500 animate-spin" size={48} />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 md:p-12 max-w-7xl mx-auto w-full relative"
                    >
                        {/* Floating Add Button */}
                        {isAdmin && (
                            <button 
                                onClick={() => setManageEquipment(null)}
                                className="fixed bottom-10 right-10 z-50 w-14 h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 shadow-[0_15px_40px_-10px_rgba(79,70,229,0.5)] flex items-center justify-center text-text-main transition-all hover:scale-110 active:scale-95 group"
                            >
                                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                                <div className="absolute -top-12 right-0 bg-white dark:bg-slate-800 text-black dark:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap shadow-2xl border border-border-subtle">
                                    Ajouter un Actif
                                </div>
                            </button>
                        )}

                        {/* Page Header */}
                        <header className="mb-12">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                                    <h1 className="text-text-main font-black italic uppercase tracking-tighter text-4xl whitespace-nowrap">
                                        Parc <span className="hidden lg:inline">d'Équipements</span> <span className="text-indigo-500">Casablanca</span>
                                    </h1>
                                </div>

                                {/* Search Bar */}
                                <div className="relative group w-full md:max-w-md lg:max-w-xl">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-text-dim group-focus-within:text-indigo-400 transition-colors duration-300">
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} className="stroke-[3]" />}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Multi-recherche (ex: Anfa;Solaire)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-bg-hover border border-border-subtle text-text-main rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all duration-500 font-bold italic uppercase tracking-widest text-xs placeholder:text-text-muted backdrop-blur-xl"
                                    />
                                </div>
                            </div>
                            <div className="relative group/info">
                                <p className="text-text-dim text-sm font-bold uppercase tracking-widest max-w-2xl leading-relaxed cursor-help">
                                    Contrôle opérationnel des actifs industriels. Gestion du cycle de vie et télémétrie L3.
                                </p>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-bg-card text-text-dim text-xs rounded-lg opacity-0 group-hover/info:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl border border-border-main backdrop-blur-xl italic text-center">
                                    Visualisation en temps réel de tous les actifs industriels sur le maillage de Casablanca.
                                </div>
                            </div>
                        </header>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-bg-hover border border-border-subtle p-6 rounded-[2rem] flex items-center gap-4">
                                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                    <Cpu className="text-indigo-400" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-text-main font-black italic uppercase tracking-tighter text-2xl">{equipments.length}</h4>
                                    <p className="text-text-dim text-xs font-black uppercase tracking-widest">Actifs Totaux</p>
                                </div>
                            </div>
                            <div className="bg-bg-hover border border-border-subtle p-6 rounded-[2rem] flex items-center gap-4">
                                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Server className="text-emerald-400" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-text-main font-black italic uppercase tracking-tighter text-2xl">
                                        {equipments.filter(e => e.installationType === 'SOUTERRAIN').length}
                                    </h4>
                                    <p className="text-text-dim text-xs font-black uppercase tracking-widest">Souterrains</p>
                                </div>
                            </div>
                            <div className="bg-bg-hover border border-border-subtle p-6 rounded-[2rem] flex items-center gap-4">
                                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <MapPin className="text-blue-400" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-text-main font-black italic uppercase tracking-tighter text-2xl">
                                        {new Set(equipments.map(e => e.quartier)).size}
                                    </h4>
                                    <p className="text-text-dim text-xs font-black uppercase tracking-widest">Quartiers</p>
                                </div>
                            </div>
                        </div>

                        {/* Equipment Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                            <AnimatePresence mode="popLayout">
                                {equipments
                                    .filter(eq => {
                                        if (!searchQuery.trim()) return true;
                                        const terms = searchQuery.split(';').map(t => t.trim().toLowerCase()).filter(t => t !== '');
                                        return terms.some(term => 
                                            eq.name.toLowerCase().includes(term) ||
                                            eq.type?.toLowerCase().includes(term) ||
                                            eq.quartier?.toLowerCase().includes(term)
                                        );
                                    })
                                    .map((eq) => (
                                        <motion.div
                                            key={eq.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        >
                                            <EquipmentCard 
                                                equipment={eq} 
                                                onClick={() => setSelectedEquipmentId(eq.id)}
                                                onEdit={isAdmin ? (e) => handleEdit(e, eq) : undefined}
                                                onDelete={isAdmin ? (e) => handleDelete(e, eq.id) : undefined}
                                            />
                                        </motion.div>
                                    ))
                                }
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* Modals */}
            <EquipmentDiagnosticModal
                id={selectedEquipmentId}
                isOpen={selectedEquipmentId !== null}
                onClose={() => setSelectedEquipmentId(null)}
            />

            <EquipmentManageModal
                equipment={manageEquipment === undefined ? null : manageEquipment}
                isOpen={manageEquipment !== undefined}
                onClose={handleModalClose}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
