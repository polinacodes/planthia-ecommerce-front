"use client";
import React from 'react';
import ProductCardShop from '@/components/products/ProductCardShop';
import ProductSkeleton from '@/components/products/ProductSkeleton';

interface ProductGridProps {
  products: any[];
  isLoading: boolean;
  activeFiltersText: string;
}

const ProductGrid = ({ products, isLoading, activeFiltersText }: ProductGridProps) => {
 
  if (!isLoading && products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl text-gray-500">
          No encontramos ninguna plantita que coincida con <span className="font-bold text-[#5B823B] capitalize">"{activeFiltersText}"</span>
        </p>
        <button
          onClick={() => window.location.href = '/tienda'}
          className="mt-4 text-[#5B823B] font-bold underline"
        >
          Ver toda la colección
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 xl:gap-18">
      {isLoading
        ? 
        Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
        : 
        products.map((product) => (
          <ProductCardShop key={product.id} product={product} />
        ))
      }
    </div>
  );
};

export default ProductGrid;