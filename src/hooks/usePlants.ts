import { useState, useEffect } from 'react';

export function usePlants() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/products?populate=subcategory&populate=metadata');
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