"use client";
import React from 'react';
import { SearchX } from 'lucide-react';
import ProductCardShop from './ProductCardShop';
import { usePlants } from '@/hooks/usePlants';


interface EmptyStateProps {
  title?: string;
  description?: React.ReactNode;
  className?: string;
}


const EmptyState = ({ title = "Uy, parece que esa plantita todavía no llegó a nuestra selva.", description, className = "py-16" }: any) => {
  const { plants } = usePlants(); 
  const suggestions = plants ? plants.slice(0, 4) : []; 

  return (
    <div className={`flex flex-col items-center w-full max-w-7xl mx-auto px-8 ${className}`}>
      <div className="bg-white p-6 rounded-full shadow-sm mb-6">
        <SearchX size={40} className="text-[#5B823B]/40" strokeWidth={1.5} />
      </div>

      <h2 className="text-2xl font-manrope font-bold text-planthia-dark text-center">
        {title}
      </h2>

      <div className="mt-2 text-gray-500 text-center max-w-md">
        <div className="text-base">
          {description}
          <span className="inline"> pero quizás te enamores de alguna de estas:</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-12 w-full">
        {suggestions.map((product, index) => (
          <div
            key={product.id}
            className={`
              ${index === 2 ? "hidden md:block lg:block" : "block"} 
              ${index === 3 ? "hidden lg:block" : "block"}
            `}
          >
            <ProductCardShop product={product} />
          </div>
        ))}
      </div>

      <button
        onClick={() => window.location.href = '/tienda'}
        className="mt-12 bg-[#5B823B] text-white px-8 py-3 rounded-full font-bold hover:bg-[#4a6a30] transition-colors"
      >
        Ver toda la colección
      </button>
    </div>
  );
};

export default EmptyState;