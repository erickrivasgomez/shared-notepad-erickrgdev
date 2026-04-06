'use client';

import { useNotes } from '@/hooks/useNotes';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';

export default function NoteList({ notebookId }: { notebookId: string }) {
  const { notes, loading, error, createNote } = useNotes(notebookId);

  if (loading && notes.length === 0) {
    return <div className="text-sm text-neutral-500">Cargando notas...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => createNote()}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-9 px-4 mb-4"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nueva Nota
      </button>

      <div className="space-y-2">
        {notes.length === 0 && (
          <p className="text-muted-foreground text-sm">Esta libreta está vacía.</p>
        )}

        {notes.map((note) => (
          <Link
            key={note.id}
            href={`/notebooks/${notebookId}/notes/${note.id}`}
            className="flex flex-col p-4 border border-neutral-200 dark:border-neutral-800 rounded-md hover:border-indigo-500 transition-colors bg-white dark:bg-neutral-950"
          >
            <div className="flex items-center space-x-3 mb-1">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h4 className="font-medium text-base">{note.title || 'Sin título'}</h4>
            </div>
            <p className="text-xs text-neutral-500 line-clamp-1">
              {note.content || 'Sin contenido...'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
