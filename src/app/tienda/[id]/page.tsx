"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import products from '@/data/products.json';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Droplets, Thermometer, ArrowUp, Heart } from "lucide-react";
import Link from 'next/link'

export default function ProductPage() {
  const params = useParams();
  const id = params.id;


  const product = useMemo(() => {
    return products.find((p) => p.id === id);
  }, [id]);


  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (product) setSelectedImage(product.image);
  }, [product]);

  // Función auxiliar para los colores de los círculos
  const getHexColor = (color: string) => {
    const colors: { [key: string]: string } = {
      rojo: "#e11d48",
      rosa: "#fb7185",
      "rosa intenso": "#be123c",
      "rosa palido": "#fda4af",
      violeta: "#7c3aed",
      magenta: "#d946ef",
      blanco: "#ffffff",
      naranja: "#f97316",
      amarillo: "#facc15",
      salmon: "#fa8072",
      burdeos: "#800020",
    };
    return colors[color.toLowerCase()] || "#cbd5e1";
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-planthia-cream flex items-center justify-center">
        <p className="text-planthia-dark font-serif">Planta no encontrada</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-planthia-cream pt-6 md:pt-12">
      <div className="max-w-7xl mx-auto px-8">

        {/* Nav / Breadcrumbs */}
        <nav className="text-[10px] uppercase tracking-[0.2em] text-planthia-dark/60 mb-12">
          <Link href="/tienda" className="hover:text-planthia-green transition-colors">
            Tienda
          </Link>
          <span className="mx-2 text-planthia-dark/30">/</span>

          <Link
            href={`/tienda?category=${Array.isArray(product.category) ? product.category[0].toLowerCase() : product.category.toLowerCase()}`}
            className="hover:text-planthia-green transition-colors"
          >
            {Array.isArray(product.category) ? product.category[0] : product.category}
          </Link>

          <span className="mx-2 text-planthia-dark/30">/</span>
          <span className="text-planthia-dark font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 min-h-[600px] items-start">

          {/* Lado Izquierdo: Imagen */}
          <div className="flex items-center justify-center p-2">
            <div className="relative w-full h-[400px] md:h-[650px] bg-planthia-cream rounded-[3rem] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-2 transition-transform duration-500 ease-in-out hover:scale-105"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>


          {/* Lado Derecho: Contenido */}
          <div className="flex flex-col justify-center space-y-8 lg:pl-12">

            {/* Pills, Título y Descripción */}
            <div className="space-y-4">

              {/* Badges */}
              <div className="flex gap-3">
                {/* <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-planthia-light-green/70 text-planthia-cream">
                  {product.difficulty}
                </span> */}
                {product.petFriendly && (
                  <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border border-planthia-light-green/70 text-planthia-light-green/70">
                    Pet Friendly
                  </span>
                )}
              </div>

              {/* Título y Descripción */}
              <h1 className="text-5xl md:text-6xl font-manrope text-planthia-dark leading-tight">
                {product.name}
              </h1>
              <p className="text-planthia-dark/60 text-lg leading-relaxed max-w-md italic">
                {product.description}
              </p>
            </div>


            {/* Grid de Cuidados */}
            <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-10 border-y border-planthia-dark/10">

              {/* Luz */}
              <div className="flex gap-4 items-start">
                <Sun size={20} strokeWidth={1.5} className="text-planthia-dark/50" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-planthia-dark/50 mb-1">Luz</span>
                  <span className="text-xs font-bold text-planthia-dark uppercase">{product.light}</span>
                </div>
              </div>

              {/* Riego */}
              <div className="flex gap-4 items-start">
                <Droplets size={20} strokeWidth={1.5} className="text-planthia-dark/50" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-planthia-dark/50 mb-1">Riego</span>
                  <span className="text-xs font-bold text-planthia-dark uppercase">{product.water}</span>
                </div>
              </div>

              {/* Crecimiento */}
              <div className="flex gap-4 items-start">
                <ArrowUp size={20} strokeWidth={1.5} className="text-planthia-dark/50" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-planthia-dark/50 mb-1">Crecimiento</span>
                  <span className="text-xs font-bold text-planthia-dark uppercase">{product.growth}</span>
                </div>
              </div>

              {/* Humedad */}
              <div className="flex gap-4 items-start">
                <Thermometer size={20} strokeWidth={1.5} className="text-planthia-dark/50" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-planthia-dark/50 mb-1">Humedad</span>
                  <span className="text-xs font-bold text-planthia-dark uppercase">{product.humidity || "Media"}</span>
                </div>
              </div>
            </div>

            {/* Selector de Variantes */}
            {product.variants && (
              <div className="flex items-center gap-6">
                <div className="flex gap-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.color}
                      onClick={() => setSelectedImage(variant.image)}
                      className={`w-5 h-5 rounded-full border shadow-md transition-all duration-300 ${selectedImage === variant.image
                        ? 'scale-125 border-planthia-dark/30 '
                        : 'border-transparent opacity-70 hover:opacity-100 hover:scale-110'
                        }`}
                      style={{ backgroundColor: getHexColor(variant.color) }}
                      title={variant.color}
                    />
                  ))}
                </div>

                <span className="text-[10px] uppercase tracking-widest text-planthia-dark/50">
                  Colores disponibles
                </span>
              </div>
            )}


            {/* Precio y Botones */}
            <div className="flex items-center gap-6 pt-6">
              <span className="text-4xl font-light text-planthia-dark">
                ${product.price.toLocaleString()}
              </span>
              <button className="flex-1 bg-planthia-dark text-planthia-cream py-5 px-8 uppercase text-[10px] tracking-[0.2em] font-bold hover:bg-planthia-green transition-all duration-300">
                Añadir al carrito
              </button>
              <button className="p-4 rounded-full border border-planthia-dark/10 hover:bg-planthia-dark hover:text-planthia-cream transition-all group">
                <Heart size={20} strokeWidth={1.5} className="group-hover:fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

}




