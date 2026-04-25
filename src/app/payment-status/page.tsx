'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Mail, ArrowRight, Home } from 'lucide-react';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id') || searchParams.get('preference_id');
  const status = searchParams.get('status') || searchParams.get('collection_status');

  const orderNumber = paymentId ? `#PL-${paymentId.toString().slice(-5)}` : '82931';

  const isError = status === 'failure' || status === 'rejected';
  const isPending = status === 'pending';

  if (isError) {
    return (
      <main className="min-h-screen bg-planthia-cream flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold mb-4">Hubo un problema con tu pago</h1>
          <p className="mb-6">Podés intentar nuevamente desde el checkout.</p>
          <button onClick={() => router.push('/checkout')} className="bg-planthia-green text-white px-6 py-3 rounded-full">
            Volver al checkout
          </button>
        </div>
      </main>
    );
  }

  if (isPending) {
    return (
      <main className="min-h-screen bg-planthia-cream flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-yellow-500 text-6xl mb-4">⏳</div>
          <h1 className="text-3xl font-bold mb-4">Tu pago está siendo procesado</h1>
          <p>En breve recibirás un email con la confirmación.</p>
        </div>
      </main>
    );
  }

  // Pantalla de éxito 
  return (
    <main className="min-h-screen bg-planthia-cream font-body text-planthia-dark flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Elementos orgánicos de fondo */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-planthia-light-green/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-planthia-green/10 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl bg-planthia-ice rounded-xl overflow-hidden relative z-10">
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-planthia-green/10 text-planthia-green p-2 rounded-full">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-planthia-green font-headline font-bold text-xs uppercase tracking-widest">
              Pedido Confirmado
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-headline font-extrabold text-planthia-dark tracking-tighter leading-none mb-4">
            ¡Gracias por tu compra!
          </h1>

          <div className="space-y-4 mb-10">
            <p className="text-planthia-dark/60 font-body text-lg leading-relaxed">
              Tu pedido ha sido confirmado con éxito. Estamos preparando tus plantas para que lleguen perfectas.
            </p>

            <div className="bg-planthia-cream p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm">Número de orden:</span>
              <span className="font-headline font-bold text-planthia-green">{orderNumber}</span>
            </div>

            <div className="flex items-start gap-3 pt-4 border-t border-planthia-dark/10">
              <Mail className="w-5 h-5 text-planthia-green flex-shrink-0 mt-0.5" />
              <p className="text-planthia-dark/60 text-sm">
                Recibirás un correo con los detalles de tu envío pronto.
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/mi-cuenta')}
              className="inline-flex items-center justify-center bg-planthia-green text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-planthia-green/20 hover:scale-[1.02] transition-transform"
            >
              Ver estado del pedido
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            <button
              onClick={() => router.push('/tienda')}
              className="inline-flex items-center justify-center bg-white text-planthia-green font-bold px-8 py-4 rounded-full border border-planthia-green/20 hover:bg-planthia-green/5 transition-colors"
            >
              <Home className="mr-2 w-4 h-4" />
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}