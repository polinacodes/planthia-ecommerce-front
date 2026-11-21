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

function BenefitContent({ benefit: { Icon, title, text } }: { benefit: Benefit }) {
  return (
    <>
      <Icon className="w-7 h-7 flex-shrink-0 text-planthia-green" strokeWidth={1.5} />
      <div className="min-w-0">
        <p className="font-headline font-bold text-[15px] leading-snug text-planthia-green-dark">{title}</p>
        <p className="text-sm text-planthia-green-dark/70 leading-snug">{text}</p>
      </div>
    </>
  );
}

export default function BenefitsBar() {
  const itemClass = 'flex items-center gap-4 snap-start flex-[0_0_78%] min-[480px]:flex-[0_0_55%] md:flex-auto';

  return (
    // Sale del contenedor de la home para ocupar todo el ancho de la pantalla.
    // Los márgenes de arriba están calibrados con el hero (las ramas del pothos).
    <section
      aria-label="Beneficios"
      className="relative left-1/2 w-screen -translate-x-1/2 mt-12 lg:-mt-[110px] xl:mt-0 2xl:mt-0 min-[1921px]:!mt-0 bg-white border-y border-planthia-dark/[0.06]"
    >
      <div className={`${HOME_CONTAINER} py-7 md:py-9`}>
        <div className="-mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 scroll-px-4 sm:scroll-px-6 flex md:grid md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-y-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
