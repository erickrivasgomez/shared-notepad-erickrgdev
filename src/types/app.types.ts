export interface Notebook {
  id: string;
  title: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  notebook_id: string;
  title: string;
  content: string;
  author_id: string | null;
  last_edited_by: string | null;
  last_edited_at: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface Profile {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_color: string;
  created_at: string;
}

export interface NotebookMember {
  id: string;
  notebook_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  invited_by: string | null;
  joined_at: string;
}

export interface Invitation {
  id: string;
  notebook_id: string;
  invited_email: string;
  invited_by: string;
  role: 'editor' | 'viewer';
  token: string;
  accepted: boolean;
  created_at: string;
  expires_at: string;
}
