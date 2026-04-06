'use client';

import Link from 'next/link';
import { Book, CheckCircle, LogOut, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-background flex flex-col min-h-screen">
      <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <span className="font-serif font-bold text-xl">Notas</span>
        <div className="flex items-center space-x-2">
          {/* Aquí iría el componente de SyncStatus después */}
          <CheckCircle className="w-4 h-4 text-emerald-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          <Link
            href="/notebooks"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              pathname.startsWith('/notebooks')
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Book className="mr-3 h-5 w-5 flex-shrink-0" />
            Libretas
          </Link>
          {/* Aquí listaremos los notebooks en el futuro si lo deseamos */}
        </nav>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
