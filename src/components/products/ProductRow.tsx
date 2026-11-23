// src/components/products/ProductRow.tsx
'use client';

import { productPath } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { useCart, isCartItemOfProduct } from '@/hooks/useCart';

const formatPrice = (value: number) => Math.round(value).toLocaleString('es-AR');

const CARD = 'bg-white border border-planthia-dark/[0.06] rounded-[20px]';

// Insumo recomendado, con botón para sumarlo al carrito
// compact: versión sin caja y con botón redondo, para columnas angostas (barra lateral del blog)
export default function ProductRow({ product, reason, compact = false }: { product: any; reason?: string; compact?: boolean }) {
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

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-3">
        <Link href={productPath(product)} className="relative w-12 h-12 rounded-xl bg-white overflow-hidden flex-shrink-0">
          <Image src={product.image} alt={product.name} fill sizes="48px" className="object-contain p-1" />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={productPath(product)} className="block font-headline font-bold text-sm text-planthia-dark hover:text-planthia-green truncate">
            {product.name}
          </Link>
          <p className="text-sm text-planthia-dark/60">${formatPrice(product.price)}</p>
        </div>
        {hasVariants ? (
          <Link href={productPath(product)} aria-label={`Ver ${product.name}`} className="btn btn-secondary w-9 h-9 p-0 rounded-full">
            <ArrowRight size={16} />
          </Link>
        ) : (
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={outOfStock ? 'Sin stock' : `Agregar ${product.name} al carrito`}
            title={outOfStock ? 'Sin stock' : inCart ? 'Agregado' : 'Agregar al carrito'}
            className={inCart ? 'btn btn-secondary w-9 h-9 p-0 rounded-full' : 'w-9 h-9 rounded-full flex items-center justify-center bg-planthia-green text-white hover:bg-[#C1D37F] hover:text-[#4F7A2E] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'}
          >
            {inCart ? <Check size={16} /> : <Plus size={16} />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`${CARD} p-3 flex items-center gap-4`}>
      <Link href={productPath(product)} className="relative w-16 h-16 rounded-xl bg-planthia-cream overflow-hidden flex-shrink-0">
        <Image src={product.image} alt={product.name} fill sizes="64px" className="object-contain p-1" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={productPath(product)} className="font-headline font-bold text-[15px] text-planthia-dark hover:text-planthia-green">
          {product.name}
        </Link>
        {reason && <p className="text-xs text-planthia-dark/70">{reason}</p>}
        <p className="font-headline font-extrabold text-planthia-green mt-0.5">${formatPrice(product.price)}</p>
      </div>
      {/* En celular: botón redondo con + (como en la barra del blog). Desde tablet: botón con texto */}
      {hasVariants ? (
        <>
          <Link href={productPath(product)} aria-label={`Ver ${product.name}`} className="sm:hidden btn btn-secondary w-10 h-10 p-0 rounded-full flex-shrink-0">
            <ArrowRight size={18} />
          </Link>
          <Link href={productPath(product)} className="hidden sm:inline-flex btn btn-secondary btn-sm">Ver</Link>
        </>
      ) : (
        <>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={outOfStock ? `${product.name}: sin stock` : inCart ? `Agregar otro ${product.name} al carrito` : `Agregar ${product.name} al carrito`}
            className={`sm:hidden flex-shrink-0 ${inCart ? 'btn btn-secondary w-10 h-10 p-0 rounded-full' : 'w-10 h-10 rounded-full flex items-center justify-center bg-planthia-green text-white hover:bg-[#C1D37F] hover:text-[#4F7A2E] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'}`}
          >
            {inCart ? <Check size={18} /> : <Plus size={18} />}
          </button>
          {/* Ya en el carrito: blanco con contorno y letras verdes, igual que las tarjetas */}
          <button onClick={handleAdd} disabled={outOfStock} className={`hidden sm:inline-flex btn btn-sm ${inCart ? 'btn-secondary' : 'btn-primary'}`}>
            {outOfStock ? 'Sin stock' : inCart ? 'Agregado' : 'Agregar'}
          </button>
        </>
      )}
    </div>
  );
}
