'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import AuthModal from '@/components/AuthModal';

interface FavoriteItem {
  id: number;
  productId: number;
  documentId?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (productId: number, productName?: string) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const userDataRef = useRef<any>(null);

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        userDataRef.current = data;
        return data;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    return null;
  };

  const fetchFavorites = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const user = await fetchUserData(token);

    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${STRAPI_URL}/api/favorites?populate=product`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.ok) {
        const response = await res.json();
        const mappedFavorites = response.data
          .map((fav: any) => ({
            id: fav.id,
            documentId: fav.documentId,
            productId: fav.product?.id,
          }))
          .filter((fav: any) => fav.productId);

        setFavorites(mappedFavorites);
      }
    } catch (err) {
      console.error('Error cargando favoritos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
    window.addEventListener('user-login', fetchFavorites);
    return () => window.removeEventListener('user-login', fetchFavorites);
  }, [STRAPI_URL]);

  const getProductDocumentId = async (productId: number, token: string): Promise<string | null> => {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/products?filters[id][$eq]=${productId}&fields[0]=documentId`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const { data } = await res.json();
        if (data && data.length > 0) return data[0].documentId;
      }
    } catch (error) {
      console.error('Error:', error);
    }
    return null;
  };

  const toggleFavorite = async (productId: number, productName?: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    const existingFav = favorites.find(fav => fav.productId === productId);

    if (existingFav) {
      // ELIMINAR 
      const updatedFavorites = favorites.filter(fav => fav.productId !== productId);
      setFavorites(updatedFavorites);
      toast.success(productName ? `"${productName}" quitado de favoritos` : 'Quitado de favoritos');

      try {
        const deleteId = existingFav.documentId || existingFav.id;
        const res = await fetch(`${STRAPI_URL}/api/favorites/${deleteId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Error al eliminar');
      } catch (error) {
        // Revertir si falla
        setFavorites([...updatedFavorites, existingFav]);
        toast.error('Error al quitar de favoritos');
      }

    } else {
      // AGREGAR 
      const tempId = Date.now() * -1;
      const optimisticFavorites = [...favorites, { id: tempId, productId }];
      setFavorites(optimisticFavorites);
      toast.success(productName ? `"${productName}" agregado a favoritos` : 'Agregado a favoritos');

      try {
        const prodDocId = await getProductDocumentId(productId, token);
        const userDocId = userDataRef.current?.documentId;

        if (!prodDocId || !userDocId) throw new Error('No se pudieron obtener los IDs necesarios');

        const res = await fetch(`${STRAPI_URL}/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              product: prodDocId,
              user: userDocId,
              publishedAt: new Date(),
            },
          }),
        });

        if (res.ok) {
          const { data } = await res.json();
          setFavorites(optimisticFavorites.map(fav =>
            fav.productId === productId
              ? { id: data.id, documentId: data.documentId, productId }
              : fav
          ));
        } else {
          const error = await res.json();
          throw new Error(error.error?.message || 'Error al crear');
        }
      } catch (error: any) {
        // Revertir si falla
        setFavorites(optimisticFavorites.filter(fav => fav.productId !== productId));
        toast.error(error.message || 'Error al agregar a favoritos');
      }
    }
  };

  const isFavorite = (productId: number) => favorites.some(fav => fav.productId === productId);

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites, loading }}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  return context;
};