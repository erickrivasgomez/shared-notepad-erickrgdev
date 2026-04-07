import Sidebar from '@/components/layout/Sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-background overflow-hidden relative">
      {/* Sidebar fijo a la izquierda (O Bottom Navbar en Móviles) */}
      <Sidebar />
      
      {/* Contenido principal de la aplicación */}
      {/* Padding bootom en móvil para hacer espacio a la navbar (16 = 4rem) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0 h-full">
        {children}
      </main>
    </div>
  );
}
