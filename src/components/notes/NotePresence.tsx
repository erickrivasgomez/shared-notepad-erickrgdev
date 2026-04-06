'use client';

import { usePresence } from '@/hooks/usePresence';

export default function NotePresence({ noteId }: { noteId: string }) {
  const { onlineUsers } = usePresence(noteId);

  if (onlineUsers.length === 0) return null;

  return (
    <div className="flex -space-x-2 overflow-hidden mb-4 items-center">
      <span className="text-xs text-neutral-400 mr-3">Editando ahora:</span>
      {onlineUsers.map((user) => (
        <div
          key={user.id}
          className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-neutral-950 flex items-center justify-center text-xs text-white font-bold"
          style={{ backgroundColor: user.avatar_color || '#6366f1' }}
          title={user.display_name || user.email || 'Miembro'}
        >
          {user.display_name ? user.display_name.charAt(0).toUpperCase() : 'U'}
        </div>
      ))}
    </div>
  );
}
