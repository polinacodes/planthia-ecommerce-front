// src/components/layout/PageHeader.tsx
// Encabezado de sección (tienda, guía, blog): mismo sistema que los títulos de la home.
// Etiqueta chica + título grande en Manrope + bajada en gris, alineados a la izquierda.
// Lo que va como children se ubica a la derecha en escritorio (buscador, interruptor…).
import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function PageHeader({ eyebrow, title, subtitle, children }: PageHeaderProps) {
  return (
    <Reveal y={16}>
    <header className="pt-8 sm:pt-12 mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
      <div className="min-w-0">
        <span className="font-headline font-bold tracking-[0.2em] text-xs text-planthia-dark mb-3 block uppercase">
          {eyebrow}
        </span>
        <h1 className="font-headline font-extrabold text-4xl sm:text-5xl xl:text-6xl leading-[1.05] tracking-tight text-planthia-dark">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-planthia-dark/60 mt-3 text-base sm:text-lg max-w-xl leading-relaxed">{subtitle}</p>
        )}
      </div>
      {children && <div className="w-full md:w-auto md:flex-none">{children}</div>}
    </header>
    </Reveal>
  );
}
