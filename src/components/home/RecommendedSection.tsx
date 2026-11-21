//src/components/products/RecommendedSection.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../products/ProductCard';

// Máximo de plantas destacadas en el carrusel de la home
const MAX_FEATURED = 10;

const RecommendedSection = ({ plants }: { plants: any[] }) => {
  const featuredPlants = plants.slice(0, MAX_FEATURED);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  const mobilePlants = plants.slice(0, MAX_FEATURED);

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


  return (
    <>
    {/* Encabezado: mismo sistema que "Explorá por categoría" */}
    <div className="pt-16 sm:pt-20 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto flex items-end justify-between gap-6 mb-8 sm:mb-10">
      <div>
        <span className="font-headline font-bold tracking-[0.2em] text-xs text-planthia-dark mb-3 block uppercase">
          #LasMásElegidas
        </span>
        <h2 className="font-headline font-extrabold text-3xl sm:text-4xl xl:text-5xl leading-[1.1] text-planthia-dark">
          Más vendidas
        </h2>
        <p className="font-body text-planthia-dark/60 mt-3 text-base sm:text-lg max-w-xl leading-relaxed">
          Las favoritas de nuestra comunidad verde.
        </p>
      </div>
      <Link
        href="/shop"
        className="group hidden md:inline-flex flex-none items-center gap-2 pb-2 font-headline font-bold text-xs uppercase tracking-[0.15em] text-planthia-green hover:text-planthia-green-dark transition-colors"
      >
        Ver todo el shop
        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>

    <section aria-label="Más vendidas" className="pt-2 lg:pt-4 pb-8 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto bg-[#F7F5F0]">
      {/* VISTA MOBILE: Scroll horizontal nativo */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 -mr-4 pr-4 snap-x snap-mandatory">
          {mobilePlants.map((plant) => (
            <div key={`mobile-${plant.id}`} className="min-w-[280px] max-w-[320px] snap-center flex-shrink-0">
              <ProductCard
                plant={plant}
                isActive={activeId === plant.id}
                onClick={(e: React.MouseEvent) => handleCardClick(plant.id, e)}
              />
            </div>
          ))}
        </div>
        {/* <div className="flex justify-center mt-6">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div> */}
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
              <div key={`carousel-${plant.id}`} className="pt-6 pb-4 lg:pt-14 lg:pb-6 w-full">
                
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

    </section>
    </>
  );
};

export default RecommendedSection;