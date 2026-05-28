'use client';
import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

interface PaymentBrickProps {
  preferenceId: string;
  onError?: (error: string) => void;
}

export default function PaymentBrick({ preferenceId, onError }: PaymentBrickProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY) {
        throw new Error('Falta la clave pública de MercadoPago');
      }
      initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);
      setIsReady(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al inicializar MercadoPago';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [onError]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded">
        Error: {error}
      </div>
    );
  }

  if (!isReady || !preferenceId) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">Cargando método de pago...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Wallet
        initialization={{ preferenceId: preferenceId, redirectMode: 'self' }}
        onError={(error) => {
          console.error('Error en Wallet:', error);
          onError?.('Error al cargar el método de pago');
        }}
      />
    </div>
  );
}