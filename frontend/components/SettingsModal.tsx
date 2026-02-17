"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Lock, Bell, Eye, MessageSquare, 
  Mic2, Camera, X, Save, Trash2, CheckCircle2 
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { updateUserAccount, updateUserPassword, updateUserImage } from '../services/maintenanceService';

// --- TYPES POUR LES ONGLETS ---
type TabId = 'profile' | 'account';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
  ];

  // Forms state
  const [profileName, setProfileName] = useState(user?.username || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileCivility, setProfileCivility] = useState(user?.civility || 'monsieur');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  useEffect(() => {
    if (user && isOpen) {
       setProfileName(user.username);
       setProfileEmail(user.email);
       setProfileCivility(user.civility || 'monsieur');
       setCurrentPassword('');
       setNewPassword('');
       setConfirmPassword('');
       setPasswordFeedback('');
       setProfileFeedback('');
    }
  }, [user, isOpen]);

  const handleSaveProfile = async () => {
     if (!user?.id) return;
     setProfileSaving(true);
     setProfileFeedback('');
     try {
       const updated = await updateUserAccount(user.id, { 
           username: profileName, 
           email: profileEmail, 
           civility: profileCivility 
       });
       if (updated) {
           updateUser(updated);
           setProfileFeedback("Les informations ont été modifiées avec succès");
       } else {
           setProfileFeedback("Erreur lors de la modification des informations");
       }
     } catch (e) {
       console.error("Failed to update profile", e);
       setProfileFeedback("Erreur de connexion au serveur");
     } finally {
       setProfileSaving(false);
     }
  };

  const compressImage = (base64Str: string, maxWidth = 500, maxHeight = 500): Promise<string> => {
    return new Promise((resolve) => {
      const img = new (window as any).Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // 70% quality JPEG is perfect for avatars
      };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validation de base
      if (!file.type.startsWith('image/')) {
        setProfileFeedback("Veuillez sélectionner une image valide");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
          const originalBase64 = event.target?.result as string;
          setIsImageUploading(true);
          
          try {
              if (user?.id) {
                 // Compression client-side pour éviter "Packet for query is too large"
                 const compressedBase64 = await compressImage(originalBase64);
                 
                 const updated = await updateUserImage(user.id, compressedBase64);
                 if (updated) {
                    updateUser(updated);
                    setProfileFeedback("Image de profil mise à jour avec succès");
                 }
              }
          } catch(error) {
              console.error("Image upload failed", error);
              setProfileFeedback("Erreur lors de l'upload de l'image (Vérifiez la taille)");
          } finally {
              setIsImageUploading(false);
          }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    if (!user?.id) return;
    setIsImageUploading(true);
    try {
        const updated = await updateUserImage(user.id, "");
        if (updated) {
            updateUser(updated);
            setProfileFeedback("Image de profil supprimée avec succès");
        }
    } catch (error) {
        console.error("Image deletion failed", error);
        setProfileFeedback("Erreur lors de la suppression de l'image");
    } finally {
        setIsImageUploading(false);
    }
  };

  const handleSavePassword = async () => {
    if (!user?.id) return;
    if (newPassword !== confirmPassword) {
       setPasswordFeedback("Les mots de passe ne correspondent pas");
       return;
    }
    setPasswordSaving(true);
    try {
      const res = await updateUserPassword(user.id, { currentPassword, newPassword });
      if (res) {
          setPasswordFeedback("Mot de passe mis à jour avec succès");
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
      } else {
          setPasswordFeedback("Mot de passe actuel incorrect");
      }
    } catch {
       setPasswordFeedback("Erreur lors de la mise à jour");
    } finally {
       setPasswordSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          {/* OVERLAY GLASSMORPHISM */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* FENÊTRE PRINCIPALE (Format Image Référence) */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl h-[650px] bg-bg-modal rounded-3xl shadow-2xl border border-border-main flex overflow-hidden text-text-dim"
          >
            
            {/* --- SIDEBAR GAUCHE DU POPUP --- */}
            <aside className="w-64 bg-bg-sidebar border-r border-border-main flex flex-col p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-text-main font-bold text-lg">Settings</h2>
              </div>

              <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabId)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-medium relative group
                      ${activeTab === item.id ? 'text-text-main bg-bg-hover' : 'hover:bg-bg-hover hover:text-slate-200'}
                    `}
                  >
                    {activeTab === item.id && (
                      <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                    )}
                    <item.icon size={18} className={activeTab === item.id ? 'text-blue-500' : 'opacity-50 group-hover:opacity-100'} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* --- CONTENU DROIT (DYNAMIQUE) --- */}
            <main className="flex-1 flex flex-col bg-bg-modal">
              {/* Header Interne */}
              <div className="p-6 flex justify-end">
                <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
                
                {/* --- CONTENU : PROFILE --- */}
                {activeTab === 'profile' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    
                    {/* Picture Section (Inchangée) */}
                    <section>
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4 block">Image de profil</label>
                      <div className="flex items-center gap-6">
                        <div className="relative w-20 h-20">
                          <img 
                            src={user?.profileImage || "data:image/jpeg;base64,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"} 
                            className="rounded-full w-full h-full object-cover border-2 border-white/10" 
                            alt="Avatar"
                          />
                          <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 border-2 border-[#121212] rounded-full" />
                        </div>
                        <div className="flex gap-3">
                          <label className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-text-main rounded-lg text-xs font-bold transition-all cursor-pointer ${isImageUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            {isImageUploading ? 'Chargement...' : 'Changer l\'image'}
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                          </label>
                          <button 
                            onClick={handleDeleteImage}
                            disabled={isImageUploading || !user?.profileImage}
                            className={`px-4 py-3 bg-bg-hover hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center
                              ${(isImageUploading || !user?.profileImage) ? 'opacity-30 cursor-not-allowed grayscale' : ''}
                            `}
                            title="Supprimer l'image"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* Form Section (Nouveaux champs) */}
                    <div className="space-y-6">
                      
                      {/* Ligne 1 : Civilité */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-40 block">Civilité</label>
                        <select 
                          value={profileCivility}
                          onChange={e => setProfileCivility(e.target.value)}
                          className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                        >
                          <option value="madame">Madame</option>
                          <option value="monsieur">Monsieur</option>
                        </select>
                      </div>

                      {/* Ligne 2 : Nom Complet (Merge Prénom/Nom for single DB field) */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-40 block">Nom Complet</label>
                        <input 
                           type="text" 
                           value={profileName} 
                           onChange={e => setProfileName(e.target.value)}
                           className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main outline-none focus:border-blue-500/50 transition-all" 
                         />
                      </div>

                      {/* Ligne 3 : Email */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-40 block">Adresse Email</label>
                        <input 
                          type="email" 
                          value={profileEmail} 
                          onChange={e => setProfileEmail(e.target.value)}
                          className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main outline-none focus:border-blue-500/50 transition-all" 
                        />
                      </div>

                      {/* Ligne 4 : Rôle Affiché (Disabled) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest opacity-40 block">Téléphone</label>
                          <input type="tel" disabled defaultValue="+212 665-801308" className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main opacity-50 outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest opacity-40 block">Rôle Système</label>
                          <input type="text" disabled value={user?.role || ''} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main opacity-50 outline-none transition-all font-bold uppercase" />
                        </div>
                      </div>

                    </div>

                    {profileFeedback && (
                      <p className={`text-sm italic mt-4 ${profileFeedback.includes("succès") ? "text-emerald-500" : "text-rose-500"}`}>
                         {profileFeedback}
                      </p>
                    )}

                    {/* Save Button (Inchangé) */}
                    <div className="pt-4 flex justify-end">
                      <button onClick={handleSaveProfile} disabled={profileSaving} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-text-main rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 cursor-pointer">
                        {profileSaving ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* --- CONTENU : ACCOUNT (SIMULÉ) --- */}
                {activeTab === 'account' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    
                    <section>
                      <div className="flex items-center gap-3 mb-2">
                        <Lock className="text-blue-500" size={24} />
                        <h3 className="text-text-main font-bold text-xl uppercase tracking-tighter italic leading-none">Sécurité du Compte</h3>
                      </div>
                      <p className="text-text-muted text-sm mb-8 opacity-80">Gérez votre mot de passe pour sécuriser votre accès MonitorAI.</p>

                      {/* Formulaire de modification du mot de passe */}
                      <div className="space-y-6 max-w-lg">
                        
                        {/* Mot de passe actuel */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest opacity-40 block">Mot de passe actuel</label>
                          <input 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full  bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main outline-none focus:border-blue-500/50 transition-all" 
                          />
                        </div>

                        {/* Ligne de séparation visuelle optionnelle */}
                        <div className="h-px w-full bg-bg-hover my-4" />

                        {/* Nouveau mot de passe */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest opacity-40 block">Nouveau mot de passe</label>
                          <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main outline-none focus:border-blue-500/50 transition-all text-xs" 
                          />
                          <p className="text-xs text-text-muted mt-1 italic">Doit contenir au moins 8 caractères, un chiffre et un symbole.</p>
                        </div>

                        {/* Confirmation du mot de passe */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest opacity-40 block">Confirmer le nouveau mot de passe</label>
                          <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full text-xs bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main outline-none  focus:border-blue-500/50 transition-all" 
                          />
                        </div>

                      </div>

                      {passwordFeedback && (
                        <p className={`text-sm italic mt-4 ${passwordFeedback.includes("succès") ? "text-emerald-500" : "text-rose-500"}`}>
                           {passwordFeedback}
                        </p>
                      )}

                      {/* Bouton de sauvegarde */}
                      <div className="pt-4 flex justify-end">
                        <button onClick={handleSavePassword} disabled={passwordSaving} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-text-main rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 cursor-pointer">
                          {passwordSaving ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                        </button>
                      </div>
                    </section>

                  </motion.div>
                )}
              </div>
            </main>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}