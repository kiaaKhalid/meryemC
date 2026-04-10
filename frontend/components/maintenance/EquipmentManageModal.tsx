'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Settings } from 'lucide-react';
import { createEquipment, updateEquipment, Equipment } from '@/services/maintenanceService';

interface EquipmentManageModalProps {
  equipment: Equipment | null; // null for Create mode
  isOpen: boolean;
  onClose: (refetch?: boolean) => void;
}

export default function EquipmentManageModal({ equipment, isOpen, onClose }: EquipmentManageModalProps) {
  const [formData, setFormData] = useState<Partial<Equipment>>({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!equipment;

  useEffect(() => {
    if (equipment && isOpen) {
      setFormData(equipment);
    } else {
      setFormData({
        type: 'Solaire',
        installationType: 'AERIEN',
        zoneDensity: 'INDUSTRIELLE',
        installationDate: new Date().toISOString().split('T')[0],
        mttr: 4.0,
        standardMttr: 6.0,
        latitude: 33.5731,
        longitude: -7.5898,
        financialValue: 50000.0,
        clientsAffected: 1500,
        nearbyWork: false,
        description: 'Nouvel actif industriel...'
      });
    }
  }, [equipment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let result;
    if (isEdit && equipment?.id) {
      result = await updateEquipment(equipment.id, formData);
    } else {
      result = await createEquipment(formData);
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
            className="relative w-full max-w-2xl bg-bg-modal border border-border-main rounded-[2.5rem] p-8 shadow-[0_0_80px_-20px_rgba(79,70,229,0.3)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  {isEdit ? <Settings className="text-indigo-400" size={24} /> : <Plus className="text-indigo-400" size={24} />}
                </div>
                <div>
                  <h2 className="text-text-main font-black italic uppercase tracking-tighter text-2xl">
                    {isEdit ? 'Modifier' : 'Ajouter'} <span className="text-indigo-500">Actif</span>
                  </h2>
                  <p className="text-text-dim text-[10px] font-black uppercase tracking-widest">
                    Gestion du Parc Industriel Casablanca
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onClose()}
                className="w-10 h-10 rounded-xl bg-bg-input border border-border-main flex items-center justify-center text-text-dim hover:text-text-main transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Désignation de l'Actif / Activité</label>
                    <input
                      required
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Transformateur Casablanca Hub"
                      className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold placeholder:text-text-muted/50 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Type d'Actif</label>
                    <select
                      value={formData.type || ''}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="Solaire">Solaire</option>
                      <option value="Eolien">Éolien</option>
                      <option value="Transformateur">Transformateur</option>
                      <option value="Centrale">Centrale</option>
                    </select>
                  </div>
                </div>

                {/* Coordinates */}
                <div className="space-y-4">
                   <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Latitude</label>
                    <input
                      required
                      type="number"
                      step="any"
                      placeholder="33.5731"
                      value={formData.latitude ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, latitude: val === '' ? undefined : parseFloat(val) });
                      }}
                      className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Longitude</label>
                    <input
                      required
                      type="number"
                      step="any"
                      placeholder="-7.5898"
                      value={formData.longitude ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, longitude: val === '' ? undefined : parseFloat(val) });
                      }}
                      className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Description */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Définition Technique / Notes</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Détails sur l'utilisation, caractéristiques techniques ou notes d'installation..."
                  rows={2}
                  className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold placeholder:text-text-muted/50 focus:outline-none focus:border-indigo-500/50 transition-all resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                 {/* Neighborhood */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Quartier</label>
                    <input
                      required
                      type="text"
                      value={formData.quartier || ''}
                      onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                      placeholder="Ex: Anfa"
                      className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                  {/* Installation Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Installation</label>
                    <select
                      value={formData.installationType || ''}
                      onChange={(e) => setFormData({ ...formData, installationType: e.target.value as any })}
                      className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="AERIEN">Aerien</option>
                      <option value="SOUTERRAIN">Souterrain</option>
                    </select>
                  </div>
                  {/* Zone Density */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Zone</label>
                    <select
                      value={formData.zoneDensity || ''}
                      onChange={(e) => setFormData({ ...formData, zoneDensity: e.target.value as any })}
                      className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="COMMERCIALE">Commerciale</option>
                      <option value="INDUSTRIELLE">Industrielle</option>
                      <option value="RESIDENTIELLE">Résidentielle</option>
                    </select>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border-subtle">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Date d'Installation</label>
                    <input
                      required
                      type="date"
                      value={formData.installationDate || ''}
                      onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
                      className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Standard MTTR (Hrs)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="6.0"
                      value={formData.standardMttr ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, standardMttr: val === '' ? undefined : parseFloat(val) });
                      }}
                      className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Valeur Financière (MAD)</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="50000"
                        value={formData.financialValue ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, financialValue: val === '' ? undefined : parseFloat(val) });
                        }}
                        className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-500/50 italic">MAD</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-dim font-black uppercase tracking-widest ml-1">Population Connectée</label>
                    <input
                      type="number"
                      placeholder="1500"
                      value={formData.clientsAffected ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, clientsAffected: val === '' ? undefined : parseInt(val) });
                      }}
                      className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-text-main text-bg-main h-14 rounded-2xl font-black italic uppercase tracking-widest text-sm hover:bg-white/90 disabled:opacity-50 transition-all flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-bg-main/20 border-t-bg-main rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} className="group-hover:scale-110 transition-transform" />
                      {isEdit ? 'Confirmer la Modification' : 'Enregistrer l\'Actif'}
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
