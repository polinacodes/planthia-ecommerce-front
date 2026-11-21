// src/components/home/BenefitsBar.tsx
// Franja de beneficios al final de la home (antes de la newsletter): fondo claro a todo el ancho,
// íconos grandes arriba y textos abajo, en verde.
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { BookOpen, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { HOME_CONTAINER } from '@/lib/layout';

interface Benefit {
  Icon: LucideIcon;
  title: string;
  text: string;
  href?: string;
}

const BENEFITS: Benefit[] = [
  { Icon: Truck, title: 'Envíos a todo el país', text: 'Llegamos a donde estés' },
  { Icon: ShieldCheck, title: 'Compra 100 % segura', text: 'Pagos protegidos' },
  { Icon: Sparkles, title: 'Plantas seleccionadas', text: 'Elegidas por su calidad' },
  { Icon: BookOpen, title: 'Guía de cuidados', text: 'Para cada una de nuestras plantas', href: '/guia' },
];

function BenefitContent({ benefit: { Icon, title } }: { benefit: Benefit }) {
  return (
    <>
      <Icon className="w-9 h-9 sm:w-11 sm:h-11 text-planthia-green" strokeWidth={1.25} />
      <span className="font-headline font-bold text-sm lg:text-base leading-snug text-planthia-green-dark">{title}</span>
    </>
  );
}

export default function BenefitsBar() {
  // Ícono grande arriba y texto abajo: 4 columnas desde tablet, 2 × 2 en celular, con separadores finos
  const itemClass =
    'flex flex-col items-center justify-start gap-3 text-center px-2 sm:px-4 border-planthia-dark/[0.08] [&:nth-child(even)]:border-l md:border-l md:first:border-l-0';

  return (
    // Va al final de la home, justo antes de la newsletter, a todo el ancho de la pantalla
    <section
      aria-label="Beneficios"
      className="bg-white border-t border-planthia-dark/[0.06]"
    >
      <div className={`${HOME_CONTAINER} py-10 sm:py-12`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8">
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
