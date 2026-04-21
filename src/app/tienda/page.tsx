"use client";

import CategoryFilters from '@/components/shop/CategoryFilters';
import HeroTienda from '@/components/shop/HeroTienda';
import Pagination from '@/components/shop/Pagination';
import ProductGrid from '@/components/shop/ProductGrid';
import ShopToolbar from '@/components/shop/ShopToolbar';
import { usePlants } from '@/hooks/usePlants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const TiendaPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { plants, loading } = usePlants();

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

    if (key === 'type') {
      params.set('type', value);
      params.delete('category');
    } else if (value === 'todas' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    if (!plants?.length) return [];

    return plants.filter((product) => {
      // 1. FILTRO POR TIPO (Plantas/Cuidados)
      if (typeQuery !== 'todas' && product.type !== typeQuery) return false;
      // 2. FILTRO POR SUBCATEGORÍA
      if (categoryQuery !== 'todas' &&
        product.subcategory?.name?.toLowerCase() !== categoryQuery.toLowerCase()) return false;
      // 3. FILTRO POR BÚSQUEDA
      if (searchQuery) {
        const matchesName = product.name?.toLowerCase().includes(searchQuery);
        const matchesTags = product.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery)
        );
        if (!matchesName && !matchesTags) return false;
      }
      // 4. FILTRO POR LUZ (light)
      if (lightQuery) {
        const lightValues = lightQuery.split(',');
        if (!lightValues.includes(product.metadata?.light)) return false;
      }
      // 5. FILTRO PET FRIENDLY
      if (petQuery && !product.metadata?.pet_friendly) return false;
      // 6. FILTRO POR DIFICULTAD (difficulty)
      if (diffQuery) {
        const diffValues = diffQuery.split(',');
        if (!diffValues.includes(product.metadata?.difficulty)) return false;
      }
      

      return true;
    }).sort((a, b) => {
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

  useEffect(() => { setCurrentPage(1); }, [searchQuery, categoryQuery, productsPerPage]);

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16 ">
      <HeroTienda />
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Selector de Planta vs Cuidado */}
        <div className="flex gap-4 justify-center my-6">
          <button
            onClick={() => updateFilter('type', 'plantas')}
            className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full cursor-pointer text-xs md:text-sm font-bold transition-all border ${typeQuery === 'plantas' ? 'bg-[#5B823B] text-white border-[#5B823B]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#5B823B] hover:text-[#5B823B]'}`}
          >
            Plantas
          </button>
          <button
            onClick={() => updateFilter('type', 'cuidados')}
            className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full cursor-pointer text-xs md:text-sm font-bold transition-all border ${typeQuery === 'cuidados' ? 'bg-[#5B823B] text-white border-[#5B823B]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#5B823B] hover:text-[#5B823B]'}`}
          >
            Cuidados
          </button>
        </div>

        <CategoryFilters
          type={typeQuery}
          categoryQuery={categoryQuery}
          onFilterChange={updateFilter}
        />

        {/* BARRA DE HERRAMIENTAS */}
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

        {/* Paginación dinámica */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TiendaPage;