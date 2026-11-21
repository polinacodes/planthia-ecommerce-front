// src/components/products/ProductRow.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCart, isCartItemOfProduct } from '@/hooks/useCart';

const formatPrice = (value: number) => Math.round(value).toLocaleString('es-AR');

const CARD = 'bg-white border border-planthia-dark/[0.06] rounded-[20px]';

// Insumo recomendado, con botón para sumarlo al carrito
export default function ProductRow({ product, reason }: { product: any; reason?: string }) {
  const { addItem, cart } = useCart();
  const inCart = cart.some((item) => isCartItemOfProduct(item, product));
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const outOfStock = (Number(product.stock) || 0) <= 0;

  const handleAdd = () => {
    const added = addItem({
      id: String(product.id),
      documentId: product.documentId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: Number(product.stock) || 0,
    });
    if (added) toast.success(`${product.name} agregado`);
  };

  return (
    <div className={`${CARD} p-3 flex items-center gap-4`}>
      <Link href={`/shop/${product.id}`} className="relative w-16 h-16 rounded-xl bg-planthia-cream overflow-hidden flex-shrink-0">
        <Image src={product.image} alt={product.name} fill sizes="64px" className="object-contain p-1" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/shop/${product.id}`} className="font-headline font-bold text-[15px] text-planthia-dark hover:text-planthia-green">
          {product.name}
        </Link>
        {reason && <p className="text-xs text-planthia-dark/50">{reason}</p>}
        <p className="font-headline font-extrabold text-planthia-green mt-0.5">${formatPrice(product.price)}</p>
      </div>
      {hasVariants ? (
        <Link href={`/shop/${product.id}`} className="btn btn-secondary btn-sm">Ver</Link>
      ) : (
        <button onClick={handleAdd} disabled={outOfStock} className="btn btn-primary btn-sm">
          {outOfStock ? 'Sin stock' : inCart ? 'Agregado' : 'Agregar'}
        </button>
      )}
    </div>
  );
}
