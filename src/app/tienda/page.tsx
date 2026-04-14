"use client";

import CategoryFilters from '@/components/shop/CategoryFilters';
import HeroTienda from '@/components/shop/HeroTienda';
import Pagination from '@/components/shop/Pagination';
import ProductGrid from '@/components/shop/ProductGrid';
import ShopToolbar from '@/components/shop/ShopToolbar';
import productsData from '@/data/products.json';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const TiendaPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isSortOpen, setIsSortOpen] = useState(false);
  //para el skeleton loading
  const [isLoading, setIsLoading] = useState(false);

  const sortQuery = searchParams.get('sort') || 'relevancia';

  const sortLabels: Record<string, string> = {
    relevancia: 'Relevancia',
    'precio-bajo': 'Menor precio',
    'precio-alto': 'Mayor precio'
  };

  // 1. Obtener filtros de la URL
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const categoryQuery = searchParams.get('category') || 'todas';
  const lightQuery = searchParams.get('light') || '';
  const petQuery = searchParams.get('petFriendly') === 'true';
  const diffQuery = searchParams.get('difficulty') || '';

  //texto dinamico de filtros activos
  const activeFiltersText = useMemo(() => {
    const parts = [];
    if (searchQuery) parts.push(`"${searchQuery}"`);
    if (categoryQuery !== 'todas') parts.push(categoryQuery);
    if (lightQuery) parts.push(lightQuery.split(',').join(' & '));
    if (diffQuery) parts.push(diffQuery.split(',').join(' & '));
    if (petQuery) parts.push("Pet Friendly");

    return parts.length > 0 ? parts.join(' + ') : "";
  }, [searchQuery, categoryQuery, lightQuery, diffQuery, petQuery]);

  // Función para actualizar la URL (Filtros)
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'todas' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  //Lógica de filtrado
  const filteredProducts = useMemo(() => {
    let result = productsData.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery));

      const matchesCategory = categoryQuery === 'todas' ||
        (Array.isArray(product.category)
          ? product.category.some(cat => cat.toLowerCase() === categoryQuery.toLowerCase())
          : product.category.toLowerCase() === categoryQuery.toLowerCase());
      const matchesLight = !lightQuery || lightQuery.split(',').includes(product.light);
      const matchesPet = !petQuery || product.petFriendly === true;
      const matchesDiff = !diffQuery || diffQuery.split(',').includes(product.difficulty);

      return matchesSearch && matchesCategory && matchesLight && matchesPet && matchesDiff;
    });

    if (sortQuery === 'precio-bajo') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortQuery === 'precio-alto') {
      result.sort((a, b) => b.price - a.price);
    }
    return result;
  }, [searchQuery, categoryQuery, lightQuery, petQuery, diffQuery, sortQuery]);

  
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

  // 3. Paginación (8 por página)
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
        {/* CATEGORÍAS (PILLS)*/}
        <CategoryFilters
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
          totalProducts={filteredProducts.length}
          updateFilter={updateFilter}
          sortLabels={sortLabels}
        />

        {/* Grilla de Productos */}
        <ProductGrid
          products={currentProducts}
          isLoading={isLoading}
          activeFiltersText={activeFiltersText}
          productsPerPage={productsPerPage}
        />

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