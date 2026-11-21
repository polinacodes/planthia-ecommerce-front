'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { CheckCircle2, Truck } from 'lucide-react';
import OrderDetail, { OrderData, OrderItem } from './OrderDetail';

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
  failure: { label: 'Cancelado', styles: 'bg-red-100 text-red-600' },
};

export default function OrdersSection({ orders, user }: OrdersSectionProps) {
  const [visibleOrdersCount, setVisibleOrdersCount] = useState(3);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  const router = useRouter();
  const { addItem, updateQuantity } = useCart();

  const formatPrice = (value: number) => Math.round(value).toLocaleString('es-AR');

  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders]);

  const displayedOrders = useMemo(() => {
    return sortedOrders.slice(0, visibleOrdersCount);
  }, [sortedOrders, visibleOrdersCount]);

  /**
   * "Volver a comprar": busca cada producto con su precio y stock ACTUALES y
   * lo agrega al carrito con el mismo color. Usa el documentId (fijo); los
   * pedidos viejos que no lo tienen se buscan por el id numérico.
   */
  const handleBuyAgain = async (items: OrderItem[]) => {
    const toastId = toast.loading("Verificando stock y precios actuales...");
    let atLeastOneAdded = false;
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

    try {
      for (const item of items) {
        // Pedidos viejos guardaban "123" o "123-color" en productId
        const [legacyId, ...legacyColor] = String(item.productId ?? item.id ?? '').split('-');
        const color = (item.color || legacyColor.join('-') || '').toLowerCase() || null;

        const filter = item.documentId
          ? `filters[documentId][$eq]=${encodeURIComponent(item.documentId)}`
          : `filters[id][$eq]=${encodeURIComponent(legacyId)}`;
        const res = await fetch(`${strapiUrl}/api/products?${filter}&populate=variants`);
        if (!res.ok) continue;

        const json = await res.json();
        const currentProduct = json.data?.[0];
        if (!currentProduct) {
          toast.error(`"${item.name}" ya no está disponible.`, { id: toastId });
          continue;
        }

        const variant = color
          ? ((currentProduct.variants || []) as { color?: string; stock?: number; image?: string }[]).find(
              (v) => (v.color || '').toLowerCase() === color
            )
          : null;

        if (color && !variant) {
          toast.error(`"${item.name}" ya no está disponible en ese color.`, { id: toastId });
          continue;
        }

        const currentStock = variant ? Number(variant.stock) || 0 : Number(currentProduct.stock) || 0;
        if (currentStock <= 0) {
          toast.error(`"${currentProduct.name}" no se agregó por falta de stock.`, { id: toastId });
          continue;
        }

        const productToCart = {
          id: variant ? `${currentProduct.id}-${color}` : String(currentProduct.id),
          documentId: currentProduct.documentId,
          name: currentProduct.name,
          color: variant?.color,
          price: currentProduct.price,
          image: variant?.image || currentProduct.image || item.image,
          stock: currentStock,
          quantity: 1,
        };

        addItem(productToCart);
        if (item.quantity > 1) {
          // updateQuantity respeta el stock disponible
          updateQuantity(productToCart.id, item.quantity);
        }

        atLeastOneAdded = true;
      }

      if (atLeastOneAdded) {
        toast.success("Productos añadidos al carrito", { id: toastId });
        router.push('/checkout');
      } else {
        toast.error("No se pudo añadir ningún producto. Verificá el stock o los permisos de Strapi.", { id: toastId });
      }

    } catch (error) {
      console.error("Error al re-comprar pedido:", error);
      toast.error("Ocurrió un error al procesar la compra de nuevo.", { id: toastId });
    }
  };

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        user={user}
        onBack={() => setSelectedOrder(null)}
        onBuyAgain={handleBuyAgain}
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline font-bold text-2xl text-planthia-dark">
          Mis Pedidos Recientes
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="bg-planthia-ice/40 border border-dashed border-planthia-dark/10 rounded-3xl p-12 text-center">
          <p className="text-planthia-dark/60 font-body mb-4">
            Aún no has realizado ningún pedido en Planthia.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-planthia-green text-planthia-ice px-6 py-3 rounded-full font-headline font-bold text-sm hover:bg-planthia-green-dark transition-colors shadow-sm"
          >
            Explorar Colección
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6">
            {displayedOrders.map((order) => {
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
                          Pedido #PL-{order.id}
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
                        ${formatPrice(Number(order.total))}
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
                    ) : order.order_status === 'delivered' ? (
                      <>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 py-4 border border-planthia-dark/10 rounded-xl font-bold text-sm bg-planthia-ice hover:bg-planthia-cream transition-colors flex items-center justify-center text-planthia-dark shadow-sm cursor-pointer"
                        >
                          Detalles del pedido
                        </button>
                        {/* Conectamos la función acá */}
                        <button
                          onClick={() => handleBuyAgain(itemsArray)}
                          className="flex-1 py-4 bg-planthia-green text-planthia-ice rounded-full font-headline font-bold text-sm hover:bg-planthia-green-dark transition-colors shadow-sm cursor-pointer"
                        >
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

          {visibleOrdersCount < sortedOrders.length && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => setVisibleOrdersCount((prev) => prev + 3)}
                className="bg-planthia-green text-planthia-ice px-8 py-3.5 rounded-full font-headline font-bold text-sm hover:bg-planthia-green-dark transition-colors shadow-sm cursor-pointer tracking-wide"
              >
                Ver más
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}