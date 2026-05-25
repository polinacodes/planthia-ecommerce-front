'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePlants } from '@/hooks/usePlants';
import Image from 'next/image';
import Link from 'next/link';
import ProductCardShop from '@/components/products/ProductCardShop';
import {
  Package,
  User,
  MapPin,
  Heart,
  LogOut,
  Pencil,
  Truck,
  CheckCircle2
} from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  productId?: string
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

const statusConfig = {
  pending: { label: 'Pendiente', styles: 'bg-amber-100 text-amber-800' },
  paid: { label: 'Pagado', styles: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'En camino', styles: 'bg-planthia-light-green/20 text-planthia-green' },
  delivered: { label: 'Entregado', styles: 'bg-planthia-dark/5 text-planthia-dark/70' },
  failure: { label: 'Fallido', styles: 'bg-red-100 text-red-600' },
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [productsToShow, setProductsToShow] = useState(4);

  const { plants, loading: plantsLoading } = usePlants();

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

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setProductsToShow(4);        
      else if (width < 1280) setProductsToShow(3);  
      else setProductsToShow(4);                    
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const recommendedProducts = useMemo(() => {
    if (!plants || plants.length === 0) return [];

    if (!user?.orders || user.orders.length === 0) {
      return plants.slice(0, 4);
    }

    try {
      const sortedOrders = [...user.orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const latestOrder = sortedOrders[0];
      const itemsArray = Array.isArray(latestOrder.items) ? latestOrder.items : [];

      if (itemsArray.length === 0) return plants.slice(0, 4);

      const lastPurchasedId = (itemsArray[0].productId || itemsArray[0].id || '').toString().split('-')[0];
      const lastPurchasedPlant = plants.find(p => p.id.toString() === lastPurchasedId);

      if (!lastPurchasedPlant || !lastPurchasedPlant.subcategory) {
        return plants.slice(0, 4);
      }

      const currentSub = lastPurchasedPlant.subcategory.name;

      const filtered = plants.filter(
        p => p.subcategory?.name === currentSub && p.id.toString() !== lastPurchasedId
      );

      if (filtered.length < 4) {
        const extra = plants.filter(p => p.id.toString() !== lastPurchasedId && p.subcategory?.name !== currentSub);
        return [...filtered, ...extra].slice(0, 4);
      }

      return filtered.slice(0, 4);
    } catch (error) {
      console.error("Error calculando recomendados:", error);
      return plants.slice(0, 4);
    }
  }, [user?.orders, plants]);

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
            <>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl lg:text-2xl font-manrope text-planthia-dark">
                  Mis Pedidos Recientes
                </h2>
                {user.orders && user.orders.length > 0 && (
                  <button className="text-planthia-green font-bold text-sm hover:underline transition-all">
                    Ver todo el historial
                  </button>
                )}
              </div>

              {!user.orders || user.orders.length === 0 ? (
                <div className="bg-planthia-ice/40 border border-dashed border-planthia-dark/10 rounded-3xl p-12 text-center">
                  <p className="text-planthia-dark/60 font-body mb-4">
                    Aún no has realizado ningún pedido en Planthia.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block bg-planthia-green text-planthia-ice px-6 py-3 rounded-full font-bold text-sm hover:bg-planthia-light-green transition-all shadow-sm"
                  >
                    Explorar Colección
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {user.orders
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((order) => {
                      const itemsArray = Array.isArray(order.items) ? order.items : [];
                      const firstItem = itemsArray[0];
                      const extraItemsCount = itemsArray.length - 1;
                      const currentStatus = statusConfig[order.order_status] || statusConfig.pending;

                      return (
                        <div
                          key={order.id}
                          className="group relative bg-planthia-ice/60 backdrop-blur-md rounded-3xl p-8 transition-all duration-500 hover:bg-planthia-ice border border-planthia-dark/5 shadow-sm"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex gap-6 items-center">
                              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-planthia-cream flex-shrink-0">
                                <Image
                                  alt={firstItem?.name || "Producto Planthia"}
                                  src={firstItem?.image || "/products/placeholder.webp"}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {extraItemsCount > 0 && (
                                  <div className="absolute top-1 right-1 bg-white/80 backdrop-blur-md rounded-lg px-2 py-1 text-[10px] font-bold text-planthia-green shadow-sm">
                                    +{extraItemsCount}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-planthia-dark/40 mb-1">
                                  Pedido #PL-{order.payment_id ? order.payment_id.slice(-4).toUpperCase() : order.id}
                                </p>
                                <h4 className="font-headline text-lg font-bold text-planthia-dark">
                                  {firstItem?.name || "Pedido Especial"} {extraItemsCount > 0 ? ' y otros' : ''}
                                </h4>
                                <p className="text-sm text-planthia-dark/60">
                                  Realizado el {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2">
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${currentStatus.styles}`}>
                                {order.order_status === 'shipped' && <span className="w-2 h-2 bg-planthia-green rounded-full animate-pulse"></span>}
                                {order.order_status === 'delivered' && <CheckCircle2 size={14} className="text-planthia-green" />}
                                {currentStatus.label}
                              </span>
                              <p className="font-headline font-extrabold text-xl text-planthia-dark">
                                ${Number(order.total).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 flex gap-4">
                            {order.order_status === 'shipped' ? (
                              <button className="w-full py-4 border border-planthia-dark/10 rounded-xl font-bold text-sm bg-planthia-ice hover:bg-planthia-cream transition-colors flex items-center justify-center gap-2 text-planthia-dark shadow-sm">
                                Rastrear paquete
                                <Truck size={16} />
                              </button>
                            ) : (
                              <>
                                <button className="flex-1 py-4 bg-planthia-cream rounded-xl font-bold text-sm hover:bg-planthia-dark/5 transition-colors text-planthia-dark">
                                  Detalles del pedido
                                </button>
                                <button className="flex-1 py-4 bg-planthia-green text-planthia-ice rounded-xl font-bold text-sm hover:bg-planthia-light-green transition-all shadow-sm">
                                  Comprar de nuevo
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* SECCIÓN RECOMENDADOS */}
              {recommendedProducts.length > 0 && (
                <section className="mt-20 lg:mt-32 pb-16 border-t border-planthia-dark/5 pt-16 lg:pt-16">
                  <h2 className="text-2xl lg:text-2xl font-manrope text-planthia-dark mb-8 lg:mb-12">
                    {user.orders && user.orders.length > 0
                      ? "Basado en tu última compra"
                      : "Recomendados para tu jardín"}
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {recommendedProducts.slice(0, productsToShow).map((item: any) => (
                      <ProductCardShop key={item.id} product={item} />
                    ))}
                  </div>
                </section>
              )}
            </>
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