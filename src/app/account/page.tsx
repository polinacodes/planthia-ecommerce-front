'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OrdersSection from '@/components/account/OrdersSection';
import {
  Package,
  User,
  MapPin,
  Heart,
  Pencil
} from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  productId?: string;
}

interface OrderData {
  id: number;
  total: number;
  subtotal: number;
  shipping_cost: number;
  order_status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'failure';
  items: OrderItem[];
  payment_id: string;
  payment_method: string;
  createdAt: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  zip_code: string | null;
  orders?: OrderData[];
  favorites?: any[];
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/';
        return;
      }

      try {
        const userResponse = await fetch('http://localhost:1337/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!userResponse.ok) {
          localStorage.removeItem('token');
          window.location.href = '/';
          return;
        }

        const userData = await userResponse.json();

        const ordersResponse = await fetch('http://localhost:1337/api/orders/my-orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (ordersResponse.ok) {
          const ordersJson = await ordersResponse.json();
          setUser({
            ...userData,
            orders: ordersJson.data || []
          });
        } else {
          setUser({ ...userData, orders: [] });
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-planthia-cream flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-planthia-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen bg-planthia-cream text-planthia-dark">

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-planthia-ice shadow-sm relative bg-planthia-light-green/10 flex items-center justify-center">
            <User
              size={64}
              className="text-planthia-green opacity-40"
              strokeWidth={1.5}
            />
          </div>
          <button className="absolute bottom-0 right-0 bg-planthia-green text-planthia-ice p-2 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
            <Pencil size={16} />
          </button>
        </div>

        <div className="text-center md:text-left">
          <h1 className="font-headline font-extrabold text-4xl tracking-tight text-planthia-dark capitalize">
            Hola, {user.first_name || user.username}
          </h1>
          <p className="text-planthia-dark/60 mt-2 font-body italic text-sm">
            Miembro desde {memberSince} • {user.favorites && user.favorites.length > 0
              ? `Cuidadora de ${user.favorites.length} ${user.favorites.length === 1 ? 'planta' : 'plantas'} favoritas`
              : 'Explorando la tienda'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3">
          <nav className="space-y-2 flex flex-col">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer font-bold transition-all duration-300 group ${activeTab === 'orders' 
                ? 'text-planthia-green bg-planthia-light-green/10'
                : 'text-planthia-dark/70 hover:bg-planthia-ice/50'
                }`}
            >
              <Package size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-headline tracking-wide text-sm">Mis Pedidos</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer font-bold transition-all duration-300 group ${activeTab === 'profile'
                ? 'text-planthia-green bg-planthia-light-green/10'
                : 'text-planthia-dark/70 hover:bg-planthia-ice/50'
                }`}
            >
              <User size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-headline tracking-wide text-sm">Información Personal</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer font-bold transition-all duration-300 group ${activeTab === 'addresses'
                ? 'text-planthia-green bg-planthia-light-green/10'
                : 'text-planthia-dark/70 hover:bg-planthia-ice/50'
                }`}
            >
              <MapPin size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-headline tracking-wide text-sm">Direcciones</span>
            </button>

            <Link
              href="/wishlist"
              className="flex items-center gap-4 px-6 py-4 rounded-xl font-bold text-planthia-dark/70 hover:bg-planthia-ice/50 transition-all duration-300 group"
            >
              <Heart size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-headline tracking-wide text-sm">Favoritos</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="lg:col-span-9 space-y-8">
          {activeTab === 'orders' && (
            <OrdersSection orders={user.orders || []} user={user} />
          )}

          {activeTab === 'profile' && (
            <div className="bg-planthia-ice rounded-3xl p-8 border border-planthia-dark/5">
              <h2 className="font-headline font-bold text-2xl mb-4">Información Personal</h2>
              <p className="text-sm text-planthia-dark/60">Sección en desarrollo para editar datos de la cuenta.</p>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="bg-planthia-ice rounded-3xl p-8 border border-planthia-dark/5">
              <h2 className="font-headline font-bold text-2xl mb-4">Mis Direcciones</h2>
              <p className="text-sm text-planthia-dark/60">Sección en desarrollo para gestionar direcciones de envío.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}