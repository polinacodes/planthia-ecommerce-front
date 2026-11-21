// src/app/shop/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Plantas de interior, exterior y aromáticas, y todo lo que necesitan para crecer: sustratos, macetas y herramientas. Envíos a todo el país.',
  alternates: { canonical: '/shop' },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
