"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/shop-1.webp',
  '/shop-2.webp',
  '/shop-3.webp',
];

const HeroShop = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
  <section className="relative w-full h-[200px] md:h-[240px] lg:h-[clamp(150px,calc(44vh-200px),260px)] mt-[-96px] overflow-hidden mb-10 md:mb-12 [@media(min-width:1024px)_and_(max-height:850px)]:mb-8 bg-planthia-dark">
  {/* Carrusel de Imágenes: fundido cruzado (la nueva aparece mientras la anterior se va),
      sobre fondo oscuro, así no se ve el destello claro entre imagen e imagen */}
  <AnimatePresence initial={false}>
    <motion.img
      key={index}
      src={images[index]}
      alt=""
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className="absolute inset-0 w-full h-full object-cover"
    />
  </AnimatePresence>

  {/*FILTRO OSCURO */}
  <div className="absolute inset-0 bg-black/50" />

  {/* Contenido */}
  <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
    <motion.h1 
      className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7] tracking-[0.12em] sm:tracking-[0.2em] uppercase"
      style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.3)' }}
    >
      Nuestra Colección
    </motion.h1>
    <div className="w-12 sm:w-16 h-[1px] bg-[#FDFBF7]/50 my-3 sm:my-4" />
    <p className="text-sm sm:text-base text-[#FDFBF7]/80 font-light tracking-wide italic max-w-md sm:max-w-none">
      Explorá nuestra selección premium de plantas y todo para su cuidado.
    </p>
  </div>
</section>
  );
};

export default HeroShop;