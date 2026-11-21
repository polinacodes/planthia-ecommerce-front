// src/components/home/BenefitsBar.tsx
// Franja de beneficios debajo del hero: verde oscuro de la marca con letra e íconos crema.
// En celular se desliza de costado; desde tablet, grilla.
import Link from 'next/link';
import type { ReactNode } from 'react';
import { BadgePercent, Leaf, Truck } from 'lucide-react';
import { MercadoPagoLogo, PayPalLogo } from '@/components/icons/PaymentLogos';

interface Benefit {
  icon: ReactNode;
  title: string;
  text: string;
  href?: string;
}

const ICON = 'w-7 h-7 flex-shrink-0';

const BENEFITS: Benefit[] = [
  { icon: <Truck className={ICON} strokeWidth={1.5} />, title: 'Envíos a todo el país', text: 'Llegamos a donde estés' },
  {
    icon: (
      <span className="flex items-center gap-1.5 flex-shrink-0">
        <MercadoPagoLogo className="w-7 h-7" />
        <PayPalLogo className="w-5 h-5" />
      </span>
    ),
    title: 'Mercado Pago o PayPal',
    text: 'Pagá como prefieras',
  },
  { icon: <BadgePercent className={ICON} strokeWidth={1.5} />, title: '10 % en tu primera compra', text: 'Suscribiéndote al newsletter', href: '#newsletter' },
  { icon: <Leaf className={ICON} strokeWidth={1.5} />, title: 'Guía de cuidados', text: 'Para cada una de nuestras plantas', href: '/guia' },
];

function BenefitContent({ benefit }: { benefit: Benefit }) {
  return (
    <>
      {benefit.icon}
      <div className="min-w-0">
        <p className="font-headline font-bold text-[15px] leading-snug">{benefit.title}</p>
        <p className="text-sm text-planthia-cream/75 leading-snug">{benefit.text}</p>
      </div>
    </>
  );
}

export default function BenefitsBar() {
  const itemClass = 'flex items-center gap-4 snap-start flex-[0_0_78%] min-[480px]:flex-[0_0_55%] md:flex-auto';

  return (
    // Los márgenes de arriba están calibrados con el hero (las ramas del pothos)
    <section
      aria-label="Beneficios"
      className="mt-12 lg:-mt-[110px] xl:mt-0 2xl:mt-0 min-[1921px]:!mt-0 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto"
    >
      <div className="bg-planthia-green-dark text-planthia-cream rounded-3xl py-6 md:py-8 px-6 sm:px-8 lg:px-10">
        <div className="-mx-6 sm:-mx-8 md:mx-0 px-6 sm:px-8 md:px-0 scroll-px-6 sm:scroll-px-8 flex md:grid md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-y-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {BENEFITS.map((benefit) =>
            benefit.href ? (
              <Link key={benefit.title} href={benefit.href} className={`${itemClass} hover:opacity-80 transition-opacity`}>
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
