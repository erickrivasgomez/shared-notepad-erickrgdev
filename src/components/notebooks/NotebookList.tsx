'use client';

import { useNotebooks } from '@/hooks/useNotebooks';
import { Book, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function NotebookList() {
  const { notebooks, loading, error, createNotebook } = useNotebooks();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !userId) return;
    
    try {
      await createNotebook(newTitle, userId);
      setNewTitle('');
      setIsCreating(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && notebooks.length === 0) {
    return <div className="text-sm text-neutral-500">Cargando libretas...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">Ocurrió un error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      {isCreating ? (
        <form onSubmit={handleCreate} className="mb-6 flex gap-2">
          <input
            type="text"
            autoFocus
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-sm"
            placeholder="Título de la nueva libreta"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-indigo-600 text-white shadow hover:bg-indigo-600/90 h-10 px-4"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 h-10 px-4"
          >
            Cancelar
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-9 px-4 mb-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Libreta
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notebooks.length === 0 && !isCreating && (
          <p className="text-muted-foreground text-sm">No tienes libretas todavía. ¡Crea la primera!</p>
        )}
        
        {notebooks.map((notebook) => (
          <Link
            key={notebook.id}
            href={`/notebooks/${notebook.id}`}
            className="flex flex-col p-6 space-y-2 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-indigo-500 transition-colors bg-white dark:bg-neutral-950 shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <Book className="w-5 h-5 text-indigo-500" />
              <h3 className="font-serif font-semibold text-lg line-clamp-1">{notebook.title}</h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {new Date(notebook.updated_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
