'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentWaitingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/${orderId}`, {
        cache: 'no-cache'
      });
      const response = await res.json();
      
      console.log("JSON que llega al front:", JSON.stringify(response));

      const data = response.data || response;
      const attributes = data.attributes || data;
      
      console.log("Status final detectado:", attributes.order_status);

      if (attributes.order_status === 'paid') {
        clearInterval(interval);
        router.push(`/payment-status?payment_id=${orderId}&status=approved`);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }, 3000);
  return () => clearInterval(interval);
}, [orderId, router]);

  return (
    <main className="min-h-screen bg-planthia-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center space-y-6">
        <div className="animate-spin text-4xl">🌿</div>
        <h1 className="text-2xl font-bold font-headline">Estamos procesando tu pago...</h1>
        <p className="text-planthia-dark/60">No cierres esta pestaña, te redirigiremos automáticamente cuando se confirme el pago.</p>
      </div>
    </main>
  );
}