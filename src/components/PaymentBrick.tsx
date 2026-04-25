'use client';
import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

interface PaymentBrickProps {
  preferenceId: string;
}

export default function PaymentBrick({ preferenceId }: PaymentBrickProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!);
    setIsReady(true);
  }, []);

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
        initialization={{ preferenceId: preferenceId }}
      />
    </div>
  );
}