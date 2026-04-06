import { NotebookMember, Profile, Invitation } from '@/types/app.types';

export type MemberWithProfile = NotebookMember & { profiles: Profile };

export interface IMemberRepository {
  getMembers(notebookId: string): Promise<MemberWithProfile[]>;
  getPendingInvitations(notebookId: string): Promise<Invitation[]>;
  inviteUser(notebookId: string, email: string, role?: 'viewer' | 'editor'): Promise<Invitation>;
  revokeInvitation(id: string): Promise<void>;
  getInvitationByToken(token: string): Promise<Invitation & { notebooks: { title: string } } | null>;
  acceptInvitation(token: string): Promise<string>; 
  removeMember(notebookId: string, userId: string): Promise<void>;
}
