// app/account/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { getToken, removeToken } from '@/lib/auth';

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      removeToken();
      localStorage.removeItem('user');
      router.push('/login');
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('user');
    toast.success('Sesión cerrada correctamente');
    router.push('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-planthia-cream/30 flex items-center justify-center">
        <p className="text-planthia-dark/40">Cargando...</p>
      </main>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <main className="min-h-screen bg-planthia-cream/30 font-body text-planthia-dark p-6">
      <div className="max-w-4xl mx-auto pt-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-planthia-dark/40 hover:text-planthia-green transition-colors mb-4 text-sm font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Volver a la tienda
            </button>
            <h1 className="text-4xl font-headline font-extrabold text-planthia-dark">
              Hola, {user.first_name || user.username} 🌱
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center text-red-500/70 hover:text-red-500 font-bold text-sm uppercase tracking-wider transition-colors"
          >
            Cerrar sesión <LogOut className="ml-2 w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Perfil */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-planthia-dark/5">
              <div className="bg-planthia-green/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                <User className="text-planthia-green w-6 h-6" />
              </div>
              <h2 className="font-headline font-bold text-xl mb-4">Tu Perfil</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase font-bold text-planthia-dark/30">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <p className="text-[10px] uppercase font-bold text-planthia-dark/30">Teléfono</p>
                    <p className="text-sm font-medium">{user.phone}</p>
                  </div>
                )}
                {(user.address || user.city) && (
                  <div>
                    <p className="text-[10px] uppercase font-bold text-planthia-dark/30">Dirección</p>
                    <p className="text-sm font-medium">
                      {[user.address, user.city].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Órdenes */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-planthia-dark/5 min-h-[400px] flex flex-col items-center justify-center text-center">
              <div className="bg-planthia-cream w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Package className="text-planthia-dark/20 w-8 h-8" />
              </div>
              <h2 className="font-headline font-bold text-2xl mb-2">Tus pedidos</h2>
              <p className="text-planthia-dark/50 max-w-xs mx-auto">
                Próximamente vas a poder ver el historial detallado de tus compras y seguir tus envíos acá.
              </p>

              <div className="mt-8 pt-8 border-t border-planthia-dark/5 w-full">
                <p className="text-[10px] uppercase font-bold text-planthia-green tracking-widest">
                  Estamos trabajando en esta sección
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}