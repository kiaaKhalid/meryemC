'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SettingsModal from '@/components/SettingsModal';
import { getAllIncidents, Incident } from '@/services/maintenanceService';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function IncidentsPage() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAllIncidents();
                setIncidents(data);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'MAJOR': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        }
    };

    const getStatusIcon = (status: string) => {
        if (status === 'CLOSED') {
            return <CheckCircle className="text-emerald-500" size={18} />;
        }
        if (status === 'IN_PROGRESS') {
            return <Clock className="text-orange-400" size={18} />;
        }
        return <AlertTriangle className="text-rose-500" size={18} />;
    };

    if (loading) return (
        <div className="flex min-h-screen bg-bg-main items-center justify-center text-text-main italic font-black uppercase tracking-[1em] animate-pulse">
            Extraction de l'Historique...
        </div>
    );

    return (
        <div className="flex min-h-screen bg-bg-main">
            <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />

            <main className="flex-1 h-screen overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-8 md:p-12 max-w-7xl mx-auto w-full"
                >
                    {/* Header */}
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-8 bg-rose-500 rounded-full" />
                            <h1 className="text-text-main font-black italic uppercase tracking-tighter text-4xl">
                                Registre des <span className="text-rose-500">Incidents</span>
                            </h1>
                        </div>
                        <p className="text-text-dim text-sm font-bold uppercase tracking-widest max-w-2xl">
                            Traçabilité totale des anomalies et interventions sur le réseau Casablanca.
                        </p>
                    </header>

                    {/* Timeline / Table */}
                    <div className="bg-bg-hover border border-border-subtle rounded-[2rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border-subtle bg-bg-card">
                                        <th className="p-8 text-xs font-black uppercase tracking-[0.2em] text-text-dim">Date</th>
                                        <th className="p-8 text-xs font-black uppercase tracking-[0.2em] text-text-dim">Diagnostic / Description</th>
                                        <th className="p-8 text-xs font-black uppercase tracking-[0.2em] text-text-dim">Gravité</th>
                                        <th className="p-8 text-xs font-black uppercase tracking-[0.2em] text-text-dim">État</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incidents.length > 0 ? incidents.map((inc) => (
                                        <tr key={inc.id} className="border-b border-border-subtle hover:bg-bg-card transition-colors group">
                                            <td className="p-8">
                                                <div className="flex flex-col">
                                                    <span className="text-text-main font-black italic text-base">{new Date(inc.incidentDate).toLocaleDateString()}</span>
                                                    <span className="text-xs text-text-dim uppercase font-bold">{new Date(inc.incidentDate).toLocaleTimeString()}</span>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <p className="text-text-muted text-sm font-medium leading-relaxed max-w-md">
                                                    {inc.description}
                                                </p>
                                            </td>
                                            <td className="p-8">
                                                <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${getSeverityStyles(inc.severity)}`}>
                                                    {inc.severity}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-3">
                                                    {getStatusIcon(inc.status)}
                                                    <span className="text-text-main text-sm font-black uppercase tracking-tighter italic">
                                                        {inc.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center text-text-dim font-black uppercase tracking-widest italic">
                                                Aucun incident répertorié. Système nominal.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </main>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
