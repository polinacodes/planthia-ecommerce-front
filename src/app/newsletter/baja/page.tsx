// app/newsletter/baja/page.tsx
'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, MailX, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'loading' | 'done' | 'error';

// Página a la que lleva el link "Darme de baja" de los mails.
// Pide confirmar con un botón: los antivirus de los correos abren los links solos
// y, si la baja fuera automática al entrar, darían de baja a la gente sin querer.
function UnsubscribeContent() {
  const token = useSearchParams().get('token') ?? '';
  const [status, setStatus] = useState<Status>(token ? 'idle' : 'error');
  const [message, setMessage] = useState(token ? '' : 'El link de baja no es válido o está incompleto.');

  const handleUnsubscribe = async () => {
    setStatus('loading');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'No pudimos procesar la baja.');
      setMessage(data.message);
      setStatus('done');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No pudimos procesar la baja.');
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-planthia-gradient font-body text-planthia-dark flex items-center justify-center p-6 relative">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-12 z-10 text-center space-y-6">
        {status === 'done' ? (
          <>
            <CheckCircle className="w-16 h-16 text-planthia-green mx-auto" strokeWidth={1.5} />
            <div>
              <h1 className="text-3xl font-headline font-bold mb-2">Te diste de baja</h1>
              <p className="text-planthia-dark/60">{message}</p>
              <p className="text-planthia-dark/60 mt-2">
                Si tenías un código de descuento sin usar, sigue siendo válido.
              </p>
            </div>
          </>
        ) : status === 'error' ? (
          <>
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" strokeWidth={1.5} />
            <div>
              <h1 className="text-3xl font-headline font-bold mb-2">Algo no salió bien</h1>
              <p className="text-planthia-dark/60">{message}</p>
            </div>
          </>
        ) : (
          <>
            <MailX className="w-16 h-16 text-planthia-green mx-auto" strokeWidth={1.5} />
            <div>
              <h1 className="text-3xl font-headline font-bold mb-2">¿Querés darte de baja?</h1>
              <p className="text-planthia-dark/60">
                Vas a dejar de recibir los emails de Planthia con novedades y descuentos.
              </p>
            </div>
            <button
              onClick={handleUnsubscribe}
              disabled={status === 'loading'}
              className="w-full bg-planthia-green text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
            >
              {status === 'loading' ? 'Procesando...' : 'Confirmar baja'}
            </button>
          </>
        )}
        <Link href="/" className="inline-block text-sm font-semibold text-planthia-green hover:underline">
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeContent />
    </Suspense>
  );
}
