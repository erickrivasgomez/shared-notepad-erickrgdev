# Guía de Configuración de Entorno (Supabase y Vercel)

Esta guía te ayudará a obtener las variables requeridas para que la PWA funcione. Sigue los pasos desde tu navegador en el iPhone.

## 1. Supabase (Base de datos y Auth)

1. Ingresa a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto o crea uno nuevo.
3. Ve a **Settings** (ícono de engranaje) -> **API** en el menú izquierdo.
4. Encontrarás la URL bajo **Project URL**. Cópialo y úsalo para `NEXT_PUBLIC_SUPABASE_URL`.
5. En la misma página, bajo **Project API keys**, copia la llave marcada como **anon** y **public**. Usa esto para `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. Copia la llave marcada como **service_role**. Úsala para `SUPABASE_SERVICE_ROLE_KEY`.

## 2. Variables de Entorno PWA

- `NEXT_PUBLIC_APP_URL` debe ser `https://notas.erickrg.dev` (o tu URL de Vercel temporal mientras configuras el DNS).

## 3. Vercel

1. Ingresa a [https://vercel.com/dashboard](https://vercel.com/dashboard) y selecciona tu proyecto `notas`.
2. Ve a **Settings** -> **Environment Variables**.
3. Agrega las variables que viste y generaste en los pasos anteriores:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `VAPID_SUBJECT` (mailto:tu-email@gmail.com)
   - `NEXT_PUBLIC_APP_URL`

Una vez configuradas en Vercel y agregadas localmente a `.env.local`, confírmalo para proceder.
