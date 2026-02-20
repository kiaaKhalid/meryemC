'use client';

import React from 'react';
import { UserProfile } from '@/services/maintenanceService';
import { motion } from 'framer-motion';
import { User, Shield, Mail, CreditCard, Edit, Trash } from 'lucide-react';

interface UserCardProps {
  user: UserProfile;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-bg-hover border border-border-subtle p-8 rounded-[2.5rem] relative overflow-hidden group"
    >
      {/* Admin Actions - Hover reveal */}
      <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10 translate-y-2 group-hover:translate-y-0 text-text-main">
        <button 
          onClick={onEdit}
          className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-text-main transition-all shadow-lg"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-text-main transition-all shadow-lg"
        >
          <Trash size={16} />
        </button>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 blur-[80px] group-hover:bg-blue-500/15 transition-all" />

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] group-hover:scale-105 transition-transform">
          <User className="text-blue-400" size={32} />
        </div>
        <div>
          <h3 className="text-text-main font-black text-xl italic uppercase tracking-tighter leading-tight">
            {user.username}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Shield size={12} className="text-text-dim" />
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{user.role}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-bg-hover rounded-2xl border border-border-subtle">
          <div className="flex items-center gap-3">
            <Mail size={14} className="text-text-dim" />
            <span className="text-[11px] text-text-muted font-bold">{user.email}</span>
          </div>
        </div>

        {user.compte && (
          <div className="p-5 bg-linear-to-br from-bg-card to-transparent rounded-[2rem] border border-border-subtle group-hover:border-blue-500/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CreditCard size={14} className="text-blue-400" />
              </div>
              <span className="text-[10px] text-text-dim font-black uppercase tracking-widest">Compte de Maintenance</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-text-main font-black italic tracking-tighter text-lg">
                {user.compte.accountNumber}
              </span>
              <span className={`text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-black uppercase border border-emerald-500/20 ${user.compte.status === 'SUSPENDED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}`}>
                {user.compte.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
