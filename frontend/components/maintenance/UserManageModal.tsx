'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Settings, User, Mail, Shield, CreditCard, Lock } from 'lucide-react';
import { createUser, updateUser, UserProfile, UserCompte } from '@/services/maintenanceService';

interface UserManageModalProps {
  user: UserProfile | null; // null for Create mode
  isOpen: boolean;
  onClose: (refetch?: boolean) => void;
}

export default function UserManageModal({ user, isOpen, onClose }: UserManageModalProps) {
  const [formData, setFormData] = useState<Partial<UserProfile & { password?: string }>>({});
  const [compteData, setCompteData] = useState<Partial<UserCompte>>({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!user;

  useEffect(() => {
    if (user && isOpen) {
      setFormData(user);
      setCompteData(user.compte || { status: 'ACTIVE' });
    } else {
      setFormData({
        role: 'OPERATOR',
      });
      setCompteData({
        status: 'ACTIVE',
        accountNumber: `MA-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      compte: compteData
    };

    let result;
    if (isEdit && user?.id) {
      result = await updateUser(user.id, payload);
    } else {
      result = await createUser(payload);
    }

    setLoading(false);
    if (result) {
      onClose(true); // Close and trigger refetch
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose()}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-bg-modal border border-border-main rounded-[2.5rem] p-8 shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  {isEdit ? <Settings className="text-blue-400" size={24} /> : <Plus className="text-blue-400" size={24} />}
                </div>
                <div>
                  <h2 className="text-text-main font-black italic uppercase tracking-tighter text-2xl">
                    {isEdit ? 'Modifier' : 'Ajouter'} <span className="text-blue-500">Profil</span>
                  </h2>
                  <p className="text-text-dim text-[10px] font-black uppercase tracking-widest">
                    Contrôle des Identités & Accès Casablanca
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onClose()}
                className="w-10 h-10 rounded-xl bg-bg-hover border border-border-main flex items-center justify-center text-text-dim hover:text-text-main transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Username & Email */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Nom d'Utilisateur</label>
                    <div className="relative group">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-blue-400 transition-colors" size={16} />
                       <input
                        required
                        type="text"
                        value={formData.username || ''}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Ex: meryem_admin"
                        className="w-full bg-bg-hover border border-border-main rounded-xl pl-12 pr-4 py-3 text-text-main text-sm font-bold placeholder:text-text-muted focus:outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">E-mail Professionnel</label>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-blue-400 transition-colors" size={16} />
                       <input
                        required
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="meryem@maintenance.ma"
                        className="w-full bg-bg-hover border border-border-main rounded-xl pl-12 pr-4 py-3 text-text-main text-sm font-bold placeholder:text-text-muted focus:outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Role */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">
                        {isEdit ? 'Nouveau Mot de Passe (Optionnel)' : 'Mot de Passe'}
                    </label>
                    <div className="relative group">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-blue-400 transition-colors" size={16} />
                       <input
                        required={!isEdit}
                        type="password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-bg-hover border border-border-main rounded-xl pl-12 pr-4 py-3 text-text-main text-sm font-bold placeholder:text-text-muted focus:outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Rôle Système</label>
                    <div className="relative group">
                       <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-blue-400 transition-colors" size={16} />
                       <select
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-bg-hover border border-border-main rounded-xl pl-12 pr-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                      >
                        <option value="ADMIN" className="bg-bg-modal">ADMIN</option>
                        <option value="OPERATOR" className="bg-bg-modal">OPERATOR</option>
                        <option value="ANALYST" className="bg-bg-modal">ANALYST</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compte Section */}
              <div className="pt-6 border-t border-border-subtle">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={14} className="text-blue-400" />
                  <span className="text-[10px] text-text-main font-black uppercase tracking-widest">Détails du Compte de Maintenance</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Numéro de Compte</label>
                    <input
                      required
                      type="text"
                      value={compteData.accountNumber || ''}
                      onChange={(e) => setCompteData({ ...compteData, accountNumber: e.target.value })}
                      className="w-full bg-bg-hover border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Statut du Compte</label>
                    <select
                      value={compteData.status || ''}
                      onChange={(e) => setCompteData({ ...compteData, status: e.target.value })}
                      className="w-full bg-bg-hover border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                    >
                      <option value="ACTIVE" className="bg-bg-modal">ACTIF</option>
                      <option value="SUSPENDED" className="bg-bg-modal">SUSPENDU</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-text-main h-14 rounded-2xl font-black italic uppercase tracking-widest text-sm hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center justify-center gap-3 group shadow-[0_10px_30px_-10px_rgba(59,130,246,0.5)]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} className="group-hover:scale-110 transition-transform" />
                      {isEdit ? 'Confirmer la Modification' : 'Enregistrer le Profil'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
