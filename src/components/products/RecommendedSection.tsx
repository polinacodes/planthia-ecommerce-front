"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

interface RecommendedSectionProps {
  plants: any[]; // Usá tu interface de Planta acá
}

const RecommendedSection = ({ plants }: RecommendedSectionProps) => {
  // Manejamos el ID activo. Arrancamos en NULL para que las 4 sean blancas e inactivas.
  const [activeId, setActiveId] = useState<string | number | null>(null);

  // Tomamos solo las primeras 4 (o featured)
  const featuredPlants = plants.slice(0, 4);

  return (
    <section className="pt-12 pb-12 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto bg-[#F7F5F0]">
      {/* Encabezado */}
      <div className="mb-14 ">
        <h2 className="text-4xl font-extrabold text-[#1A1A1A] tracking-tight">Recomendados</h2>
        <p className="text-gray-400 mt-4 text-lg font-medium">Las plantas ideales para armar tu jungla urbana.</p>
      </div>

      {/* Grid: 4 columnas en desktop. Cards rectangulares anchas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredPlants.map((plant) => (
          <ProductCard
            key={plant.id}
            plant={plant}
            isActive={activeId === plant.id}
            onClick={() => setActiveId(plant.id)}
          />
        ))}
      </div>

      {/* Botón "Ver todos" minimalista a la derecha */}
      <div className="flex justify-end mt-16">
        <Link
          href="/shop"
          className="group flex items-center gap-3 text-lg font-bold text-[#555] hover:text-[#5B823B] transition-colors"
        >
          <span>Ver todos</span>
          <div className="w-10 h-[2px] bg-[#555] group-hover:bg-[#5B823B] transition-colors mt-1" />
        </Link>
      </div>
    </section>
  );
};

export default RecommendedSection;