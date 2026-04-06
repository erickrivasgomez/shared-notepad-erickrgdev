import { createClient } from '@/lib/supabase/client';
import { INotebookRepository } from '../interfaces/INotebookRepository';
import { Notebook } from '@/types/app.types';

export class SupabaseNotebookRepository implements INotebookRepository {
  private supabase = createClient();

  async getNotebooks(): Promise<Notebook[]> {
    const { data, error } = await this.supabase
      .from('notebooks')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Notebook[];
  }

  async getNotebookById(id: string): Promise<Notebook | null> {
    const { data, error } = await this.supabase
      .from('notebooks')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data as Notebook | null;
  }

  async createNotebook(title: string, ownerId: string): Promise<Notebook> {
    const { data, error } = await this.supabase
      .from('notebooks')
      .insert([{ title, owner_id: ownerId }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Notebook;
  }

  async updateNotebook(id: string, updates: Partial<Notebook>): Promise<Notebook> {
    const { data, error } = await this.supabase
      .from('notebooks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Notebook;
  }

  async deleteNotebook(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('notebooks')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}
