"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import products from '@/data/products.json';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Droplets, Thermometer, ArrowUp, Heart, PawPrint } from "lucide-react";
import Link from 'next/link'
import ProductCardShop from '@/components/products/ProductCardShop';
import EmptyState from '@/components/products/EmptyState';

// --- SUB-COMPONENTES AUXILIARES ---

const CareItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex gap-4 items-start">
    <Icon size={20} strokeWidth={1.5} className="text-planthia-dark/50" />
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-planthia-dark/50 mb-1">{label}</span>
      <span className="text-xs font-bold text-planthia-dark uppercase">{value}</span>
    </div>
  </div>
);

export default function ProductPage() {
  const params = useParams();
  const id = params.id;

  const product = useMemo(() => products.find((p) => p.id === id), [id]);
  const [selectedImage, setSelectedImage] = useState<string>(product?.image || "");

  useEffect(() => {
    if (product) setSelectedImage(product.image);
  }, [product]);

  const getHexColor = (color: string) => {
    const colors: { [key: string]: string } = {
      rojo: "#e11d48", rosa: "#fb7185", "rosa intenso": "#be123c",
      "rosa palido": "#fda4af", violeta: "#7c3aed", magenta: "#d946ef",
      blanco: "#ffffff", naranja: "#f97316", amarillo: "#facc15",
      salmon: "#fa8072", burdeos: "#800020",
    };
    return colors[color.toLowerCase()] || "#cbd5e1";
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const currentCategory = Array.isArray(product.category) ? product.category[0] : product.category;

    return products
      .filter(p => {
        const pCategory = Array.isArray(p.category) ? p.category[0] : p.category;
        return pCategory === currentCategory && p.id !== product.id;
      })
      .slice(0, 4);
  }, [product, products]);


  if (!product) {
    return (
      <main className="min-h-screen bg-planthia-cream">
        <EmptyState
          title="La planta que buscas no está en nuestro jardín."
          description={<p>El ID <span className="font-bold text-[#5B823B]">{id}</span> no existe o fue movido,</p>}
        />
      </main>
    );
  }

  const VariantSelector = () => {
    if (!product?.variants || product.variants.length === 0) return null;
    return (
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
    );
  };

  return (
    <main className="min-h-screen bg-planthia-cream pt-6 md:pt-12">
      <div className="max-w-7xl mx-auto px-8">

        {/* 1. BREADCRUMBS */}
        <nav className="text-[10px] uppercase tracking-[0.2em] text-planthia-dark/60 mb-4">
          <Link href="/tienda" className="hover:text-planthia-green transition-colors">Tienda</Link>
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

          {/*COLUMNA IZQUIERDA: VISUALS */}
          <div className="flex flex-col p-2">
            <div className="relative w-full h-[400px] md:h-[650px] bg-planthia-cream rounded-[3rem] overflow-hidden">
              {product.petFriendly && (
                <div className="absolute top-8  z-10 bg-planthia-light-green/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                  <PawPrint size={14} className="text-planthia-dark" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-planthia-dark">Pet Friendly</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt={product.name}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-2 transition-transform duration-500 ease-in-out hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-planthia-cream/50 animate-pulse rounded-[3rem]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="md:hidden flex justify-center py-2">
              <VariantSelector />
            </div>
          </div>

          {/* COLUMNA DERECHA: INFO y COMPRA */}
          <div className="flex flex-col -mt-8 md:mt-16 justify-center space-y-8 lg:pl-12">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-manrope text-planthia-dark leading-tight">
                {product.name}
              </h1>
              <p className="text-planthia-dark/60 text-lg leading-relaxed max-w-md italic">
                {product.description}
              </p>
            </div>

            {/* Grid de Cuidados */}
            <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-10 border-y border-planthia-dark/10">
              <CareItem icon={Sun} label="Luz" value={product.light} />
              <CareItem icon={Droplets} label="Riego" value={product.water} />
              <CareItem icon={ArrowUp} label="Crecimiento" value={product.growth} />
              <CareItem icon={Thermometer} label="Humedad" value={product.humidity || "Media"} />
            </div>

            {product.variants && (
              <div className="hidden md:flex">
                <VariantSelector />
              </div>
            )}

            <div className="flex items-center gap-6 pt-6">
              <span className="text-4xl font-light text-planthia-dark">
                ${product.price.toLocaleString('es-AR')}
              </span>
              <button className="flex-1 bg-planthia-dark text-planthia-cream py-5 px-8 uppercase text-[10px] tracking-[0.2em] font-bold hover:bg-planthia-green transition-all duration-300">
                Agregar
              </button>
              <button className="p-4 rounded-full border border-planthia-dark/10 hover:bg-planthia-dark hover:text-planthia-cream transition-all group">
                <Heart size={20} strokeWidth={1.5} className="group-hover:fill-current" />
              </button>
            </div>
          </div>
        </div>

        {/* SECCIÓN: PODRÍA INTERESARTE */}
        {relatedProducts.length > 0 && (
          <section className="mt-32 pb-20 border-t border-planthia-dark/5 pt-20">
            <h2 className="text-3xl font-manrope text-planthia-dark mb-12">Podría interesarte</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((relatedP, index) => (
                <div
                  key={relatedP.id}
                  className={`
                   ${index === 2 ? "hidden md:block" : "block"} 
                   ${index === 3 ? "hidden lg:block" : "block"}
                 `}
                >
                  <ProductCardShop product={relatedP} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}




