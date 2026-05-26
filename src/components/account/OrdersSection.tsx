'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePlants } from '@/hooks/usePlants';
import Image from 'next/image';
import Link from 'next/link';
import ProductCardShop from '@/components/products/ProductCardShop';
import { CheckCircle2, Truck } from 'lucide-react';

import OrderDetail, { OrderData } from './OrderDetail'; 

interface OrdersSectionProps {
  orders: OrderData[];
  user?: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    zip_code: string | null;
    email: string;
  };
}

const statusConfig = {
  pending: { label: 'Pendiente', styles: 'bg-amber-100 text-amber-800' },
  paid: { label: 'Pagado', styles: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'En camino', styles: 'bg-planthia-light-green/20 text-planthia-green' },
  delivered: { label: 'Entregado', styles: 'bg-planthia-dark/5 text-planthia-dark/70' },
  failure: { label: 'Fallido', styles: 'bg-red-100 text-red-600' },
};

export default function OrdersSection({ orders, user }: OrdersSectionProps) {
  const [productsToShow, setProductsToShow] = useState(4);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const { plants, loading: plantsLoading } = usePlants();

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
    if (!orders || orders.length === 0) return plants.slice(0, 4);

    try {
      const sortedOrders = [...orders].sort(
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
  }, [orders, plants]);

  if (selectedOrder) {
    return (
      <OrderDetail 
        order={selectedOrder} 
        user={user} 
        onBack={() => setSelectedOrder(null)} 
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl lg:text-2xl font-manrope text-planthia-dark">
          Mis Pedidos Recientes
        </h2>
        {orders && orders.length > 0 && (
          <button className="text-planthia-green font-bold text-sm hover:underline transition-all">
            Ver todo el historial
          </button>
        )}
      </div>

      {orders.length === 0 ? (
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
          {[...orders]
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

                  {/* SECCIÓN DINÁMICA DE BOTONES SEGÚN EL ESTADO */}
                  <div className="mt-6 flex gap-4">
                    {order.order_status === 'shipped' ? (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full py-4 border border-planthia-dark/10 rounded-xl font-bold text-sm bg-planthia-ice hover:bg-planthia-cream transition-colors flex items-center justify-center gap-2 text-planthia-dark shadow-sm cursor-pointer"
                      >
                        Rastrear paquete
                        <Truck size={16} />
                      </button>
                    ) : order.order_status === 'delivered' ? (
                      <>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 py-4 border border-planthia-dark/10 rounded-xl font-bold text-sm bg-planthia-ice hover:bg-planthia-cream transition-colors flex items-center justify-center text-planthia-dark shadow-sm cursor-pointer"
                        >
                          Detalles del pedido
                        </button>
                        <button className="flex-1 py-4 bg-planthia-green text-planthia-ice rounded-xl font-bold text-sm hover:bg-planthia-light-green transition-all shadow-sm">
                          Comprar de nuevo
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full py-4 border border-planthia-dark/10 rounded-xl font-bold text-sm bg-planthia-ice hover:bg-planthia-cream transition-colors flex items-center justify-center text-planthia-dark shadow-sm cursor-pointer"
                      >
                        Detalles del pedido
                      </button>
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
            {orders && orders.length > 0
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
  );
}