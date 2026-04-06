'use client';

import { useEffect, useState } from 'react';
import { SupabaseMemberRepository } from '@/repositories/supabase/SupabaseMemberRepository';
import { MemberWithProfile } from '@/repositories/interfaces/IMemberRepository';
import { Invitation } from '@/types/app.types';
import { Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const memberRepo = new SupabaseMemberRepository();

export default function NotebookSettingsPage({ params }: { params: { id: string } }) {
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccessToken, setInviteSuccessToken] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersData, invitesData] = await Promise.all([
        memberRepo.getMembers(params.id),
        memberRepo.getPendingInvitations(params.id)
      ]);
      setMembers(membersData);
      setInvitations(invitesData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    try {
      setIsInviting(true);
      const newInvite = await memberRepo.inviteUser(params.id, inviteEmail);
      setInvitations([...invitations, newInvite]);
      setInviteEmail('');
      setInviteSuccessToken(newInvite.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await memberRepo.revokeInvitation(id);
      setInvitations(invitations.filter(i => i.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if(!confirm('¿Estás seguro de quitar a este miembro?')) return;
    try {
      await memberRepo.removeMember(params.id, userId);
      setMembers(members.filter(m => m.user_id !== userId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-8 text-neutral-500">Cargando configuración...</div>;

  return (
    <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full overflow-y-auto">
      {/* Botón Volver Mobile */}
      <div className="md:hidden mb-6 mt-2">
        <Link href={`/notebooks/${params.id}`} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Ver Libreta
        </Link>
      </div>

      <h2 className="text-2xl font-serif font-bold mb-8">Administrar Miembros</h2>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6">{error}</div>}

      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4">Invitar Colaborador</h3>
        <form onSubmit={handleInvite} className="flex gap-2 mb-4">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm max-w-sm"
            placeholder="correo@ejemplo.com"
            required
          />
          <button
            type="submit"
            disabled={isInviting}
            className="h-10 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {isInviting ? 'Enviando...' : 'Invitar'}
          </button>
        </form>

        {inviteSuccessToken && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-md">
            <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-2">¡Invitación creada! Comparte este enlace seguro con la persona:</p>
            <code className="text-xs bg-emerald-100 dark:bg-emerald-950 px-2 py-1 rounded block break-all">
              {typeof window !== 'undefined' ? `${window.location.origin}/invite/${inviteSuccessToken}` : ''}
            </code>
          </div>
        )}
      </div>

      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4">Invitaciones Pendientes</h3>
        {invitations.length === 0 ? (
          <p className="text-sm text-neutral-500">No hay invitaciones pendientes.</p>
        ) : (
          <ul className="space-y-2">
            {invitations.map(inv => (
              <li key={inv.id} className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-md">
                <div>
                  <p className="text-sm font-medium">{inv.invited_email}</p>
                  <p className="text-xs text-neutral-500">Expira: {new Date(inv.expires_at).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => handleRevoke(inv.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Revocar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Miembros Activos</h3>
        <ul className="space-y-2">
          {members.map(member => (
            <li key={member.id} className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-md">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: member.profiles?.avatar_color || '#111' }}
                >
                  {member.profiles?.display_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium">{member.profiles?.display_name || member.profiles?.email}</p>
                  <p className="text-xs text-neutral-500 capitalize">Rol: {member.role}</p>
                </div>
              </div>
              
              {member.role !== 'owner' && (
                <button 
                  onClick={() => handleRemoveMember(member.user_id)}
                  className="text-red-500 hover:text-red-700 p-2 text-xs font-medium"
                >
                  Expulsar
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
