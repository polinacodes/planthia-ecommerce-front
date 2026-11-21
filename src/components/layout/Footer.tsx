//src/components/layout/Footer.tsx
"use client";

import React from 'react';
import { Globe } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';
import { usePathname } from 'next/navigation';
import { HOME_CONTAINER, PAGE_CONTAINER } from '@/lib/layout';

// Columnas de links: solo páginas que existen
const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Plantas', href: '/shop?type=plantas' },
      { label: 'Aromáticas', href: '/shop?type=plantas&category=aromaticas' },
      { label: 'Insumos', href: '/shop?type=cuidados' },
      { label: 'Sustratos', href: '/shop?type=cuidados&category=sustratos' },
    ],
  },
  {
    title: 'Aprendé',
    links: [
      { label: 'Guía de cuidados', href: '/guia' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Mi cuenta',
    links: [
      { label: 'Mis pedidos', href: '/account' },
      { label: 'Favoritos', href: '/wishlist' },
      { label: 'Mi perfil', href: '/account?tab=perfil' },
    ],
  },
];

const SOCIAL_CLASS = 'p-2 bg-white/10 rounded-full hover:bg-[#C1D37F] hover:text-[#5B823B] transition-all';

const Footer = () => {
  const pathname = usePathname();
  // Mismo contenedor que la página (así se alinea con la newsletter y los títulos)
  const container = pathname === '/' ? HOME_CONTAINER : PAGE_CONTAINER;

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-[#5B823B] text-[#F7F5F0]">
      <div className={container}>

        {/* Marca + columnas de links */}
        <div className="pt-12 sm:pt-14 pb-10 grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-x-6 gap-y-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" onClick={handleLogoClick} className="inline-block hover:opacity-80 transition-opacity" aria-label="Planthia, ir al inicio">
              <Logo className="h-8 w-auto" symbolColor="currentColor" />
            </Link>
            <p className="text-sm text-white/80 leading-relaxed mt-4 max-w-xs">
              Plantas y todo lo que necesitan para crecer. Llená de vida tus espacios.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="font-headline font-bold text-xs uppercase tracking-[0.18em] text-white/70 mb-4">{column.title}</p>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/90 hover:text-[#C1D37F] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Línea final */}
        <div className="border-t border-white/10 py-6 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm font-medium tracking-widest opacity-70 text-center sm:text-left">
            © 2026 Planthia · Desarrollado por Polinacodes
          </p>

          <div className="flex gap-3 md:gap-5 items-center">
            {/* GitHub */}
            <a href="https://github.com/polinacodes" target="_blank" rel="noopener noreferrer" className={SOCIAL_CLASS} aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.87 1.6-.17.55-.25 1.12-.25 1.7v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            </a>
            {/* Sitio web */}
            <a href="https://polinacodes.dev/" target="_blank" rel="noopener noreferrer" className={SOCIAL_CLASS} aria-label="Sitio Web">
              <Globe size={18} />
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/polinacodes/" target="_blank" rel="noopener noreferrer" className={SOCIAL_CLASS} aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
