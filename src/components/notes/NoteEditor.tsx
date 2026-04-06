'use client';

import { useNote } from '@/hooks/useNote';
import { useEffect, useState } from 'react';
import NotePresence from '@/components/notes/NotePresence';

export default function NoteEditor({ noteId }: { noteId: string }) {
  const { note, loading, error, isSaving, saveNote } = useNote(noteId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Sincronizar estado local solo la primera vez que carga la nota
  useEffect(() => {
    if (note && title === '' && content === '') {
      setTitle(note.title || '');
      setContent(note.content || '');
    }
  }, [note]);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-neutral-400">
        Cargando nota...
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-red-500">
        La nota no existe o hubo un error al cargarla.
      </div>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    saveNote({ title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    saveNote({ content: e.target.value });
  };

  return (
    <div className="flex-1 flex flex-col pt-8 px-8 pb-0 max-w-4xl w-full mx-auto relative h-full">
      <div className="flex justify-between mb-4 h-6 items-center">
        <NotePresence noteId={noteId} />
        {isSaving ? (
          <span className="text-xs text-neutral-400 animate-pulse">Guardando...</span>
        ) : (
          <span className="text-xs text-neutral-400 opacity-0 transition-opacity">Guardado</span>
        )}
      </div>

      <input
        type="text"
        className="w-full text-4xl font-serif font-bold bg-transparent outline-none border-none placeholder:text-neutral-300 dark:placeholder:text-neutral-700 text-neutral-900 dark:text-neutral-50"
        placeholder="Título de la nota"
        value={title}
        onChange={handleTitleChange}
      />
      
      <div className="text-xs text-neutral-500 mt-2 mb-8">
        Última edición por {note.last_edited_by || 'Desconocido'} el {new Date(note.last_edited_at).toLocaleString()}
      </div>

      <textarea
        className="flex-1 w-full bg-transparent font-mono text-base outline-none resize-none placeholder:text-neutral-300 dark:placeholder:text-neutral-700 text-neutral-800 dark:text-neutral-200"
        placeholder="Comienza a escribir..."
        value={content}
        onChange={handleContentChange}
      />
    </div>
  );
}
