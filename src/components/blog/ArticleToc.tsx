// src/components/blog/ArticleToc.tsx
// Índice "En este artículo": marca en verde la sección que se está leyendo.
'use client';

import { useEffect, useState } from 'react';

export default function ArticleToc({ headings }: { headings: { id: string; text: string }[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);

    // La sección activa es el último subtítulo que ya pasó por la parte de arriba de la pantalla
    const onScroll = () => {
      const passed = elements.filter((el) => el.getBoundingClientRect().top < 160);
      setActiveId((passed.at(-1) ?? elements[0])?.id);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="En este artículo">
      <p className="font-headline font-bold tracking-[0.2em] text-[11px] text-planthia-dark/70 uppercase mb-4">En este artículo</p>
      <ul className="space-y-2.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                // Desplazamiento suave hasta la sección
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                history.replaceState(null, '', `#${h.id}`);
              }}
              className={`block text-sm leading-snug transition-colors ${
                activeId === h.id ? 'text-planthia-green font-semibold' : 'text-planthia-dark/60 hover:text-planthia-dark'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
