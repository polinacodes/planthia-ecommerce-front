import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';

/**
 * Revisa el stock real de lo que hay en el carrito (puede haber cambiado desde que se agregó:
 * otra persona compró, o se editó en Strapi). Se usa al abrir el carrito y en el checkout.
 * El backend igual vuelve a validar el stock al crear el pedido; esto es para avisar antes.
 */
export function useCartStockCheck(active: boolean) {
  const refreshStock = useCart((state) => state.refreshStock);
  const [checking, setChecking] = useState(false);

  const check = useCallback(async () => {
    const documentIds = [
      ...new Set(useCart.getState().cart.map((item) => item.documentId).filter(Boolean)),
    ] as string[];
    if (documentIds.length === 0) return;

    const params = new URLSearchParams();
    documentIds.forEach((id, i) => params.append(`filters[documentId][$in][${i}]`, id));
    params.append('populate', 'variants');
    params.append('pagination[pageSize]', '100');

    setChecking(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?${params}`);
      if (!res.ok) return;
      const { data } = await res.json();
      const { reduced } = refreshStock(data ?? []);
      reduced.forEach(({ name, stock }) =>
        toast.warning(`Quedan ${stock} de ${name}: ajustamos la cantidad`)
      );
    } catch {
      // Sin conexión no se bloquea nada: el backend valida el stock al crear el pedido
    } finally {
      setChecking(false);
    }
  }, [refreshStock]);

  useEffect(() => {
    if (active) check();
  }, [active, check]);

  return { checking, recheck: check };
}
