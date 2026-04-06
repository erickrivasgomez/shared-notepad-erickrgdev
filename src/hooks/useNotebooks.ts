'use client';

import { useState, useEffect } from 'react';
import { Notebook } from '@/types/app.types';
import { SupabaseNotebookRepository } from '@/repositories/supabase/SupabaseNotebookRepository';

// Por ahora iteraremos la base directo desde supabase.
// En una siguiente fase conectaremos Dexie local.
const repository = new SupabaseNotebookRepository();

export function useNotebooks() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const fetchNotebooks = async () => {
    try {
      setLoading(true);
      const data = await repository.getNotebooks();
      setNotebooks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNotebook = async (title: string, ownerId: string) => {
    try {
      const newNotebook = await repository.createNotebook(title, ownerId);
      setNotebooks([newNotebook, ...notebooks]);
      return newNotebook;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { notebooks, loading, error, createNotebook, refresh: fetchNotebooks };
}
