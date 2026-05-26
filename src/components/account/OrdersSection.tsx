'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePlants } from '@/hooks/usePlants';
import Image from 'next/image';
import Link from 'next/link';
import ProductCardShop from '@/components/products/ProductCardShop';
import { motion } from 'framer-motion'; 
import {
  Truck,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  MapPin,
  Calendar
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

    if (!orders || orders.length === 0) {
      return plants.slice(0, 4);
    }

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

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'paid': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  // --- VISTA DE DETALLE DEL PEDIDO ---
  if (selectedOrder) {
    const itemsArray = Array.isArray(selectedOrder.items) ? selectedOrder.items : [];
    const currentStep = getStepIndex(selectedOrder.order_status);

    const steps = [
      { label: 'Pagado' },
      { label: 'En preparación' },
      { label: 'En camino' },
      { label: 'Entregado' }
    ];

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Cabecera del Detalle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-planthia-dark/5 pb-6">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-sm font-bold text-planthia-green/70 hover:text-planthia-green transition-colors group w-fit cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Volver a mis pedidos
          </button>
          <div className="text-left sm:text-right">
            <p className="text-[12px] font-bold uppercase tracking-widest text-planthia-green">
              Pedido #PL-{selectedOrder.payment_id ? selectedOrder.payment_id.slice(-4).toUpperCase() : selectedOrder.id}
            </p>
            <p className="text-xs text-planthia-dark/60 flex items-center gap-1 sm:justify-end mt-1">
              <Calendar size={14} />
              Compra realizada el {new Date(selectedOrder.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Banner destacado si está Shipped / En camino */}
        {selectedOrder.order_status === 'shipped' && (
          <div className="bg-planthia-light-green/10 border border-planthia-green/20 rounded-2xl p-4 flex items-center gap-4 text-planthia-green">
            <div className="bg-planthia-green text-planthia-ice p-2.5 rounded-xl">
              <Truck size={20} />
            </div>
            <div>
              <h5 className="font-bold text-sm">¡Tu pedido está en camino!</h5>
              <p className="text-xs text-planthia-dark/70 mt-0.5">Estimamos que llega mañana a tu dirección de entrega.</p>
            </div>
          </div>
        )}

        {/* Línea de Progreso Dinámica */}
        <div className="bg-planthia-ice/40 border border-planthia-dark/5 rounded-3xl p-4 sm:p-6 lg:p-8 overflow-hidden">
          <div className="relative flex justify-between items-start max-w-3xl mx-auto">
            <div className="absolute left-[12.5%] right-[12.5%] top-4 h-1 z-0">
              <div className="absolute inset-0 bg-planthia-dark/10 rounded-full" />
              <motion.div
                className="absolute left-0 top-0 h-full bg-planthia-green rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </div>

            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStep;
              const isActive = idx === currentStep;

              return (
                <div key={idx} className="flex flex-col items-center flex-1 text-center relative z-10 min-w-0 px-1">
                  <div className="relative flex items-center justify-center h-8 w-8 flex-shrink-0">
                    {isActive && selectedOrder.order_status !== 'delivered' && (
                      <motion.div
                        className="absolute w-8 h-8 rounded-full bg-planthia-green/30 z-0"
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.6,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={
                        isActive && selectedOrder.order_status !== 'delivered'
                          ? { scale: [1.1, 1.24, 1.1] }
                          : isCompleted
                            ? { scale: 1.1 }
                            : { scale: 1 }
                      }
                      transition={
                        isActive && selectedOrder.order_status !== 'delivered'
                          ? {
                            repeat: Infinity,
                            duration: 1.6,
                            ease: "easeInOut"
                          }
                          : {
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                            delay: idx * 0.15
                          }
                      }
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs relative z-10 transition-colors duration-500 flex-shrink-0 ${isCompleted
                          ? 'bg-planthia-green text-planthia-ice shadow-sm'
                          : 'bg-white border-2 border-planthia-dark/20 text-planthia-dark/40'
                        }`}
                    >
                      {idx === 3 && isCompleted ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 12, delay: idx * 0.15 + 0.2 }}
                        >
                          <CheckCircle2 size={16} />
                        </motion.div>
                      ) : (
                        idx + 1
                      )}
                    </motion.div>
                  </div>
                  <motion.span
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: isCompleted ? 1 : 0.4 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className={`text-[10px] sm:text-xs font-headline font-bold mt-3 block break-words w-full ${isCompleted ? 'text-planthia-dark' : 'text-planthia-dark/40'
                      }`}
                  >
                    {step.label}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cuerpo Principal del Detalle*/}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Columna Izquierda: Lista de Productos */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-headline font-bold text-lg text-planthia-dark flex items-center gap-2">
              <ShoppingBag size={18} className="text-planthia-green" />
              Productos en este pedido
            </h3>

            <div className="border border-planthia-dark/5 bg-white rounded-3xl divide-y divide-planthia-dark/5 overflow-hidden">
              {itemsArray.map((item, idx) => (
                <div key={`${item.id || item.productId}-${idx}`} className="p-6 flex gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-planthia-cream flex-shrink-0 border border-planthia-dark/5">
                      <Image
                        alt={item.name}
                        src={item.image || "/products/placeholder.webp"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-headline uppercase font-bold text-sm text-planthia-dark">{item.name}</h4>
                      <p className="text-xs text-planthia-dark/60 mt-0.5">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-bold text-sm text-planthia-dark">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-planthia-dark/40 mt-0.5">${Number(item.price).toFixed(2)} c/u</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Envío, Facturación y Costos */}
          <div className="lg:col-span-4 space-y-6">

            {/* Datos de Entrega */}
            <div className="bg-planthia-ice/30 border border-planthia-dark/5 rounded-3xl p-6 space-y-4">
              <h4 className="font-headline font-bold text-sm text-planthia-dark flex items-center gap-2 border-b border-planthia-dark/5 pb-3">
                <MapPin size={16} className="text-planthia-green" />
                Datos de Envío y Facturación
              </h4>
              <div className="text-xs space-y-2 text-planthia-dark/80">
                <p className="font-bold text-planthia-dark capitalize">
                  {user?.first_name || user?.last_name ? `${user.first_name || ''} ${user.last_name || ''}` : 'Cliente Planthia'}
                </p>
                <p className="capitalize leading-relaxed">{user?.address || 'Dirección no especificada'}</p>
                <p className="capitalize">{user?.city ? `${user.city}` : ''} {user?.zip_code ? `(${user.zip_code})` : ''}</p>
                {user?.phone && <p className="text-planthia-dark/60 pt-1">Tel: {user.phone}</p>}
                <p className="text-planthia-dark/60">Email: {user?.email}</p>
              </div>
            </div>

            {/* Resumen del Pago */}
            <div className="bg-planthia-ice/30 border border-planthia-dark/5 rounded-3xl p-6 space-y-3 text-sm">
              <h4 className="font-headline font-bold text-sm text-planthia-dark flex items-center gap-2 border-b border-planthia-dark/5 pb-3">
                <CreditCard size={16} className="text-planthia-green" />
                Resumen de Pago
              </h4>
              <div className="flex justify-between text-xs text-planthia-dark/70 pt-1">
                <span>Subtotal</span>
                <span>${Number(selectedOrder.subtotal || selectedOrder.total - (selectedOrder.shipping_cost || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-planthia-dark/70">
                <span>Costo de envío</span>
                <span>{selectedOrder.shipping_cost > 0 ? `$${Number(selectedOrder.shipping_cost).toFixed(2)}` : 'Gratis'}</span>
              </div>
              <div className="flex justify-between text-xs text-planthia-dark/60  pb-2">
                <span>Método</span>
                <span><span className="capitalize">{selectedOrder.payment_method || 'Tarjeta'}</span></span>
              </div>
              <div className="flex justify-between font-headline font-extrabold text-base text-planthia-dark border-t border-planthia-dark/5 pt-3">
                <span>Total</span>
                <span>${Number(selectedOrder.total).toFixed(2)}</span>
              </div>

              {/* Botón Comprar de nuevo exclusivo para pedidos entregados */}
              {selectedOrder.order_status === 'delivered' && (
                <button className="w-full mt-4 py-3 bg-planthia-green text-planthia-ice rounded-xl font-bold text-xs hover:bg-planthia-light-green transition-all shadow-sm">
                  Comprar todo de nuevo
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // --- VISTA PRINCIPAL: LISTADO DE PEDIDOS ---
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

                  <div className="mt-6 flex gap-4">
                    {order.order_status === 'shipped' ? (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full py-4 border border-planthia-dark/10 rounded-xl font-bold text-sm bg-planthia-ice hover:bg-planthia-cream transition-colors flex items-center justify-center gap-2 text-planthia-dark shadow-sm cursor-pointer"
                      >
                        Rastrear paquete
                        <Truck size={16} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 py-4 bg-planthia-cream rounded-xl font-bold text-sm hover:bg-planthia-dark/5 transition-colors text-planthia-dark cursor-pointer"
                        >
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