"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SlidersHorizontal, ChevronDown, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import productsData from '@/data/products.json';
import ProductCardShop from '@/components/products/ProductCardShop';
import HeroTienda from '@/components/shop/HeroTienda';
import ProductSkeleton from '@/components/products/ProductSkeleton';

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
    router.push(`${pathname}?${params.toString()}`);
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

  // 3. Paginación (6 por página)
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, categoryQuery]);

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16 ">
      <HeroTienda />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* CATEGORÍAS (PILLS)*/}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {['todas', 'interior', 'exterior', 'aromaticas'].map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter('category', cat)}

              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all border ${categoryQuery === cat
                ? 'bg-[#5B823B] text-white border-[#5B823B]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#5B823B] hover:text-[#5B823B]'
                }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* BARRA DE HERRAMIENTAS */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 md:pb-6 mb-6 md:mb-12">
          {/* SECCIÓN FILTRAR */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#5B823B] transition-colors focus:outline-none"
              >
                <SlidersHorizontal size={18} />
                FILTRAR
                <motion.div animate={{ rotate: isFilterOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={16} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsFilterOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-12 left-0 w-64 bg-white shadow-2xl rounded-2xl p-6 z-40 border border-gray-100 origin-top-left"
                    >
                      <div className="mb-6">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Necesidad de Luz</p>
                        <div className="space-y-2">
                          {['sombra', 'indirecta', 'sol'].map((luz) => (
                            <label key={luz} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={lightQuery.split(',').includes(luz)}
                                onChange={() => {
                                  const current = lightQuery ? lightQuery.split(',') : [];
                                  const next = current.includes(luz) ? current.filter(l => l !== luz) : [...current, luz];
                                  updateFilter('light', next.join(','));
                                }}
                                className="w-4 h-4 rounded border-gray-300 accent-planthia-green text-[#5B823B] focus:ring-[#5B823B]"
                              />
                              <span className="text-sm text-gray-600 group-hover:text-[#5B823B] capitalize">{luz}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6 border-t border-gray-100 pt-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Dificultad</p>
                        <div className="space-y-2">
                          {['principiante', 'experto'].map((dif) => (
                            <label key={dif} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={diffQuery.split(',').includes(dif)}
                                onChange={() => {
                                  const current = diffQuery ? diffQuery.split(',') : [];
                                  const next = current.includes(dif) ? current.filter(d => d !== dif) : [...current, dif];
                                  updateFilter('difficulty', next.join(','));
                                }}
                                className="w-4 h-4 rounded border-gray-300 accent-planthia-green text-[#5B823B] focus:ring-[#5B823B]"
                              />
                              <span className="text-sm text-gray-600 group-hover:text-[#5B823B] capitalize">{dif}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm font-bold text-gray-600">Pet Friendly 🐾</span>
                          <input
                            type="checkbox"
                            checked={petQuery}
                            onChange={() => updateFilter('petFriendly', (!petQuery).toString())}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#5B823B] relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <span className="hidden md:block w-full md:w-auto text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] md:text-center">
              {filteredProducts.length} Productos encontrados
            </span>
          </div>

          {/* Selector Ordenar */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#5B823B] transition-all uppercase tracking-wider focus:outline-none"
            >
              <ArrowUpDown size={18} className="text-gray-500" />

              <span>{sortLabels[sortQuery]}</span>

              <motion.div
                animate={{ rotate: isSortOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsSortOpen(false)} />

                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-10 w-60 bg-white shadow-2xl rounded-2xl p-2 z-40 border border-gray-100 origin-top-right"
                  >
                    {Object.entries(sortLabels).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => {
                          updateFilter('sort', value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-colors ${sortQuery === value
                          ? 'bg-[#5B823B]/10 text-[#5B823B] font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Grilla de Productos */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 xl:gap-18">
            {isLoading
              ? // Mostramos 6 esqueletos mientras carga
              Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
              : // Mostramos los productos reales
              currentProducts.map((product) => (
                <ProductCardShop key={product.id} product={product} />
              ))
            }
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center">
            <p className="text-xl text-gray-500">
              No encontramos ninguna plantita que coincida con  <span className="font-bold text-[#5B823B] capitalize">"{activeFiltersText}"</span>
            </p>
            <button
              onClick={() => window.location.href = '/tienda'}
              className="mt-4 text-[#5B823B] font-bold underline"
            >
              Ver toda la colección
            </button>
          </div>
        )}

        {/* Paginación dinámica */}
        {filteredProducts.length > productsPerPage && (
          <div className="mt-16 flex justify-center items-center gap-2">
            {/* Botón Anterior */}
            <button
              onClick={() => {
                setCurrentPage(prev => Math.max(prev - 1, 1));
                window.scrollTo(0, 0);
              }}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-[#5B823B] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              &lt;
            </button>

            {/* Números de página dinámicos */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => {
                  setCurrentPage(num);
                  window.scrollTo(0, 0);
                }}
                className={`w-10 h-10 rounded-lg font-bold transition-colors ${num === currentPage
                  ? 'bg-[#5B823B] text-white'
                  : 'text-gray-500 hover:bg-[#5B823B]/20'
                  }`}
              >
                {num}
              </button>
            ))}

            {/* Botón Siguiente */}
            <button
              onClick={() => {
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                window.scrollTo(0, 0);
              }}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-[#5B823B] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TiendaPage;