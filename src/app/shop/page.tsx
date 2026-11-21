"use client";

import CategorySelector, { TypeSwitch } from '@/components/shop/CategorySelector';
// import HeroShop from '@/components/shop/HeroShop';
import PageHeader from '@/components/layout/PageHeader';
import Pagination from '@/components/shop/Pagination';
import ProductGrid from '@/components/shop/ProductGrid';
import ShopToolbar from '@/components/shop/ShopToolbar';
import { usePlants } from '@/hooks/usePlants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, Suspense } from 'react';

// Normaliza texto para comparar: minúsculas y sin tildes ("Indirecta" → "indirecta", "Fácil" → "facil")
const normalize = (value: unknown) =>
  String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

// En Strapi light y difficulty son texto libre: en vez de exigir el valor exacto,
// se busca la palabra clave del filtro dentro del texto ("Luz indirecta brillante" coincide con "indirecta")
const matchesAny = (productValue: unknown, filterValues: string[]) => {
  const text = normalize(productValue);
  return filterValues.some((value) => text.includes(normalize(value)));
};

// Casillas de luz que vienen de Strapi (metadata.light_shade / light_indirect / light_sun)
const LIGHT_FLAGS: Record<string, string> = {
  sombra: 'light_shade',
  indirecta: 'light_indirect',
  sol: 'light_sun',
};

// Usa las casillas si el producto las tiene; si no (backend sin actualizar), busca la palabra en el texto
const matchesLight = (metadata: any, filterValues: string[]) => {
  const hasFlags = typeof metadata?.light_sun === 'boolean';
  if (!hasFlags) return matchesAny(metadata?.light, filterValues);
  return filterValues.some((value) => metadata?.[LIGHT_FLAGS[value]] === true);
};

const ShopPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { plants, loading } = usePlants();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const hasFilters = params.get('light') || params.get('difficulty') || params.get('petFriendly') || params.get('sort');

    if (hasFilters) {
      const type = params.get('type') || 'plantas';
      const category = params.get('category') || 'todas';
      router.replace(`/shop?type=${type}&category=${category}`, { scroll: false });
    }
  }, []);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  //para el skeleton loading
  const [isLoading, setIsLoading] = useState(false);

  const typeQuery = searchParams.get('type') || 'plantas';
  const categoryQuery = searchParams.get('category') || 'todas';
  const sortQuery = searchParams.get('sort') || 'relevancia';
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const lightQuery = searchParams.get('light') || '';
  const petQuery = searchParams.get('petFriendly') === 'true';
  const diffQuery = searchParams.get('difficulty') || '';

  const sortLabels: Record<string, string> = {
    relevancia: 'Relevancia',
    'precio-bajo': 'Menor precio',
    'precio-alto': 'Mayor precio'
  };

  const activeFiltersText = useMemo(() => {
    const parts = [];
    if (searchQuery) parts.push(`"${searchQuery}"`);
    if (categoryQuery !== 'todas') parts.push(categoryQuery);
    if (lightQuery) parts.push(lightQuery.split(',').join(' & '));
    if (diffQuery) parts.push(diffQuery.split(',').join(' & '));
    if (petQuery) parts.push("Pet Friendly");
    return parts.length > 0 ? parts.join(' + ') : "";
  }, [searchQuery, categoryQuery, lightQuery, diffQuery, petQuery]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key !== 'search') {
      params.delete('search');
    }

    if (key === 'type') {
      params.set('type', value);
      params.delete('category');
      // Los filtros de luz, dificultad y mascotas son solo de plantas:
      // si quedaban activos, Insumos mostraba 0 resultados
      params.delete('light');
      params.delete('difficulty');
      params.delete('petFriendly');
    } else if (value === 'todas' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    if (!plants?.length) return [];
    let results = plants;

    if (searchQuery) {
      results = results.filter((product) => {
        const matchesName = product.name?.toLowerCase().includes(searchQuery);
        const matchesTags = product.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery)
        );
        return matchesName || matchesTags;
      });
    }

    if (!searchQuery) {
      results = results.filter((product) => {
        if (typeQuery !== 'todas' && product.type !== typeQuery) return false;
        if (categoryQuery !== 'todas' &&
          product.subcategory?.name?.toLowerCase() !== categoryQuery.toLowerCase()) return false;
        if (lightQuery) {
          const lightValues = lightQuery.split(',');
          if (!matchesLight(product.metadata, lightValues)) return false;
        }
        if (petQuery && !product.metadata?.pet_friendly) return false;
        if (diffQuery) {
          const diffValues = diffQuery.split(',');
          if (!matchesAny(product.metadata?.difficulty, diffValues)) return false;
        }

        return true;
      });
    }
    // Ordenamiento (sobre una copia: sort() modifica el array y "Relevancia" ya no volvía al orden original)
    return [...results].sort((a, b) => {
      if (sortQuery === 'precio-bajo') return (a.price || 0) - (b.price || 0);
      if (sortQuery === 'precio-alto') return (b.price || 0) - (a.price || 0);
      return 0;
    });
  }, [plants, typeQuery, categoryQuery, searchQuery, lightQuery, petQuery, diffQuery, sortQuery]);

  const [productsPerPage, setProductsPerPage] = useState(8);

  useEffect(() => {
    const updateLimit = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setProductsPerPage(9);
      } else {
        setProductsPerPage(8);
      }
    };
    updateLimit();
    window.addEventListener('resize', updateLimit);
    return () => window.removeEventListener('resize', updateLimit);
  }, []);

  // Paginación (8 por página)
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Volver a la página 1 cuando cambia cualquier filtro (si no, podía quedar una página vacía)
  useEffect(() => { setCurrentPage(1); }, [searchQuery, typeQuery, categoryQuery, lightQuery, diffQuery, petQuery, sortQuery, productsPerPage]);

  return (
    <div className="min-h-screen bg-cream pb-16 ">
      {/* Banner con foto anterior: se reemplazó por el encabezado limpio (mismo estilo que la guía y el blog) */}
      {/* <HeroShop /> */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">

        <PageHeader
          eyebrow="#TuJunglaUrbana"
          title="Tienda"
          subtitle="Plantas y todo lo que necesitan para crecer."
        >
          <TypeSwitch typeQuery={typeQuery} hasSearch={!!searchQuery} onFilterChange={updateFilter} />
        </PageHeader>

        <CategorySelector
          typeQuery={typeQuery}
          categoryQuery={categoryQuery}
          hasSearch={!!searchQuery}
          onFilterChange={updateFilter}
          withTypeSwitch={false}
        />

        <ShopToolbar
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          isSortOpen={isSortOpen}
          setIsSortOpen={setIsSortOpen}
          lightQuery={lightQuery}
          diffQuery={diffQuery}
          petQuery={petQuery}
          sortQuery={sortQuery}
          typeQuery={typeQuery}
          totalProducts={filteredProducts.length}
          updateFilter={updateFilter}
          sortLabels={sortLabels}
        />

        {/* Grilla de Productos */}
        {loading ? (
          <ProductGrid
            products={Array(8).fill({})}
            isLoading={true}
            activeFiltersText={activeFiltersText}
            productsPerPage={productsPerPage}
          />
        ) : (
          <ProductGrid
            products={currentProducts}
            isLoading={false}
            activeFiltersText={activeFiltersText}
            productsPerPage={productsPerPage}
          />
        )}

        {/* Paginación */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

const ShopPage = () => {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  );
};

export default ShopPage;