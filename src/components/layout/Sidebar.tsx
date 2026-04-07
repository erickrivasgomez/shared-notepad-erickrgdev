'use client';

import Link from 'next/link';
import { Book, CheckCircle, LogOut } from 'lucide-react';
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
    <aside className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full flex-row border-t border-neutral-200 bg-background dark:border-neutral-800 
                      md:relative md:w-64 md:flex-shrink-0 md:flex-col md:border-t-0 md:border-r md:min-h-screen">
      
      {/* Desktop Header */}
      <div className="hidden md:flex p-4 items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <span className="font-serif font-bold text-xl">Notas</span>
        <CheckCircle className="w-4 h-4 text-emerald-500" title="Sincronizado" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-row items-center justify-around px-2 md:flex-col md:justify-start md:py-4 md:space-y-1">
        <Link
          href="/notebooks"
          className={`flex flex-col md:flex-row items-center justify-center w-full md:w-auto px-1 py-1 md:px-3 md:py-2 text-[10px] md:text-sm font-medium rounded-md transition-colors ${
            pathname.startsWith('/notebooks')
              ? 'text-indigo-600 md:bg-neutral-100 md:dark:bg-neutral-800 md:text-neutral-900 md:dark:text-white'
              : 'text-neutral-500 md:text-neutral-600 md:dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white md:hover:bg-neutral-50 md:dark:hover:bg-neutral-900'
          }`}
        >
          <Book className="h-5 w-5 mb-1 md:mb-0 md:mr-3 flex-shrink-0" />
          <span>Libretas</span>
        </Link>
      </nav>

      {/* Desktop/Mobile Logout Footer */}
      <div className="flex md:border-t border-neutral-200 dark:border-neutral-800 p-2 md:p-4 justify-center md:justify-start w-20 md:w-full">
        <button
          onClick={handleSignOut}
          className="flex flex-col md:flex-row w-full items-center justify-center md:justify-start px-1 py-1 md:px-3 md:py-2 text-[10px] md:text-sm font-medium rounded-md text-red-500 hover:text-red-600 md:hover:bg-red-50 md:dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="h-5 w-5 mb-1 md:mb-0 md:mr-3 flex-shrink-0" />
          <span>Salir</span>
        </button>
      </div>

    </aside>
  );
}
