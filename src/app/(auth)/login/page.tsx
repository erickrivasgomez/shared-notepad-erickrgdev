import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-serif">Notas</h1>
          <p className="text-muted-foreground mt-2 text-sm">Inicia sesión en tu cuenta</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
