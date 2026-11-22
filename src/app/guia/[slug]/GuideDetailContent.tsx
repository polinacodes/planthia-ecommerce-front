'use client';
// src/app/guia/[slug]/GuideDetailContent.tsx
import { productPath } from '@/lib/products';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowUp, Droplets, Leaf, MapPin, PawPrint, Scissors, Sun, Thermometer, Wind } from 'lucide-react';
import { usePlants } from '@/hooks/usePlants';
import ProductRow from '@/components/products/ProductRow';
import ShareButton from '@/components/share/ShareButton';
import { careTipsList, difficultyLabel, getRecommendedProducts, isGuidePlant, slugify } from '@/lib/guide';

const formatPrice = (value: number) => Math.round(value).toLocaleString('es-AR');

const CARD = 'bg-white border border-planthia-dark/[0.06] rounded-[20px]';

function Fact({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className={`${CARD} p-4`}>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-planthia-dark/70">
        <Icon size={13} /> {label}
      </p>
      <p className="font-headline font-bold text-[15px] text-planthia-dark mt-1.5 leading-snug">{value}</p>
    </div>
  );
}

// initialPlants llega desde el servidor (page.tsx): la ficha ya viene armada en el HTML,
// así la foto se descarga enseguida y no hay que esperar a que cargue todo el JavaScript
export default function GuideDetailContent({ initialPlants }: { initialPlants?: any[] | null }) {
  const { slug } = useParams<{ slug: string }>();
  const { plants: products, loading } = usePlants(initialPlants);

  const plant = useMemo(
    () => products.filter(isGuidePlant).find((p) => slugify(p.name) === slug),
    [products, slug]
  );
  const recommended = useMemo(() => (plant ? getRecommendedProducts(plant, products) : []), [plant, products]);

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
        {/* Migas de pan + compartir a la derecha */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <nav className="text-[11px] font-semibold uppercase tracking-[0.15em] text-planthia-dark/70 min-w-0">
            <Link href="/guia" className="hover:text-planthia-green">Guía de cuidados</Link>
            <span className="mx-2">/</span>
            <span className="text-planthia-dark">{plant.name}</span>
          </nav>
          <ShareButton
            variant="pill"
            path={`/guia/${slugify(plant.name)}`}
            title={`${plant.name}: guía de cuidados | Planthia`}
            text={plant.description}
            image={plant.image}
            className="flex-none"
          />
        </div>

        {/* Encabezado */}
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 lg:gap-12">
          {/* Foto sin fondo, como en la ficha de producto: ocupa toda la altura de la columna de datos */}
          <div className="relative aspect-square max-h-[420px] lg:max-h-none lg:aspect-auto lg:min-h-[480px] w-full">
            {/* Mismo hover que la foto de la ficha de producto. Sin animación de entrada:
                si la foto arranca invisible, Google tarda más en "verla" (LCP) */}
            <div className="absolute inset-0">
              <Image src={plant.image} alt={plant.name} fill preload fetchPriority="high" sizes="(max-width: 1024px) 100vw, 560px" className="object-contain transition-transform duration-500 ease-in-out hover:scale-105" />
            </div>
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
              <p className="italic text-planthia-dark/70 mt-1">{m.scientificName}{m.type_plant ? ` · ${m.type_plant}` : ''}</p>
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
              <Link href={productPath(plant)} className="btn btn-primary btn-md">Ver en la tienda</Link>
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
              <p className="flex items-center gap-2 text-sm text-planthia-dark/70 mt-6 pt-5 border-t border-planthia-dark/5">
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
                  <ProductRow key={product.documentId} product={product} reason={reason} />
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
