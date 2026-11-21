// src/components/layout/NewsletterBlock.tsx
// Bloque de newsletter con el beneficio del 10 % (va al final de la home y del blog).
// Usa la misma suscripción que el popup: el código llega por mail.
'use client';

import { Loader2 } from 'lucide-react';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';

export default function NewsletterBlock({ className = '' }: { className?: string }) {
  const { email, setEmail, loading, handleSubmit } = useNewsletterSubscribe();

  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className={`scroll-mt-28 ${className}`}>
      <div className="bg-planthia-green-dark text-planthia-cream rounded-3xl px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 items-center">
        <div>
          <span className="font-headline font-bold tracking-[0.2em] text-xs text-planthia-cream/80 mb-3 block uppercase">
            #ComunidadPlanthia
          </span>
          <h2 id="newsletter-title" className="font-headline font-extrabold text-3xl sm:text-4xl leading-[1.1] tracking-tight">
            10 % OFF en tu primera compra
          </h2>
          <p className="text-planthia-cream/80 text-base sm:text-lg leading-relaxed mt-4 max-w-lg">
            Suscribite y te mandamos el código por mail. Además, recibís novedades, nuevos ingresos y consejos de cuidado.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:bg-white sm:rounded-full sm:p-1.5">
            <label htmlFor="newsletter-email" className="sr-only">Tu email</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              autoComplete="email"
              className="flex-1 min-w-0 bg-white rounded-full sm:rounded-none sm:bg-transparent px-5 py-3.5 sm:py-2.5 text-base text-planthia-dark placeholder:text-planthia-dark/40 outline-none"
            />
            <button type="submit" disabled={loading} className="btn btn-primary btn-md flex-none">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Suscribirme'}
            </button>
          </div>
          <p className="text-xs text-planthia-cream/70 mt-3 sm:pl-5">Podés darte de baja cuando quieras.</p>
        </form>
      </div>
    </section>
  );
}
