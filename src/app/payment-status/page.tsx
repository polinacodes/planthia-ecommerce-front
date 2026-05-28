'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { CheckCircle, AlertCircle, ArrowRight, Home, ShoppingBag } from 'lucide-react';

function PaymentStatusContent() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const paymentId = searchParams.get('payment_id') || searchParams.get('preference_id');
  const status = searchParams.get('status');

  const orderNumber = paymentId ? `#PL-${paymentId.toString().slice(-5)}` : '82931';

  const isError = status === 'failure';

  useEffect(() => {
  const handlePaymentSuccess = async () => {
    if (status === 'approved' || status === 'success') {
      const orderId = searchParams.get('order');

      if (orderId) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_status: 'paid' })
          });
        } catch (error) {
          console.error('❌ Error actualizando orden:', error);
        }
      }
      setTimeout(() => {
        clearCart();
        console.log("✅ Carrito limpiado");
      }, 300);
    }
  };

  handlePaymentSuccess();
}, [status, clearCart, searchParams]);

  const statusConfig = {
    success: {
      icon: CheckCircle,
      iconColor: "text-planthia-green",
      bgColor: "bg-planthia-green/10",
      title: "¡Pago exitoso!",
      message: "Gracias por tu compra. Te enviamos un correo con los detalles de envío.",
      buttonText: "Mi cuenta"
    },
    error: {
      icon: AlertCircle,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10",
      title: "Hubo un problema",
      message: "No pudimos procesar tu pago. Podés intentar nuevamente desde el checkout.",
      buttonText: "Volver al checkout"
    },

  };

  const current = isError ? statusConfig.error : statusConfig.success;
  const Icon = current.icon;

  return (
    <main className="min-h-screen bg-planthia-gradient font-body text-planthia-dark flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-10 z-10 flex flex-col items-center text-center">

        <div className={`${current.bgColor} p-4 rounded-full mb-6`}>
          <Icon className={`w-16 h-16 ${current.iconColor}`} strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-planthia-dark mb-4">
          {current.title}
        </h1>

        <p className="text-planthia-dark/70 mb-8 max-w-sm">
          {current.message}
        </p>

        {/* Sección de Orden */}
        {!isError && (
          <div className="bg-planthia-cream/50 w-full p-4 rounded-2xl mb-8 border border-planthia-dark/5">
            <p className="text-sm text-planthia-dark/50 mb-1">Número de orden</p>
            <span className="font-headline font-bold text-lg text-planthia-green">{orderNumber}</span>
          </div>
        )}

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => isError ? router.push('/checkout') : router.push('/account')}
            className="w-full cursor-pointer flex items-center justify-center bg-planthia-dark text-white font-bold py-4 rounded-full hover:bg-planthia-dark/90 transition-all shadow-lg shadow-planthia-dark/20"
          >
            {current.buttonText}
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>

          <button
            onClick={() => router.push('/shop')}
            className="w-full cursor-pointer flex items-center justify-center bg-transparent text-planthia-dark font-bold py-4 rounded-full border border-planthia-dark/10 shadow-lg shadow-planthia-dark/5 hover:bg-planthia-dark/5 transition-all"
          >
            <Home className="mr-2 w-4 h-4" />
            Volver a la tienda
          </button>
        </div>
      </div>
    </main>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={null}>
      <PaymentStatusContent />
    </Suspense>
  );
}