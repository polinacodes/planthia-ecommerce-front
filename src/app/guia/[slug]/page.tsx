// src/app/guia/[slug]/page.tsx
'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowUp, Droplets, Leaf, MapPin, PawPrint, Scissors, Sun, Thermometer, Wind } from 'lucide-react';
import { usePlants } from '@/hooks/usePlants';
import { useCart, isCartItemOfProduct } from '@/hooks/useCart';
import { careTipsList, difficultyLabel, getRecommendedProducts, isGuidePlant, slugify } from '@/lib/guide';

const formatPrice = (value: number) => Math.round(value).toLocaleString('es-AR');

const CARD = 'bg-white border border-planthia-dark/[0.06] rounded-[20px]';

function Fact({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className={`${CARD} p-4`}>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-planthia-dark/50">
        <Icon size={13} /> {label}
      </p>
      <p className="font-headline font-bold text-[15px] text-planthia-dark mt-1.5 leading-snug">{value}</p>
    </div>
  );
}

// Insumo recomendado, con botón para sumarlo al carrito
function SupplyRow({ product, reason }: { product: any; reason: string }) {
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
        <p className="text-xs text-planthia-dark/50">{reason}</p>
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

export default function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { plants: products, loading } = usePlants();

  const plant = useMemo(
    () => products.filter(isGuidePlant).find((p) => slugify(p.name) === slug),
    [products, slug]
  );
  const recommended = useMemo(() => (plant ? getRecommendedProducts(plant, products) : []), [plant, products]);

  useEffect(() => {
    if (plant) document.title = `Cómo cuidar ${plant.name} | Guía Planthia`;
  }, [plant]);

  if (loading) {
    return <main className="min-h-screen bg-planthia-cream flex items-center justify-center"><div className="w-8 h-8 border-4 border-planthia-green border-t-transparent rounded-full animate-spin" /></main>;
  }

  if (!plant) {
    return (
      <main className="min-h-[70vh] bg-planthia-cream flex flex-col items-center justify-center text-center px-6">
        <p className="font-headline font-extrabold text-3xl text-planthia-dark mb-2">No encontramos esa ficha</p>
        <p className="text-planthia-dark/60 mb-6">Puede que el nombre haya cambiado. Buscala en la guía.</p>
        <Link href="/guia" className="btn btn-primary btn-md">Ir a la guía de cuidados</Link>
      </main>
    );
  }

  const m = plant.metadata ?? {};
  const tips = careTipsList(m);
  const difficulty = difficultyLabel(m);
  const inStock = (Number(plant.stock) || 0) > 0;
  const shortName = plant.name.split(' ')[0];

  return (
    <main className="min-h-screen bg-planthia-cream pb-24">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 pt-6">
        <nav className="text-[11px] font-semibold uppercase tracking-[0.15em] text-planthia-dark/50 mb-6">
          <Link href="/guia" className="hover:text-planthia-green">Guía de cuidados</Link>
          <span className="mx-2">/</span>
          <span className="text-planthia-dark">{plant.name}</span>
        </nav>

        {/* Encabezado */}
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-8 lg:gap-12">
          <div className="relative aspect-square rounded-3xl bg-[#ecebe6] overflow-hidden">
            <Image src={plant.image} alt={plant.name} fill priority sizes="(max-width: 1024px) 100vw, 420px" className="object-contain p-8" />
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {difficulty && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e7efdf] text-[#3f6224]">{difficulty}</span>
              )}
              {m.pet_friendly === true && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-[#e7efdf] text-[#3f6224]"><PawPrint size={12} /> Segura para mascotas</span>
              )}
              {m.pet_friendly === false && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-[#f8e6e1] text-[#8a3b2a]"><PawPrint size={12} /> Tóxica para mascotas</span>
              )}
            </div>

            <h1 className="font-headline font-extrabold text-4xl sm:text-5xl text-planthia-dark leading-tight">{plant.name}</h1>
            {m.scientificName && (
              <p className="italic text-planthia-dark/50 mt-1">{m.scientificName}{m.type_plant ? ` · ${m.type_plant}` : ''}</p>
            )}
            {plant.description && <p className="text-planthia-dark/70 text-base leading-relaxed mt-4">{plant.description}</p>}

            {/* De un vistazo */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              <Fact icon={Sun} label="Luz" value={m.light} />
              <Fact icon={Droplets} label="Riego" value={m.water} />
              <Fact icon={Thermometer} label="Temperatura" value={m.temperature} />
              <Fact icon={Wind} label="Humedad" value={m.humidity} />
              <Fact icon={ArrowUp} label="Crecimiento" value={m.growth} />
              <Fact icon={Scissors} label="Reproducción" value={m.propagation} />
            </div>

            {/* Link a la tienda */}
            <div className={`${CARD} p-4 mt-5 flex flex-col sm:flex-row sm:items-center gap-4`}>
              <div className="flex-1">
                <p className="font-headline font-bold text-planthia-dark">{inStock ? '¿Todavía no la tenés?' : 'Por ahora no tenemos stock'}</p>
                <p className="text-sm text-planthia-dark/60">
                  {inStock ? `La tenemos en la tienda a $${formatPrice(plant.price)}` : 'Fijate más adelante o mirá otras plantas parecidas.'}
                </p>
              </div>
              <Link href={`/shop/${plant.id}`} className="btn btn-primary btn-md">Ver en la tienda</Link>
            </div>
          </div>
        </section>

        {/* Consejos y recomendaciones */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <div className={`${CARD} p-6 sm:p-8`}>
            <h2 className="font-headline font-extrabold text-2xl text-planthia-dark mb-5 flex items-center gap-2">
              <Leaf size={20} className="text-planthia-green" /> Consejos de cuidado
            </h2>
            {tips.length > 0 ? (
              <ul className="space-y-3">
                {tips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-planthia-dark/80 leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-planthia-green flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-planthia-dark/60">Estamos preparando los consejos de esta planta.</p>
            )}
            {m.origin && (
              <p className="flex items-center gap-2 text-sm text-planthia-dark/50 mt-6 pt-5 border-t border-planthia-dark/5">
                <MapPin size={14} /> Origen: {m.origin}
              </p>
            )}
          </div>

          <div className={`${CARD} p-6 sm:p-8`}>
            <h2 className="font-headline font-extrabold text-2xl text-planthia-dark mb-1">Lo que necesita tu {shortName}</h2>
            {m.substratum && <p className="text-sm text-planthia-dark/60 mb-5">Sustrato ideal: {m.substratum}</p>}
            {recommended.length > 0 ? (
              <div className="space-y-3">
                {recommended.map(({ product, reason }) => (
                  <SupplyRow key={product.documentId} product={product} reason={reason} />
                ))}
              </div>
            ) : (
              <Link href="/shop?type=cuidados" className="btn btn-secondary btn-md">Ver todos los insumos</Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
