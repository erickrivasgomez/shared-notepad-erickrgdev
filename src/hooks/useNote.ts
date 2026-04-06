'use client';

import { useState, useEffect, useRef } from 'react';
import { Note } from '@/types/app.types';
import { SupabaseNoteRepository } from '@/repositories/supabase/SupabaseNoteRepository';

const repository = new SupabaseNoteRepository();

export function useNote(noteId: string) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Timer para auto-save (debounce)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!noteId) return;
    
    fetchNote();

    const channel = repository['supabase'].channel(`realtime:note:${noteId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notes', filter: `id=eq.${noteId}` },
        (payload) => {
          setNote((prev) => ({ ...prev, ...payload.new } as Note));
        }
      )
      .subscribe();

    return () => {
      repository['supabase'].removeChannel(channel);
    };
  }, [noteId]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const data = await repository.getNoteById(noteId);
      setNote(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (updates: Partial<Note>) => {
    if (!noteId) return;
    
    // Auto-update locally first (optimistic)
    setNote(prev => prev ? { ...prev, ...updates } : null);
    setIsSaving(true);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const result = await repository.updateNote(noteId, updates);
        setNote(result);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsSaving(false);
      }
    }, 800); // 800ms debounce
  };

  return { note, loading, error, isSaving, saveNote };
}
