'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoriteItem {
  id: number;
  productId: number;
  documentId?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null);

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  // Obtener datos del usuario (incluye documentId)
  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    return null;
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Obtener datos del usuario primero
      await fetchUserData(token);

      try {
        const res = await fetch(`${STRAPI_URL}/api/favorites?populate=product`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const response = await res.json();
          const data = response.data;

          const mappedFavorites = data.map((fav: any) => ({
            id: fav.id,
            documentId: fav.documentId,
            productId: fav.product?.id,
          })).filter((fav: any) => fav.productId);

          setFavorites(mappedFavorites);
        }
      } catch (err) {
        console.error('Error cargando favoritos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [STRAPI_URL]);

  // Obtener documentId de un producto por su ID numérico
  const getProductDocumentId = async (productId: number, token: string): Promise<string | null> => {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/products?filters[id][$eq]=${productId}&fields[0]=documentId`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const { data } = await res.json();
        if (data && data.length > 0) {
          return data[0].documentId;
        }
      } else {
        console.error('Error fetching product:', res.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    return null;
  };

  const toggleFavorite = async (productId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('¡Tenés que iniciar sesión para guardar favoritos!');
      return;
    }

    const existingFav = favorites.find(fav => fav.productId === productId);

    if (existingFav) {
      // ELIMINAR
      setFavorites(prev => prev.filter(fav => fav.productId !== productId));

      try {
        const deleteId = existingFav.documentId || existingFav.id;
        const res = await fetch(`${STRAPI_URL}/api/favorites/${deleteId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Error al eliminar');
      } catch (error) {
        setFavorites(prev => [...prev, existingFav]);
        alert('Error al quitar de favoritos');
      }
    } else {
      // AGREGAR
      const tempId = Date.now() * -1;
      setFavorites(prev => [...prev, { id: tempId, productId }]);

      try {
        const prodDocId = await getProductDocumentId(productId, token);
        const userDocId = userData?.documentId;

        if (!prodDocId || !userDocId) {
          throw new Error('No se pudieron obtener los IDs necesarios');
        }

        const res = await fetch(`${STRAPI_URL}/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              product: prodDocId,  
            },
          }),
        });

        if (res.ok) {
          const { data } = await res.json();
          setFavorites(prev =>
            prev.map(fav =>
              fav.productId === productId
                ? { id: data.id, documentId: data.documentId, productId }
                : fav
            )
          );
        } else {
          const error = await res.json();
          throw new Error(error.error?.message || 'Error al crear');
        }
      } catch (error: any) {
        setFavorites(prev => prev.filter(fav => fav.productId !== productId));
        alert(error.message || 'Error al agregar a favoritos');
      }
    }
  };

  const isFavorite = (productId: number) => favorites.some(fav => fav.productId === productId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  return context;
};