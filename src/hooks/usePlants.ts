import { useState, useEffect } from 'react';

export function usePlants() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((res) => {
        setPlants(res.data || []);
        setLoading(false);
      });
  }, []);

  return { plants, loading };
}