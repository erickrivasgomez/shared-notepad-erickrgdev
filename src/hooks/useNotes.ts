'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/types/app.types';
import { SupabaseNoteRepository } from '@/repositories/supabase/SupabaseNoteRepository';

const repository = new SupabaseNoteRepository();

export function useNotes(notebookId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (notebookId) {
      fetchNotes();
    }
  }, [notebookId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await repository.getNotesByNotebookId(notebookId);
      setNotes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    try {
      const newNote = await repository.createNote(notebookId, 'Sin título', '');
      setNotes([newNote, ...notes]);
      return newNote;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { notes, loading, error, createNote, refresh: fetchNotes };
}
