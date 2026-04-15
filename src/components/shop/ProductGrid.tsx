"use client";
import React from 'react';
import ProductCardShop from '@/components/products/ProductCardShop';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import EmptyState from '@/components/products/EmptyState'; 

interface ProductGridProps {
  products: any[];
  isLoading: boolean;
  activeFiltersText: string;
  productsPerPage: number;
}

const ProductGrid = ({ products, isLoading, activeFiltersText, productsPerPage }: ProductGridProps) => {

  if (!isLoading && products.length === 0) {
    return (
      <EmptyState 
      className="pb-16 pt-0"
        title="Uy, parece que esa plantita todavía no llegó a nuestra selva."
  description={<>No encontramos nada para <span className="font-bold text-[#5B823B]">{activeFiltersText}, </span></>}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 xl:gap-10">
      {isLoading
        ? Array.from({ length: productsPerPage }).map((_, i) => <ProductSkeleton key={i} />)
        : products.map((product) => (
          <ProductCardShop key={product.id} product={product} />
        ))
      }
    </div>
  );
};

export default ProductGrid;