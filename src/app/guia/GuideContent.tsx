// src/app/guia/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { usePlants } from '@/hooks/usePlants';
import GuideCard from '@/components/guide/GuideCard';
import PageHeader from '@/components/layout/PageHeader';
import Pagination from '@/components/shop/Pagination';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import TextTabs from '@/components/layout/TextTabs';
import { GUIDE_FILTERS, GuideFilterId, isGuidePlant, matchesSearch } from '@/lib/guide';

// initialPlants llega desde el servidor (page.tsx): las fichas ya vienen en el HTML,
// así el footer no "salta" y la primera foto se descarga enseguida
export default function GuideContent({ initialPlants }: { initialPlants?: any[] | null }) {
  const { plants: products, loading } = usePlants(initialPlants);
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

  // 12 fichas por página (entran justo en 2, 3 o 4 columnas). Al cambiar búsqueda o filtro, vuelve a la 1
  const PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => { setCurrentPage(1); }, [filterId, query]);
  const totalPages = Math.ceil(plants.length / PER_PAGE);
  const pagePlants = plants.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // En la primera carga, las 4 primeras fichas aparecen sin animación (si arrancan invisibles, empeora el LCP).
  // Al buscar, filtrar o cambiar de página, vuelve la cascada
  const gridKey = `${filterId}-${query}-${currentPage}`;
  const firstKey = useRef<string | null>(null);
  if (!loading && firstKey.current === null) firstKey.current = gridKey;
  const isFirstLoad = gridKey === firstKey.current;

  return (
    <main className="min-h-screen bg-planthia-cream pb-24">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
        {/* Encabezado limpio (mismo estilo que la tienda y el blog), con el buscador a la derecha */}
        <PageHeader
          eyebrow="#GuíaPlanthia"
          title="Guía de cuidados"
          subtitle="Buscá tu planta y te contamos cómo cuidarla: luz, riego, sustrato y todo lo que necesita."
        >
          <div className="md:w-[380px] flex items-center gap-3 bg-white border-[1.5px] border-[#dfe5d8] focus-within:border-planthia-green rounded-full pl-5 pr-2 py-1.5 transition-colors">
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
        </PageHeader>

        {/* Filtros rápidos en texto */}
        <div className="border-b border-planthia-dark/10">
          <TextTabs
            tabs={GUIDE_FILTERS.map((f) => ({
              label: f.label,
              active: filterId === f.id,
              onClick: () => setParam('filtro', f.id),
            }))}
          />
        </div>

        {/* Resultados */}
        <p className="text-xs font-bold tracking-[0.15em] uppercase text-planthia-dark/70 mt-6 mb-5">
          {loading ? 'Cargando fichas…' : `${plants.length} ${plants.length === 1 ? 'ficha' : 'fichas'}`}
        </p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : plants.length > 0 ? (
          <RevealGroup key={gridKey} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" stagger={0.05}>
            {pagePlants.map((plant, i) =>
              isFirstLoad && i < 4 ? (
                <div key={plant.documentId} className="h-full [&>*]:h-full">
                  <GuideCard plant={plant} priority={i < 2} />
                </div>
              ) : (
                <RevealItem key={plant.documentId} className="h-full [&>*]:h-full">
                  <GuideCard plant={plant} />
                </RevealItem>
              )
            )}
          </RevealGroup>
        ) : (
          <div className="text-center py-16">
            <p className="font-headline font-extrabold text-2xl text-planthia-dark mb-2">Todavía no tenemos esa ficha</p>
            <p className="text-planthia-dark/60 mb-6">Probá con otro nombre o sacá los filtros.</p>
            <button onClick={() => router.replace(pathname)} className="btn btn-secondary btn-md">Ver todas las plantas</button>
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </main>
  );
}
