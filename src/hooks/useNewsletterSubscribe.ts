// src/hooks/useNewsletterSubscribe.ts
// Suscripción al newsletter (la usan el popup y el bloque de la home/blog).
// El backend manda por mail el código del 10 % para la primera compra.
'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function useNewsletterSubscribe(onSuccess?: () => void) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { email } }),
      });

      const data = await res.json();

      if (res.ok) {
        // El mensaje lo arma el backend (cambia si la persona se vuelve a suscribir)
        toast.success(data.message || '¡Suscripción exitosa! Revisá tu email.');
        setEmail('');
        onSuccess?.();
      } else {
        toast.error(data.error?.message || 'Algo salió mal, intentá de nuevo.');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, handleSubmit };
}
