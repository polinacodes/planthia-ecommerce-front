'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { OrderData as DetailOrder } from '@/components/account/OrderDetail';
import OrdersSection, { statusConfig } from '@/components/account/OrdersSection';
import ProfileSection from '@/components/account/ProfileSection';
import RecommendedProducts from '@/components/account/RecommendedProducts'; // <-- Importamos el nuevo componente

import { Package, User, MapPin, Heart, Pencil, ArrowLeft } from 'lucide-react';

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
  const [selectedOrder, setSelectedOrder] = useState<DetailOrder | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // /account?tab=perfil abre directo la pestaña del perfil (la usa el footer)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('tab') === 'perfil') setActiveTab('profile');
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!userResponse.ok) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }

        const userData = await userResponse.json();

        const ordersResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/my-orders`, {
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
        <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-planthia-ice shadow-sm relative bg-planthia-light-green/10 flex items-center justify-center">
            <User
              size={64}
              className="text-planthia-green opacity-40"
              strokeWidth={1.5}
            />
          </div>
          <button className="absolute cursor-pointer bottom-0 right-0 bg-planthia-green text-planthia-ice p-2 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
            <Pencil size={16} />
          </button>
        </div>

        <div className="text-center md:text-left">
          <h1 className="font-headline font-extrabold text-4xl tracking-tight text-planthia-dark capitalize">
            {/* Sin nombre cargado, un saludo genérico (el username es el email) */}
            {user.first_name ? `Hola, ${user.first_name}` : '¡Hola!'}
          </h1>
          <p className="text-planthia-dark/60 mt-2 font-body text-sm">
            Miembro desde {memberSince}
          </p>
        </div>
        </div>

        {/* Pedido abierto: número, fecha y estado a la altura del saludo (en celular va dentro del detalle) */}
        {activeTab === 'orders' && selectedOrder && (
          <div className="hidden lg:block ml-auto text-right">
            <p className="font-headline font-extrabold text-2xl text-planthia-dark">Pedido #PL-{selectedOrder.id}</p>
            <p className="text-sm text-planthia-dark/60 mt-1.5 flex items-center justify-end gap-2">
              {new Date(selectedOrder.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusConfig[selectedOrder.order_status]?.styles ?? ''}`}>
                {statusConfig[selectedOrder.order_status]?.label ?? selectedOrder.order_status}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3">
          <nav className="space-y-2 flex flex-col">
            <button
              onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer font-bold transition-all duration-300 group ${activeTab === 'orders'
                ? 'text-planthia-green bg-planthia-light-green/10'
                : 'text-planthia-dark/70 hover:bg-planthia-ice/50'
                }`}
            >
              <Package size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-headline tracking-wide text-sm">Mis pedidos</span>
            </button>

            {/* Pedido abierto: muestra dónde estás; volver = tocar "Mis pedidos" */}
            {activeTab === 'orders' && selectedOrder && (
              <button
                onClick={() => setSelectedOrder(null)}
                className="hidden lg:flex items-center gap-2 ml-6 -mt-1 pl-4 py-2 border-l-2 border-planthia-green text-sm font-semibold text-planthia-green hover:text-planthia-green-dark cursor-pointer w-fit"
              >
                <ArrowLeft size={14} />
                #PL-{selectedOrder.id}
              </button>
            )}

            <button
              onClick={() => { setActiveTab('profile'); setSelectedOrder(null); }}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer font-bold transition-all duration-300 group ${activeTab === 'profile'
                ? 'text-planthia-green bg-planthia-light-green/10'
                : 'text-planthia-dark/70 hover:bg-planthia-ice/50'
                }`}
            >
              <User size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-headline tracking-wide text-sm">Información personal</span>
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
            <OrdersSection
              orders={user.orders || []}
              user={user}
              selectedOrder={selectedOrder}
              onSelectOrder={setSelectedOrder}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileSection
              user={user}
              onUserUpdate={(updatedData) => {
                setUser((prev) => prev ? { ...prev, ...updatedData } : null);
              }}
            />
          )}
        </section>
      </div>

      <RecommendedProducts orders={user.orders || []} />

    </main>
  );
}