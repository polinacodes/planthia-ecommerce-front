//src/components/products/RecommendedSection.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../products/ProductCard';

const RecommendedSection = ({ plants }: { plants: any[] }) => {
  const featuredPlants = plants.slice(0, 6);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  const mobilePlants = plants.slice(0, 3);

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeId !== null) {
        setActiveId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeId]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(1);
      else if (width < 1280) setVisibleCount(2);
      else if (width < 1536) setVisibleCount(3);
      else setVisibleCount(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = featuredPlants.length - visibleCount;

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visiblePlants = featuredPlants.slice(currentIndex, currentIndex + visibleCount);

  const handleCardClick = (plantId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveId(activeId === plantId ? null : plantId);
  };

  console.log("Plantas recibidas en RecommendedSection:", plants);

  return (
    <section className="pt-12 pb-12 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto bg-[#F7F5F0]">
      {/* Encabezado */}
      <div className="mb-14 md:mb-4">
        <h2 className="text-3xl xl:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">Recomendados</h2>
        <p className="text-gray-400 mt-3 text-lg font-medium">Las plantas ideales para armar tu jungla urbana.</p>
      </div>

      {/* VISTA MOBILE: Scroll vertical */}
      <div className="md:hidden">
        <div className="flex flex-col gap-10 max-h-[700px] overflow-y-auto pr-2 pb-4">
          {mobilePlants.map((plant) => (
            <ProductCard
              key={`mobile-${plant.id}`}
              plant={plant}
              isActive={activeId === plant.id}
              onClick={(e: React.MouseEvent) => handleCardClick(plant.id, e)}
            />
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* VISTA TABLET/DESKTOP: Carrusel horizontal */}
      <div className="hidden md:block relative">
        {/* Flecha Izquierda */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 lg:-translate-x-6 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#5B823B] hover:bg-[#5B823B] hover:text-white transition-all duration-300 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        {/* Grid de cards */}
        <div className="w-full">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0.6, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.5 }}
            className={`grid gap-4 lg:gap-6 ${visibleCount === 2 ? 'grid-cols-2' :
                visibleCount === 3 ? 'grid-cols-3' :
                  'grid-cols-4'
              }`}
          >
            {visiblePlants.map((plant) => (
              <div key={`carousel-${plant.id}`} className="py-14 w-full">
                
                <ProductCard
                  plant={plant}
                  isActive={activeId === plant.id}
                  onClick={(e: React.MouseEvent) => handleCardClick(plant.id, e)}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Flecha Derecha */}
        <button
          onClick={nextSlide}
          disabled={currentIndex >= maxIndex}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 lg:translate-x-6 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#5B823B] hover:bg-[#5B823B] hover:text-white transition-all duration-300 ${currentIndex >= maxIndex ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      </div>

      {/* Botón "Ver todos" */}
      <div className="flex justify-end mt-8">
        <Link
          href="/tienda"
          className="bg-planthia-green text-white px-8 py-3 rounded-full font-bold text-sm md:text-base hover:bg-opacity-90 transition-all shadow-lg shadow-planthia-green/20 active:scale-95"
        >
          Ver toda la colección
        </Link>
      </div>
    </section>
  );
};

export default RecommendedSection;