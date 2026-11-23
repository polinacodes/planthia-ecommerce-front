// src/components/home/RecommendedSection.tsx
// "Más vendidas": carrusel con las mismas tarjetas del shop.
// La versión anterior (tarjetas horizontales que se agrandan) está guardada en src/components/_archive/home-cards
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Reveal } from '@/components/motion/Reveal';
import ProductCardShop from '../products/ProductCardShop';

// Máximo de plantas destacadas en el carrusel de la home
const MAX_FEATURED = 10;

const RecommendedSection = ({ plants }: { plants: any[] }) => {
  const featuredPlants = plants.slice(0, MAX_FEATURED);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  // Las tarjetas aparecen en cascada solo la primera vez que se ven (después, el carrusel usa su propia animación)
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const cardReveal = (index: number, isLast: boolean) =>
    revealed || reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '0px 0px -8% 0px' },
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: index * 0.08 },
          onAnimationComplete: isLast ? () => setRevealed(true) : undefined,
        };

  const mobilePlants = plants.slice(0, MAX_FEATURED);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Desde tablet: 3 tarjetas; desde 1280px: 4 (igual que la grilla del shop)
      if (width < 1280) setVisibleCount(3);
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


  return (
    <>
    {/* Encabezado: mismo sistema que "Explorá por categoría" */}
    <Reveal className="mt-12 lg:-mt-[110px] xl:mt-0 2xl:mt-0 min-[1921px]:!mt-0 pt-4 sm:pt-6 px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto flex items-end justify-between gap-6 mb-8 sm:mb-10 md:mb-6">
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
    </Reveal>

    <section aria-label="Más vendidas" className="pt-2 md:pt-0 pb-8 px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto bg-[#F7F5F0]">
      {/* VISTA MOBILE: Scroll horizontal nativo */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 scroll-px-4 sm:scroll-px-6 snap-x snap-mandatory">
          {mobilePlants.map((plant, index) => (
            // En celular se ven dos tarjetas y asoma la tercera, para que se note que se desliza
            <motion.div key={`mobile-${plant.id}`} {...(index < 2 ? cardReveal(index, index === Math.min(mobilePlants.length, 2) - 1) : {})} className="w-[44%] sm:w-[30%] snap-start flex-shrink-0 [&>*]:h-full">
              <ProductCardShop product={plant} />
            </motion.div>
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
          aria-label="Ver plantas anteriores"
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 lg:-translate-x-6 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#4F7A2E] hover:bg-[#4F7A2E] hover:text-white transition-all duration-300 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
            className={`grid gap-4 lg:gap-6 ${visibleCount === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}
          >
            {visiblePlants.map((plant, index) => (
              <motion.div key={`carousel-${plant.id}`} {...cardReveal(index, index === visiblePlants.length - 1)} className="pt-4 pb-4 lg:pb-6 w-full [&>*]:h-full">
                <ProductCardShop product={plant} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Flecha Derecha */}
        <button
          onClick={nextSlide}
          aria-label="Ver más plantas"
          disabled={currentIndex >= maxIndex}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 lg:translate-x-6 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#4F7A2E] hover:bg-[#4F7A2E] hover:text-white transition-all duration-300 ${currentIndex >= maxIndex ? 'opacity-0 pointer-events-none' : 'opacity-100'
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