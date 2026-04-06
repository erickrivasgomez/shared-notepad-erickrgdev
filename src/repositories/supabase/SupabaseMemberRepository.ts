import { createClient } from '@/lib/supabase/client';
import { IMemberRepository, MemberWithProfile } from '../interfaces/IMemberRepository';
import { Invitation } from '@/types/app.types';

export class SupabaseMemberRepository implements IMemberRepository {
  private supabase = createClient();

  async getMembers(notebookId: string): Promise<MemberWithProfile[]> {
    const { data, error } = await this.supabase
      .from('notebook_members')
      .select('*, profiles(*)')
      .eq('notebook_id', notebookId);

    if (error) throw new Error(error.message);
    return data as any as MemberWithProfile[];
  }

  async getPendingInvitations(notebookId: string): Promise<Invitation[]> {
    const { data, error } = await this.supabase
      .from('invitations')
      .select('*')
      .eq('notebook_id', notebookId)
      .eq('accepted', false);

    if (error) throw new Error(error.message);
    return data as Invitation[];
  }

  async inviteUser(notebookId: string, email: string, role: 'viewer' | 'editor' = 'editor'): Promise<Invitation> {
    const { data: userData } = await this.supabase.auth.getUser();

    // En un sistema real esto también enviaría un email transaccional (Edge Function)
    const { data, error } = await this.supabase
      .from('invitations')
      .insert([{ notebook_id: notebookId, invited_email: email, role, invited_by: userData.user?.id }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Invitation;
  }

  async revokeInvitation(id: string): Promise<void> {
    const { error } = await this.supabase.from('invitations').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  async getInvitationByToken(token: string) {
    const { data, error } = await this.supabase
      .from('invitations')
      .select('*, notebooks(title)')
      .eq('token', token)
      .eq('accepted', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(error.message);
    }
    return data as any;
  }

  async acceptInvitation(token: string): Promise<string> {
    const { data: userData, error: authError } = await this.supabase.auth.getUser();
    if (authError || !userData.user) throw new Error("Debes iniciar sesión para aceptar una invitación.");

    const invitation = await this.getInvitationByToken(token);
    if (!invitation) throw new Error("Invitación inválida, caducada o ya aceptada.");

    // Añadir como miembro
    const { error: memberError } = await this.supabase.from('notebook_members').insert([{
      notebook_id: invitation.notebook_id,
      user_id: userData.user.id,
      role: invitation.role,
      invited_by: invitation.invited_by
    }]);

    if (memberError && memberError.code !== '23505') { // Ignorar error unique si ya era miembro
      throw new Error(memberError.message);
    }

    // Marcar como aceptada
    await this.supabase.from('invitations').update({ accepted: true }).eq('id', invitation.id);

    return invitation.notebook_id;
  }

  async removeMember(notebookId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notebook_members')
      .delete()
      .eq('notebook_id', notebookId)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }
}
