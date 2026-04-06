import { createClient } from '@/lib/supabase/client';
import { INoteRepository } from '../interfaces/INoteRepository';
import { Note } from '@/types/app.types';

export class SupabaseNoteRepository implements INoteRepository {
  private supabase = createClient();

  async getNotesByNotebookId(notebookId: string): Promise<Note[]> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('notebook_id', notebookId)
      .eq('is_deleted', false)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Note[];
  }

  async getNoteById(id: string): Promise<Note | null> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data as Note | null;
  }

  async createNote(notebookId: string, title = 'Sin título', content = ''): Promise<Note> {
    const { data: userResponse } = await this.supabase.auth.getUser();
    
    const { data, error } = await this.supabase
      .from('notes')
      .insert([{ 
        notebook_id: notebookId, 
        title, 
        content,
        author_id: userResponse.user?.id,
        last_edited_by: userResponse.user?.id
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Note;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    const { data: userResponse } = await this.supabase.auth.getUser();

    const { data, error } = await this.supabase
      .from('notes')
      .update({
        ...updates,
        last_edited_by: userResponse.user?.id || updates.last_edited_by,
        last_edited_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Note;
  }

  async deleteNote(id: string): Promise<void> {
    // Soft delete para sync offline compatible
    const { error } = await this.supabase
      .from('notes')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}
