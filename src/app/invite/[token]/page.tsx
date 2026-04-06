'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SupabaseMemberRepository } from '@/repositories/supabase/SupabaseMemberRepository';

const memberRepo = new SupabaseMemberRepository();

export default function InviteAcceptPage({ params }: { params: { token: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitationInfo, setInvitationInfo] = useState<{ title: string, role: string } | null>(null);
  const [accepting, setAccepting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar token sin aceptar
    memberRepo.getInvitationByToken(params.token)
      .then(inv => {
        if (!inv) {
          setError("Esta invitación es inválida, ha caducado o ya fue aceptada.");
        } else {
          setInvitationInfo({ title: inv.notebooks.title, role: inv.role });
        }
      })
      .catch(err => {
        if(err.message.includes("Debes iniciar sesión")) {
           router.push('/login?next=/invite/' + params.token);
        } else {
           setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [params.token, router]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const notebookId = await memberRepo.acceptInvitation(params.token);
      router.push(`/notebooks/${notebookId}`);
    } catch (err: any) {
      setError(err.message);
      setAccepting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Verificando invitación...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-lg shadow-sm text-center">
        
        {error ? (
          <div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">{error}</p>
            <button 
              onClick={() => router.push('/notebooks')}
              className="bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-800 text-sm"
            >
              Ir a mis libretas
            </button>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              👋
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2">Has sido invitado</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Fuiste invitado como <strong className="capitalize text-neutral-900 dark:text-white">{invitationInfo?.role}</strong> a la libreta <br/>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 mt-2 inline-block text-lg">"{invitationInfo?.title}"</span>
            </p>
            
            <button 
              onClick={handleAccept}
              disabled={accepting}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {accepting ? 'Aceptando entrar...' : 'Aceptar Invitación'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
