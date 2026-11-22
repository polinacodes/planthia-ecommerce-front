// src/components/layout/TextTabs.tsx
// Filtros en texto con subrayado verde (mismo estilo que las subcategorías de la tienda).
// Cada pestaña es un link (href) o un botón (onClick). En celular se deslizan de costado.
'use client';

import Link from 'next/link';

export interface TextTab {
  label: string;
  active: boolean;
  href?: string;
  onClick?: () => void;
}

const tabClass = (active: boolean) =>
  `flex-none text-sm font-semibold cursor-pointer transition-colors duration-200 underline-offset-8 decoration-2 ${
    active ? 'text-planthia-green-dark underline decoration-planthia-green' : 'text-planthia-dark/70 hover:text-planthia-green'
  }`;

export default function TextTabs({ tabs, className = '' }: { tabs: TextTab[]; className?: string }) {
  return (
    <div
      className={`-mx-6 px-6 sm:mx-0 sm:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,black_85%,transparent)] sm:[mask-image:none] ${className}`}
    >
      <div className="flex items-center gap-6 w-max pr-8 sm:pr-0 pb-3">
        {tabs.map((tab) =>
          tab.href ? (
            <Link key={tab.label} href={tab.href} scroll={false} className={tabClass(tab.active)}>
              {tab.label}
            </Link>
          ) : (
            <button key={tab.label} onClick={tab.onClick} className={tabClass(tab.active)}>
              {tab.label}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
