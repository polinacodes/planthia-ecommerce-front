// src/components/layout/NewsletterBlock.tsx
// Newsletter con el beneficio del 10 % (al final de la home y del blog).
// Ocupa todo el ancho con el mismo verde del footer y va pegada arriba de él, como parte del cierre.
// Usa la misma suscripción que el popup: el código llega por mail.
'use client';

import { Loader2 } from 'lucide-react';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';

export default function NewsletterBlock({ containerClassName }: { containerClassName: string }) {
  const { email, setEmail, loading, handleSubmit } = useNewsletterSubscribe();

  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="bg-[#5B823B] text-[#F7F5F0] scroll-mt-20">
      <div className={containerClassName}>
        {/* La línea de abajo es la misma que separa las partes del footer */}
        <div className="pt-14 sm:pt-16 pb-12 sm:pb-14 border-b border-white/10 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 items-center">
          <div>
            <span className="font-headline font-bold tracking-[0.2em] text-xs text-white/80 mb-3 block uppercase">
              #ComunidadPlanthia
            </span>
            <h2 id="newsletter-title" className="font-headline font-extrabold text-3xl sm:text-4xl leading-[1.1] tracking-tight text-white">
              10 % OFF en tu primera compra
            </h2>
            <p className="text-white/85 text-base sm:text-lg leading-relaxed mt-4 max-w-lg">
              Suscribite y te mandamos el código por mail. Además, recibís novedades, nuevos ingresos y consejos de cuidado.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 bg-white rounded-full p-1.5">
              <label htmlFor="newsletter-email" className="sr-only">Tu email</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                autoComplete="email"
                className="flex-1 min-w-0 bg-transparent pl-4 sm:pl-5 py-2.5 text-base text-planthia-dark placeholder:text-planthia-dark/40 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex-none rounded-full bg-planthia-green-dark hover:bg-planthia-dark text-white font-headline font-bold text-sm px-5 sm:px-7 transition-colors cursor-pointer disabled:opacity-60"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Suscribirme'}
              </button>
            </div>
            <p className="text-xs text-white/75 mt-3 pl-5">Podés darte de baja cuando quieras.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
