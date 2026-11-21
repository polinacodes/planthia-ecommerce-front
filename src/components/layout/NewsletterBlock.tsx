// src/components/layout/NewsletterBlock.tsx
// Newsletter con el beneficio del 10 % (al final de la home y del blog).
// Ocupa todo el ancho con el mismo verde del footer y va pegada arriba de él, como parte del cierre.
// Usa la misma suscripción que el popup: el código llega por mail.
'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';

export default function NewsletterBlock({ containerClassName }: { containerClassName: string }) {
  const { email, setEmail, loading, handleSubmit } = useNewsletterSubscribe();

  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="bg-[#5B823B] text-[#F7F5F0] scroll-mt-20">
      <div className={containerClassName}>
        {/* La línea de abajo es la misma que separa las partes del footer */}
        <div className="pt-14 sm:pt-16 pb-12 sm:pb-14 border-b border-white/10 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 items-end">
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

          {/* Campo minimalista: solo una línea blanca y un botón redondo con flecha */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-3 border-b-[1.5px] border-white/70 focus-within:border-white pb-2.5 transition-colors">
              <label htmlFor="newsletter-email" className="sr-only">Tu email</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                autoComplete="email"
                className="flex-1 min-w-0 bg-transparent py-2 text-lg text-white placeholder:text-white/60 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                aria-label="Suscribirme"
                className="group flex-none w-12 h-12 rounded-full bg-white text-[#5B823B] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform disabled:opacity-60"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-0.5" />}
              </button>
            </div>
            <p className="text-sm text-white/75 mt-3">Podés darte de baja cuando quieras.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
