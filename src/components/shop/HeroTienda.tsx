"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/tienda-1.webp',
  '/tienda-2.webp',
  '/tienda-3.webp',
];

const HeroTienda = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
   <section className="relative w-screen left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] h-[35vh] md:h-[42vh] mt-[-96px] overflow-hidden mb-16">
  {/* Carrusel de Imágenes */}
  <AnimatePresence mode="wait">
    <motion.img
      key={index}
      src={images[index]}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 w-full h-full object-cover"
    />
  </AnimatePresence>

  {/*FILTRO OSCURO */}
  <div className="absolute inset-0 bg-black/50" />

  {/* Contenido */}
  <div className="relative h-full flex flex-col justify-center items-center text-center pt-16 px-6">
    <motion.h1 
      className="text-4xl md:text-5xl font-bold text-[#FDFBF7] tracking-[0.2em] uppercase"
      style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.3)' }}
    >
      Nuestra Colección
    </motion.h1>
    <div className="w-16 h-[1px] bg-[#FDFBF7]/50 my-4" />
    <p className="text-[#FDFBF7]/80 font-light tracking-wide italic">
      Explorá nuestra selección premium de plantas
    </p>
  </div>
</section>
  );
};

export default HeroTienda;