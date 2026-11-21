// src/components/home/BenefitsBar.tsx
// Franja de beneficios debajo del hero: fondo claro a todo el ancho, íconos y texto en verde.
// El contenido queda alineado con el resto de las secciones de la home.
// En celular se desliza de costado; desde tablet, grilla.
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { BadgePercent, CreditCard, Leaf, Truck } from 'lucide-react';
import { HOME_CONTAINER } from '@/lib/layout';

interface Benefit {
  Icon: LucideIcon;
  title: string;
  text: string;
  href?: string;
}

const BENEFITS: Benefit[] = [
  { Icon: Truck, title: 'Envíos a todo el país', text: 'Llegamos a donde estés' },
  { Icon: CreditCard, title: 'Mercado Pago o PayPal', text: 'Pagá como prefieras' },
  { Icon: BadgePercent, title: '10 % en tu primera compra', text: 'Suscribiéndote al newsletter', href: '#newsletter' },
  { Icon: Leaf, title: 'Guía de cuidados', text: 'Para cada una de nuestras plantas', href: '/guia' },
];

function BenefitContent({ benefit: { Icon, title } }: { benefit: Benefit }) {
  return (
    <>
      <Icon className="w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6 flex-shrink-0 text-planthia-green" strokeWidth={1.5} />
      <span className="font-headline font-bold text-sm lg:text-[15px] leading-snug text-planthia-green-dark">{title}</span>
    </>
  );
}

export default function BenefitsBar() {
  // Celular: grilla 2 × 2 (ícono arriba, texto abajo). Desde tablet: una línea, centrados y con separadores.
  const itemClass =
    'flex flex-col md:flex-row items-center justify-center gap-2 md:gap-2.5 lg:gap-3 text-center md:text-left px-3 py-5 md:py-0 ' +
    'border-planthia-dark/[0.08] [&:nth-child(odd)]:border-r [&:nth-child(-n+2)]:border-b md:!border-b-0 md:border-l md:[&:nth-child(odd)]:border-r-0 md:first:border-l-0';

  return (
    // Sale del contenedor de la home para ocupar todo el ancho de la pantalla.
    // Los márgenes de arriba están calibrados con el hero (las ramas del pothos).
    <section
      aria-label="Beneficios"
      className="relative left-1/2 w-screen -translate-x-1/2 mt-12 lg:-mt-[110px] xl:mt-0 2xl:mt-0 min-[1921px]:!mt-0 bg-white border-y border-planthia-dark/[0.06]"
    >
      <div className={`${HOME_CONTAINER} md:py-7`}>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {BENEFITS.map((benefit) =>
            benefit.href ? (
              <Link key={benefit.title} href={benefit.href} className={`${itemClass} hover:opacity-75 transition-opacity`}>
                <BenefitContent benefit={benefit} />
              </Link>
            ) : (
              <div key={benefit.title} className={itemClass}>
                <BenefitContent benefit={benefit} />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
