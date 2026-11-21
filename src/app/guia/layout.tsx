// src/app/guia/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guía de cuidados',
  description: 'Buscá tu planta y descubrí cuánta luz y agua necesita, qué sustrato usar y los secretos para que crezca sana. Fichas de cuidado de todas nuestras plantas.',
  alternates: { canonical: '/guia' },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
