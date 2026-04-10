'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SettingsModal from '@/components/SettingsModal';
import { getUsers, deleteUser, UserProfile } from '@/services/maintenanceService';
import UserCard from '@/components/maintenance/UserCard';
import UserManageModal from '@/components/maintenance/UserManageModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Loader2, ShieldCheck, Database, Orbit } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { isAdmin } = useAuth();
    
    // Status State
    const [manageUser, setManageUser] = useState<UserProfile | null | undefined>(undefined); // null = Create, undefined = Hidden

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
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
        if (globalThis.confirm("Êtes-vous sûr de vouloir révoquer cet accès ? Cette action est irréversible et supprimera le compte de maintenance associé.")) {
            setLoading(true);
            const success = await deleteUser(id);
            if (success) {
                await fetchData();
            } else {
                setLoading(false);
            }
        }
    };

    const handleEdit = (user: UserProfile) => {
        setManageUser(user);
    };

    const handleModalClose = (refetch?: boolean) => {
        setManageUser(undefined);
        if (refetch) fetchData();
    };

    const showContent = !loading || users.length > 0;
    return (
        <div className="flex min-h-screen bg-bg-main">
            <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />

            <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
                {loading ? (
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
                                onClick={() => setManageUser(null)}
                                className="fixed bottom-10 right-10 z-50 w-20 h-20 rounded-[2.5rem] bg-blue-500 hover:bg-blue-600 shadow-[0_20px_50px_-10px_rgba(59,130,246,0.5)] flex items-center justify-center text-text-main transition-all hover:scale-110 active:scale-95 group"
                            >
                                <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
                                <div className="absolute -top-14 right-0 bg-white text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap shadow-2xl">
                                    Réserver un Profil
                                </div>
                            </button>
                        )}

                        {/* Page Header */}
                        <header className="mb-12">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 bg-blue-500 rounded-full" />
                                    <h1 className="text-text-main font-black italic uppercase tracking-tighter text-4xl whitespace-nowrap">
                                        Personnel & <span className="text-blue-500">Accès</span>
                                    </h1>
                                </div>

                                {/* Search Bar */}
                                <div className="relative group w-full md:max-w-md lg:max-w-xl">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-text-dim group-focus-within:text-blue-400 transition-colors duration-300">
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} className="stroke-[3]" />}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Rechercher Opérateur (Nom, E-mail, Rôle)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-bg-hover border border-border-subtle text-text-main rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-500 font-bold italic uppercase tracking-widest text-xs placeholder:text-text-muted backdrop-blur-xl"
                                    />
                                </div>
                            </div>
                            <p className="text-text-dim text-sm font-bold uppercase tracking-widest max-w-2xl leading-relaxed">
                                Gestion des identités industrielles et des trajectoires d'accès au parc. Contrôle du personnel opérationnel.
                            </p>
                        </header>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-bg-hover border border-border-subtle p-6 rounded-[2rem] flex items-center gap-4">
                                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <Users className="text-blue-400" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-text-main font-black italic uppercase tracking-tighter text-2xl">{users.length}</h4>
                                    <p className="text-text-dim text-xs font-black uppercase tracking-widest">Identités Totales</p>
                                </div>
                            </div>
                            <div className="bg-bg-hover border border-border-subtle p-6 rounded-[2rem] flex items-center gap-4">
                                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <ShieldCheck className="text-emerald-400" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-text-main font-black italic uppercase tracking-tighter text-2xl">
                                        {users.filter(u => u.role === 'ADMIN').length}
                                    </h4>
                                    <p className="text-text-dim text-xs font-black uppercase tracking-widest">Administrateurs</p>
                                </div>
                            </div>
                            <div className="bg-bg-hover border border-border-subtle p-6 rounded-[2rem] flex items-center gap-4">
                                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                    <Database className="text-indigo-400" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-text-main font-black italic uppercase tracking-tighter text-2xl">
                                        {users.filter(u => u.compte?.status === 'ACTIVE').length}
                                    </h4>
                                    <p className="text-text-dim text-xs font-black uppercase tracking-widest">Comptes Actifs</p>
                                </div>
                            </div>
                        </div>

                        {/* Users Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                            <AnimatePresence mode="popLayout">
                                {users
                                    .filter(u => {
                                        const search = searchQuery.toLowerCase();
                                        return u.username.toLowerCase().includes(search) || 
                                               u.email.toLowerCase().includes(search) ||
                                               u.role.toLowerCase().includes(search);
                                    })
                                    .map((u) => (
                                        <motion.div
                                            key={u.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        >
                                            <UserCard 
                                                user={u} 
                                                onEdit={isAdmin ? (e) => handleEdit(u) : undefined}
                                                onDelete={isAdmin ? (e) => handleDelete(e, u.id) : undefined}
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
            <UserManageModal
                user={manageUser === undefined ? null : manageUser}
                isOpen={manageUser !== undefined}
                onClose={handleModalClose}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
