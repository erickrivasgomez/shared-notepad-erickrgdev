import { db, LocalNote } from '../db/dexie';
import { createClient } from '../supabase/client';

export class SyncEngine {
  private supabase = createClient();
  
  async syncPendingNotes() {
    if (!navigator.onLine) return;

    const pendingNotes = await db.notes.where('_syncStatus').equals('pending').toArray();
    if (pendingNotes.length === 0) return;

    for (const localNote of pendingNotes) {
      await this.resolveNoteConflict(localNote);
    }
  }

  private async resolveNoteConflict(localNote: LocalNote) {
    try {
      // 1. Obtener la remota
      const { data: remoteNote, error } = await this.supabase
        .from('notes')
        .select('*')
        .eq('id', localNote.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (remoteNote) {
        const localTime = new Date(localNote.updated_at).getTime();
        const remoteTime = new Date(remoteNote.updated_at).getTime();

        // 2. Si remota es significativamente más nueva que la última modificación local
        if (remoteTime - localTime > 2000) {
          // Resolver conflicto concatenando versiones (como dictaba el Prompt)
          const mergedContent = `${remoteNote.content}\n\n---\n(Versión offline local guardada):\n${localNote.content}`;
          
          await this.supabase.from('notes').update({
            content: mergedContent,
            last_edited_by: localNote.last_edited_by,
            last_edited_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }).eq('id', localNote.id);
          
        } else if (localTime >= remoteTime) {
          // 3. Nuestro offline es más nuevo temporalmente o igual
          await this.supabase.from('notes').update({
            title: localNote.title,
            content: localNote.content,
            last_edited_by: localNote.last_edited_by,
            last_edited_at: localNote.last_edited_at,
            updated_at: new Date().toISOString(),
            is_deleted: localNote.is_deleted
          }).eq('id', localNote.id);
        }
      } else {
         // La nota se creó enteramente offline y no existe en server
         await this.supabase.from('notes').insert([{
            id: localNote.id,
            notebook_id: localNote.notebook_id,
            title: localNote.title,
            content: localNote.content,
            author_id: localNote.author_id,
            last_edited_by: localNote.last_edited_by,
            last_edited_at: localNote.last_edited_at,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_deleted: localNote.is_deleted
         }]);
      }

      // 4. Marcar en Dexie como Synced para no evaluar de nuevo este cambio
      await db.notes.update(localNote.id, { _syncStatus: 'synced' });
    } catch (e) {
      console.error("Conflict resolution failed for note:", localNote.id, e);
    }
  }
}
