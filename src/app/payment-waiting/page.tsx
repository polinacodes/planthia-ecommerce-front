'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Home } from 'lucide-react';

export default function PaymentWaitingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const checkOrderStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/${orderId}`);
        const data = await res.json();
        const status = data.order_status;

        if (status === 'paid') {
          router.push(`/payment-status?payment_id=${orderId}&status=approved`);
        } else if (status === 'failure' || status === 'rejected') {
          setShowError(true);
        }
      } catch (err) {
        console.error("Error consultando estado de pago:", err);
      }
    };

    checkOrderStatus();

    const interval = setInterval(checkOrderStatus, 3000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  if (showError) {
    return (
      <main className="min-h-screen bg-planthia-gradient flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-10 z-10 flex flex-col items-center text-center">
          <div className="bg-red-500/10 p-4 rounded-full mb-6">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-planthia-dark mb-4">Hubo un problema</h1>
          <p className="text-planthia-dark/70 mb-8 max-w-sm">El pago fue rechazado. Podés intentar nuevamente en la ventana de Mercado Pago.</p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full flex items-center justify-center bg-planthia-dark text-white font-bold py-4 rounded-full hover:bg-planthia-dark/90 transition-all shadow-lg shadow-planthia-dark/20"
            >
              Volver al Checkout
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>

            <button
              onClick={() => router.push('/tienda')}
              className="w-full flex items-center justify-center bg-transparent text-planthia-dark font-bold py-4 rounded-full border border-planthia-dark/10 hover:bg-planthia-dark/5 transition-all"
            >
              <Home className="mr-2 w-4 h-4" />
              Volver a la tienda
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-planthia-gradient font-body text-planthia-dark flex items-center justify-center p-6 md:p-12 relative overflow-hidden">

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-10 z-10 flex flex-col items-center text-center">

        <motion.div
          className="w-36 h-36 flex items-center justify-center mb-6"
          animate={{
            rotate: 360,
            y: [0, -10, 0]
          }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <img
            src="/icons/plantita.webp"
            alt="Procesando..."
            className="w-full h-full"
          />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-planthia-dark mb-4">
          Procesando tu pago
        </h1>

        <p className="text-planthia-dark/70 mb-4 max-w-sm text-pretty">
          No cierres esta pestaña. <br /> Te redirigiremos automáticamente cuando confirmemos el pago.
        </p>

        <div className="flex flex-row items-center justify-center gap-3 w-full h-10 pt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-planthia-green"
              style={{ originX: 0.5, originY: 0.5 }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}