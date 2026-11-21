// src/components/home/CareGuideBanner.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Banner de la home que lleva a la guía de cuidados (va debajo de las categorías)
export default function CareGuideBanner() {
  return (
    <section className="px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto pt-12 sm:pt-16 pb-4">
      <div className="relative overflow-hidden rounded-3xl bg-white bg-planthia-gradient grid grid-cols-1 md:grid-cols-2 items-stretch">
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center order-last md:order-first">
          <span className="font-headline font-bold tracking-[0.2em] text-xs text-planthia-dark uppercase mb-3">#GuíaPlanthia</span>
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl xl:text-5xl leading-[1.1] text-planthia-dark">
            ¿Sabés cómo cuidar tu planta?
          </h2>
          <p className="text-planthia-dark/60 text-base sm:text-lg leading-relaxed mt-4 max-w-md">
            Buscala en nuestra guía y descubrí cuánta luz y agua necesita, qué sustrato usar y los secretos para que crezca feliz.
          </p>
          <Link href="/guia" className="btn btn-primary btn-lg self-start mt-8">
            Ir a la guía de cuidados <ArrowRight size={18} />
          </Link>
        </div>
        <div className="relative min-h-[260px] md:min-h-[420px]">
          <Image
            src="/guia-banner.webp"
            alt="Persona regando sus plantas"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
