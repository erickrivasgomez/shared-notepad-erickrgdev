'use client';

import { useState, useEffect } from 'react';

// Llave pública base64 que expone NodeJS y Vercel
const NEXT_PUBLIC_VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(Boolean(subscription));
        }
      }
    }
    checkSubscription();
  }, []);

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
      alert("Tu navegador no soporta web push.");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // Solicitar suscripción desde el navegador
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      });

      // Guardarlo en BD a través de nuestro Endpoint de Backend
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      setIsSubscribed(true);
      alert("✅ ¡Dispositivo suscrito exitosamente a notificaciones!");
    } catch (e) {
      console.error("Error al suscribirse:", e);
      alert("No se pudo suscribir a notificaciones.");
    }
  };

  return { isSubscribed, subscribeToPush };
}
