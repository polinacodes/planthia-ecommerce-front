"use client";

import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#5B823B] text-[#F7F5F0] py-16 px-6 sm:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Columna 1: Branding */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-3xl font-extrabold tracking-tighter mb-4 text-[#F7F5F0]">
              Planthia<span className="text-[#C1D37F]">.</span>
            </h2>
            <p className="text-sm opacity-80 leading-relaxed max-w-xs">
              Transformando espacios con vida. Tu boutique de plantas premium para tu hogar.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          {/* <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs opacity-60">Explorar</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/shop" className="hover:text-[#C1D37F] transition-colors text-[#F7F5F0]">Tienda</Link></li>
              <li><Link href="/cuidados" className="hover:text-[#C1D37F] transition-colors text-[#F7F5F0]">Cuidados</Link></li>
              <li><Link href="/contacto" className="hover:text-[#C1D37F] transition-colors text-[#F7F5F0]">Contacto</Link></li>
            </ul>
          </div> */}

          {/* Columna 3: Ayuda */}
          {/* <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs opacity-60">Ayuda</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/faq" className="hover:text-[#C1D37F] transition-colors text-[#F7F5F0]">Preguntas Frecuentes</Link></li>
              <li><Link href="/envios" className="hover:text-[#C1D37F] transition-colors text-[#F7F5F0]">Envíos y Devoluciones</Link></li>
            </ul>
          </div> */}

          {/* Columna 4: Redes */}
          {/* <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs opacity-60">Seguinos</h4>
           
          </div> */}
        </div>

        {/* Línea divisoria y Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50 font-medium">
          <p>© {currentYear} Planthia. Todos los derechos reservados.</p>
          {/* <div className="flex gap-8">
            <Link href="/privacidad" className="hover:underline">Privacidad</Link>
            <Link href="/terminos" className="hover:underline">Términos</Link>
          </div> */}

          <div className="flex gap-4">
            {/* Instagram SVG */}
            <Link href="#" className="p-2.5 bg-white/10 rounded-full hover:bg-[#C1D37F] hover:text-[#5B823B] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </Link>
            {/* Facebook SVG */}
            <Link href="#" className="p-2.5 bg-white/10 rounded-full hover:bg-[#C1D37F] hover:text-[#5B823B] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </Link>
            {/* Mail */}
            <Link href="#" className="p-2.5 bg-white/10 rounded-full hover:bg-[#C1D37F] hover:text-[#5B823B] transition-all">
              <Mail size={20} />
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;