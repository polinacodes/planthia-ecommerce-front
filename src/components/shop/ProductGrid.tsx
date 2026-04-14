"use client";
import React from 'react';
import ProductCardShop from '@/components/products/ProductCardShop';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { SearchX } from 'lucide-react'; 
import productsData from '@/data/products.json'; 

interface ProductGridProps {
  products: any[];
  isLoading: boolean;
  activeFiltersText: string;
}

const ProductGrid = ({ products, isLoading, activeFiltersText }: ProductGridProps) => {
 
  if (!isLoading && products.length === 0) {
    const suggestions = productsData.slice(0, 3);

    return (
      <div className="py-16 flex flex-col items-center">
        <div className="bg-white p-6 rounded-full shadow-sm mb-6">
          <SearchX size={40} className="text-[#5B823B]/40" strokeWidth={1.5} />
        </div>
        
        <p className="text-2xl font-headline font-bold text-planthia-dark text-center">
          Uy, parece que esa especie todavía no llegó a nuestra selva.
        </p>
        <p className="mt-2 text-gray-500 text-center max-w-md">
          No encontramos nada para <span className="font-bold text-[#5B823B]">{activeFiltersText}</span>, 
          pero quizás te enamores de alguna de estas:
        </p>

        {/* Sugerencias dinámicas */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">
          {suggestions.map((product) => (
            <ProductCardShop key={product.id} product={product} />
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
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 xl:gap-18">
      {isLoading
        ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
        : products.map((product) => (
            <ProductCardShop key={product.id} product={product} />
          ))
      }
    </div>
  );
};

export default ProductGrid;