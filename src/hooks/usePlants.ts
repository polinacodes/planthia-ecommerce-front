import { PRODUCTS_QUERY } from '@/lib/shop';
import { useState, useEffect } from 'react';

// initial: productos que ya trajo el servidor (por ahora solo el shop). Si vienen, no se vuelve a pedir nada.
export function usePlants(initial?: any[] | null) {
  const [plants, setPlants] = useState<any[]>(initial ?? []);
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    if (initial) return;
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?${PRODUCTS_QUERY}`);
        const result = await response.json();
        setPlants(result.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  

  return { plants, loading };
}