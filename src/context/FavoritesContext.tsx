'use client';

/**
 * Favoritos del usuario logueado.
 *
 * Los productos se identifican por su documentId (el id fijo de Strapi 5).
 * El id numérico cambia cada vez que se republica un producto, así que no sirve
 * para guardar favoritos.
 *
 * El backend (api/favorite) se encarga de que cada persona vea y borre solo
 * sus favoritos, y de no duplicarlos.
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import AuthModal from '@/components/AuthModal';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface FavoriteItem {
  /** documentId del favorito (se usa para borrarlo). Vacío mientras se guarda. */
  documentId: string | null;
  /** documentId del producto */
  productDocumentId: string;
}

/** Lo que devuelve GET /api/favorites */
interface FavoriteResponse {
  documentId: string;
  productDocumentId: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (productDocumentId: string, productName?: string) => Promise<void>;
  isFavorite: (productDocumentId: string) => boolean;
  clearFavorites: () => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const fetchFavorites = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${STRAPI_URL}/api/favorites`, { headers: authHeaders(token) });
      if (res.ok) {
        const { data } = await res.json();
        setFavorites(
          ((data || []) as FavoriteResponse[]).map((fav) => ({
            documentId: fav.documentId,
            productDocumentId: fav.productDocumentId,
          }))
        );
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
    window.addEventListener('user-login', fetchFavorites);
    return () => window.removeEventListener('user-login', fetchFavorites);
  }, [fetchFavorites]);

  const toggleFavorite = async (productDocumentId: string, productName?: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!productDocumentId) return;

    const existing = favorites.find((fav) => fav.productDocumentId === productDocumentId);

    if (existing) {
      // QUITAR (se actualiza la pantalla antes y se revierte si falla)
      setFavorites((prev) => prev.filter((fav) => fav.productDocumentId !== productDocumentId));
      toast.success(productName ? `"${productName}" quitado de favoritos` : 'Quitado de favoritos');

      try {
        if (!existing.documentId) throw new Error('El favorito todavía se está guardando');
        const res = await fetch(`${STRAPI_URL}/api/favorites/${existing.documentId}`, {
          method: 'DELETE',
          headers: authHeaders(token),
        });
        if (!res.ok) throw new Error('Error al quitar de favoritos');
      } catch {
        setFavorites((prev) => [...prev, existing]);
        toast.error('Error al quitar de favoritos');
      }
      return;
    }

    // AGREGAR
    setFavorites((prev) => [...prev, { documentId: null, productDocumentId }]);
    toast.success(productName ? `"${productName}" agregado a favoritos` : 'Agregado a favoritos');

    try {
      const res = await fetch(`${STRAPI_URL}/api/favorites`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ data: { product: productDocumentId } }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error?.message || 'Error al agregar a favoritos');

      setFavorites((prev) =>
        prev.map((fav) =>
          fav.productDocumentId === productDocumentId ? { ...fav, documentId: body.data.documentId } : fav
        )
      );
    } catch (error) {
      setFavorites((prev) => prev.filter((fav) => fav.productDocumentId !== productDocumentId));
      toast.error(error instanceof Error ? error.message : 'Error al agregar a favoritos');
    }
  };

  const isFavorite = (productDocumentId: string) =>
    !!productDocumentId && favorites.some((fav) => fav.productDocumentId === productDocumentId);

  const clearFavorites = () => setFavorites([]);

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
