'use client';

/**
 * Lee ?cupon=CODIGO de la URL en cualquier página, lo guarda para el checkout
 * y lo saca de la barra de direcciones. No muestra nada en pantalla salvo un toast.
 */
import { useEffect } from 'react';
import { toast } from 'sonner';
import { savePendingDiscountCode } from '@/lib/discountCode';

export default function DiscountFromUrl() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('cupon');
    if (!code || !code.trim()) return;

    savePendingDiscountCode(code);
    url.searchParams.delete('cupon');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);

    toast.success('¡Tu código de descuento quedó guardado!', {
      description: 'Se aplica solo cuando llegues al checkout.',
    });
  }, []);

  return null;
}
