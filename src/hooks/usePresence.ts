'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/app.types';

export function usePresence(noteId: string) {
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!noteId) return;

    let userProfile: Profile | null = null;

    const setupPresence = async () => {
      // Obtener el perfil local para transmitir su avatar y nombre
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
        userProfile = profile;
      }

      const channel = supabase.channel(`presence:note:${noteId}`, {
        config: {
          presence: {
            key: authData.user?.id || 'anonymous',
          },
        },
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const newState = channel.presenceState();
          const users: Profile[] = [];
          
          for (const id in newState) {
            // @ts-ignore
            const profiles = newState[id].map(p => p.profile).filter(Boolean);
            users.push(...profiles);
          }
          
          // Filtrar mi propio perfil
          const others = users.filter(u => u.id !== authData.user?.id);
          // Dedup (por si un usuario tiene múltiples pestañas)
          const uniqueOthers = Array.from(new Map(others.map(item => [item.id, item])).values());
          
          setOnlineUsers(uniqueOthers);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && userProfile) {
            await channel.track({ profile: userProfile });
          }
        });
    };

    setupPresence();

    return () => {
      supabase.removeChannel(supabase.channel(`presence:note:${noteId}`));
    };
  }, [noteId]);

  return { onlineUsers };
}
