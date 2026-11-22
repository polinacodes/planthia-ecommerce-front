"use client";
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import React, { useRef } from 'react';
import ProductCardShop from '@/components/products/ProductCardShop';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import EmptyState from '@/components/products/EmptyState'; 

interface ProductGridProps {
  products: any[];
  isLoading: boolean;
  activeFiltersText: string;
  productsPerPage: number;
}

// Tarjetas que en la primera carga aparecen sin animación (las que se ven sin hacer scroll):
// si arrancan invisibles, Google tarda más en "ver" la primera foto (LCP)
const STATIC_ON_FIRST_LOAD = 4;

const ProductGrid = ({ products, isLoading, activeFiltersText, productsPerPage }: ProductGridProps) => {
  const groupKey = isLoading ? "loading" : products.map((p) => p.id).join("-");
  // Guarda la primera grilla que se mostró; al filtrar o cambiar de página vuelven las animaciones
  const firstKey = useRef<string | null>(null);
  if (!isLoading && firstKey.current === null) firstKey.current = groupKey;
  const isFirstLoad = groupKey === firstKey.current;

  if (!isLoading && products.length === 0) {
    return (
      <EmptyState 
      className="pb-16 pt-0"
        title="Uy, parece que esa plantita todavía no llegó a nuestra selva."
  description={activeFiltersText
        ? <>No encontramos nada para <span className="font-bold text-[#4F7A2E]">{activeFiltersText}</span>, </>
        : <>Todavía no hay productos en esta sección, </>}
      />
    );
  }

  return (
    // Las tarjetas aparecen en cascada (también al cambiar de filtro o de página)
    <RevealGroup key={groupKey} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 xl:gap-10" stagger={0.05}>
      {isLoading
        ? Array.from({ length: productsPerPage }).map((_, i) => <ProductSkeleton key={i} />)
        : products.map((product, i) =>
          isFirstLoad && i < STATIC_ON_FIRST_LOAD ? (
            <div key={product.id} className="h-full [&>*]:h-full">
              <ProductCardShop product={product} headingAs="h2" priority={i < 2} />
            </div>
          ) : (
            <RevealItem key={product.id} className="h-full [&>*]:h-full">
              <ProductCardShop product={product} headingAs="h2" />
            </RevealItem>
          )
        )
      }
    </RevealGroup>
  );
};

export default ProductGrid;