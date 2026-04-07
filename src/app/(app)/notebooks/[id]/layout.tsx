'use client';

import NoteList from '@/components/notes/NoteList';
import Link from 'next/link';
import { ArrowLeft, Settings } from 'lucide-react';
import { useSelectedLayoutSegment } from 'next/navigation';

export default function NotebookLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const segment = useSelectedLayoutSegment();
  // Cuando segment es 'notes' o 'settings', estamos en la vista de detalle
  const isDetailView = segment === 'notes' || segment === 'settings';

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-white dark:bg-neutral-950 overflow-hidden">
      
      {/* Columna Izquierda: Listado (Oculta en móvil si estamos viendo detalles) */}
      <div className={`w-full md:w-80 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-4 md:p-6 overflow-y-auto ${isDetailView ? 'hidden md:block' : 'block'}`}>
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/notebooks" 
            className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Link>
          <Link href={`/notebooks/${params.id}/settings`} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" title="Configuración de Libreta">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
        
        <NoteList notebookId={params.id} />
      </div>

      {/* Columna Derecha: Contenido Principal (Oculto en móvil si NO estamos en detalle) */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden ${!isDetailView ? 'hidden md:flex' : 'flex'}`}>
        {children}
      </div>
      
    </div>
  );
}
