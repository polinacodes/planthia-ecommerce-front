"use client";

import React from 'react';
import { Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  plant: any;
  isActive: boolean;
  onClick: () => void;
}

const ProductCard = ({ plant, isActive, onClick }: ProductCardProps) => {
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Future: Add to favorites logic for", plant.id);
  };

  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-500 cursor-pointer rounded-3xl p-6 group flex items-center justify-between ${isActive
          ? 'bg-[#5B823B] text-white scale-105 z-20 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] h-[240px]' // Card activa: verde, apaisada, un poco más grande a escala
          : 'bg-white text-gray-800 shadow-sm border border-gray-100 hover:shadow-lg h-[220px] z-10' // Card inactiva: blanca, apaisada
        } ${!isActive && 'overflow-hidden'}`}
    >
      {/* Icono Favorito (Placeholder) */}
      <button
        onClick={handleFavorite}
        title="Próximamente: Agregar a favoritos"
        className="absolute top-4 right-4 z-30"
      >
        <Heart
          className={`w-6 h-6 transition-colors ${isActive ? 'text-white/70 hover:text-white' : 'text-gray-300 hover:text-red-400'
            }`}
        />
      </button>

      {/* Contenedor principal*/}
      <div className="flex items-center gap-4 h-full relative w-full">

        {/* Lado Izquierdo: Planta con efecto de crecimiento Desktop */}
        <div className={`transition-all duration-500 ease-in-out z-20 flex-shrink-0 flex justify-center ${isActive
            ? 'md:absolute md:-top-8 md:-left-12 md:scale-[1.7] scale-110' // Efecto "vuelo" desktop calibrado
            : 'relative scale-100 -translate-x-4'
          }`}>
          <Image
            src={plant.image}
            alt={plant.name}
            width={160}
            height={160}
            className="object-contain"
            priority={isActive}
          />
        </div>

        {/* Lado Derecho: Información */}
        <div className={`flex-1 z-10 transition-all duration-500 pr-2 ${isActive ? 'md:ml-36' : '-ml-2' /* Dejamos espacio para la planta que crece */}`}>
          <h3 className="text-xl font-extrabold leading-tight">{plant.name}</h3>

          {/* Descripción (Más visible al estar activa, limitada a 2 líneas para mantener proporción) */}
          <p className={`text-xs leading-relaxed line-clamp-2 transition-opacity duration-300 ${isActive ? 'opacity-90 mt-2 mb-4' : 'opacity-0 h-0 pointer-events-none'}`}>
            {plant.description}
          </p>

          {/* Precio (Siempre visible, cambia de color) */}
          <span className={`text-2xl font-bold block my-2 ${isActive ? 'text-white' : 'text-[#5B823B]'}`}>
            ${plant.price}
          </span>

          {/* Botones (Solo activos, alineados horizontalmente) */}
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none h-0'}`}>
            <button className="bg-white text-[#5B823B] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm">
              Agregar
            </button>
            <Link
              href={`/product/${plant.id}`}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              onClick={(e) => e.stopPropagation()} // Vital para el link
            >
              <Eye className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;