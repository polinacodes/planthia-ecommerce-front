'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { clearPendingDiscountCode } from '@/lib/discountCode';
import { useCart } from '@/hooks/useCart';
import { CheckCircle, AlertCircle, ArrowRight, Home, Clock, Loader2 } from 'lucide-react';

function PaymentStatusContent() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const orderId = searchParams.get('order');
  const urlStatus = searchParams.get('status');
  // PayPal vuelve con ?token=<id de la orden en PayPal>
  const paypalToken = searchParams.get('token');

  const orderNumber = orderId ? `#PL-${orderId}` : '';

  type ViewState = 'loading' | 'success' | 'pending' | 'error';
  const [viewState, setViewState] = useState<ViewState>(() => {
    if (urlStatus === 'failure') return 'error';
    if (urlStatus === 'pending') return 'pending';
    if (paypalToken) return 'loading';
    return 'success';
  });

  // Evita capturar dos veces (React ejecuta los efectos dos veces en desarrollo)
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    // Canceló en PayPal: avisamos al backend para que el pedido quede cancelado
    if (urlStatus === 'failure' && paypalToken) {
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/paypal/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, token: paypalToken }),
      }).catch((error) => console.error('Error cancelando el pedido:', error));
      return;
    }

    if (urlStatus === 'failure' || urlStatus === 'pending') return;

    // Mercado Pago: el pago ya lo confirma el webhook en el backend
    if (!paypalToken) {
      clearCart();
      clearPendingDiscountCode();
      return;
    }

    // PayPal: recién al capturar se cobra el pago
    const capturePaypal = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/paypal/capture`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, token: paypalToken }),
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          clearCart();
          clearPendingDiscountCode();
          setViewState('success');
        } else {
          setViewState('error');
        }
      } catch (error) {
        console.error('Error confirmando el pago de PayPal:', error);
        setViewState('error');
      }
    };

    capturePaypal();
  }, [urlStatus, paypalToken, orderId, clearCart]);

  const statusConfig = {
    success: {
      icon: CheckCircle,
      iconColor: "text-planthia-green",
      bgColor: "bg-planthia-green/10",
      title: "¡Pago exitoso!",
      message: "Gracias por tu compra. Te enviamos un correo con los detalles de envío.",
      buttonText: "Mi cuenta"
    },
    pending: {
      icon: Clock,
      iconColor: "text-planthia-green",
      bgColor: "bg-planthia-green/10",
      title: "Pago pendiente",
      message: "Tu pago está en proceso. Cuando se acredite te avisamos por correo.",
      buttonText: "Mi cuenta"
    },
    loading: {
      icon: Loader2,
      iconColor: "text-planthia-green animate-spin",
      bgColor: "bg-planthia-green/10",
      title: "Confirmando tu pago...",
      message: "Estamos confirmando el pago con PayPal. No cierres esta pestaña.",
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

  const isError = viewState === 'error';
  const current = statusConfig[viewState];
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
        {!isError && orderNumber && (
          <div className="bg-planthia-cream/50 w-full p-4 rounded-2xl mb-8 border border-planthia-dark/5">
            <p className="text-sm text-planthia-dark/50 mb-1">Número de orden</p>
            <span className="font-headline font-bold text-lg text-planthia-green">{orderNumber}</span>
          </div>
        )}

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => isError ? router.push('/checkout') : router.push('/account')}
            className="btn btn-primary btn-lg w-full"
          >
            {current.buttonText}
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => router.push('/shop')}
            className="btn btn-secondary btn-lg w-full"
          >
            <Home className="w-4 h-4" />
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