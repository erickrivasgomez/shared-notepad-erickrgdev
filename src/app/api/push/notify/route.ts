import { NextResponse } from 'next/server';
import webPush from 'web-push';
import { createClient } from '@/lib/supabase/server';

// Inicializar Web-Push con las claves seguras del entorno
webPush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@erickrg.dev',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const { message, notebookId } = await req.json();
    const supabase = createClient();

    // Traer todos los miembros de la nota que tengan notificaciones activas
    const { data: members } = await supabase
      .from('notebook_members')
      .select('user_id')
      .eq('notebook_id', notebookId);

    if (!members) return NextResponse.json({ success: true, count: 0 });

    const userIds = members.map((m: any) => m.user_id);

    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .in('user_id', userIds);

    let count = 0;
    if (subs && subs.length > 0) {
      for (const sub of subs) {
        try {
          await webPush.sendNotification(
            sub.subscription,
            JSON.stringify({
              title: 'Notas - Nueva Modificación',
              body: message,
              icon: '/icons/icon-192.png'
            })
          );
          count++;
        } catch (e: any) {
          // Si devuelve 410 es que el dispositivo desuscribió, podemos borrarlo si queremos.
          console.error("No se pudo enviar la push a un disp.", e);
        }
      }
    }

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
