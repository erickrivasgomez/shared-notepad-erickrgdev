import NoteList from '@/components/notes/NoteList';
import Link from 'next/link';
import { ArrowLeft, Settings } from 'lucide-react';

export default function NotebookLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className="flex-1 flex bg-white dark:bg-neutral-950 overflow-hidden">
      {/* Columna Izquierda: Listado de Notas en la Libreta */}
      <div className="w-80 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/notebooks" 
            className="inline-flex items-center text-sm text-neutral-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Link>
          <Link href={`/notebooks/${params.id}/settings`} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white" title="Configuración de Libreta">
            <Settings className="w-4 h-4" />
          </Link>
        </div>
        
        <NoteList notebookId={params.id} />
      </div>

      {/* Editor Principal (Children: página o nota elegida) */}
      <div className="flex-1 overflow-auto bg-white dark:bg-neutral-950 flex flex-col">
        {children}
      </div>
    </div>
  );
}
