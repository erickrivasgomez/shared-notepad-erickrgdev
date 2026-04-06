import webPush from 'web-push';

const vapidKeys = webPush.generateVAPIDKeys();

console.log('\n=== VAPID KEYS GENERADAS ===');
console.log('NEXT_PUBLIC_VAPID_PUBLIC_KEY=' + vapidKeys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + vapidKeys.privateKey);
console.log('============================\n');
console.log('Copia estas líneas a tu .env.local y a las variables de entorno de Vercel.');
