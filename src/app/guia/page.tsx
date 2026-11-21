// src/app/guia/page.tsx
'use client';

import { Suspense, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { usePlants } from '@/hooks/usePlants';
import GuideCard from '@/components/guide/GuideCard';
import { GUIDE_FILTERS, GuideFilterId, isGuidePlant, matchesSearch } from '@/lib/guide';

function GuideContent() {
  const { plants: products, loading } = usePlants();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // La búsqueda y el filtro viven en la URL (/guia?q=monstera&filtro=mascotas): se pueden compartir
  const query = searchParams.get('q') ?? '';
  const filterId = (searchParams.get('filtro') ?? 'todas') as GuideFilterId;

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'todas') params.delete(key);
    else params.set(key, value);
    router.replace(`${pathname}${params.size ? `?${params}` : ''}`, { scroll: false });
  };

  const plants = useMemo(() => {
    const filter = GUIDE_FILTERS.find((f) => f.id === filterId) ?? GUIDE_FILTERS[0];
    return products
      .filter(isGuidePlant)
      .filter((p) => filter.test(p))
      .filter((p) => matchesSearch(p, query))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }, [products, filterId, query]);

  return (
    <main className="min-h-screen bg-planthia-cream pb-24">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-6">
        {/* Encabezado con buscador */}
        <section className="rounded-3xl px-6 py-12 sm:px-12 sm:py-16 text-center bg-white bg-planthia-gradient">
          <span className="font-headline font-bold tracking-[0.2em] text-xs text-planthia-dark uppercase">#GuíaPlanthia</span>
          <h1 className="font-headline font-extrabold text-4xl sm:text-5xl text-planthia-dark mt-3 mb-3">¿Qué planta tenés?</h1>
          <p className="text-planthia-dark/60 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Buscala y te contamos cómo cuidarla: luz, riego, sustrato y todo lo que necesita.
          </p>

          <div className="max-w-xl mx-auto flex items-center gap-3 bg-white border-[1.5px] border-[#dfe5d8] focus-within:border-planthia-green rounded-full pl-5 pr-2 py-2 shadow-sm transition-colors">
            <Search size={18} className="text-planthia-dark/40 flex-shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder="Ej: monstera, lavanda, potus…"
              aria-label="Buscar una planta"
              className="flex-1 min-w-0 bg-transparent outline-none text-base text-planthia-dark placeholder:text-planthia-dark/40 py-2"
            />
            {query && (
              <button onClick={() => setParam('q', '')} aria-label="Borrar búsqueda" className="p-2 text-planthia-dark/40 hover:text-planthia-dark cursor-pointer">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filtros rápidos: en celular se deslizan de costado */}
          <div className="mt-6 -mx-6 px-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-2 w-max mx-auto">
              {GUIDE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setParam('filtro', f.id)}
                  className={`btn btn-sm ${filterId === f.id ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Resultados */}
        <p className="text-xs font-bold tracking-[0.15em] uppercase text-planthia-dark/50 mt-10 mb-5">
          {loading ? 'Cargando fichas…' : `${plants.length} ${plants.length === 1 ? 'ficha' : 'fichas'}`}
        </p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : plants.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {plants.map((plant) => <GuideCard key={plant.documentId} plant={plant} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-headline font-extrabold text-2xl text-planthia-dark mb-2">Todavía no tenemos esa ficha</p>
            <p className="text-planthia-dark/60 mb-6">Probá con otro nombre o sacá los filtros.</p>
            <button onClick={() => router.replace(pathname)} className="btn btn-secondary btn-md">Ver todas las plantas</button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function GuidePage() {
  return (
    <Suspense fallback={null}>
      <GuideContent />
    </Suspense>
  );
}
