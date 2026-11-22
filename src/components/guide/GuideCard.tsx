// src/components/guide/GuideCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Droplets, PawPrint, Sun } from 'lucide-react';
import { difficultyLabel, lightLabel, slugify } from '@/lib/guide';

// Card de una planta en el buscador de la guía
// Va debajo del h1 de la guía, por eso el nombre es h2.
// priority: las primeras fotos de la página se descargan antes (mejora el LCP)
export default function GuideCard({ plant, priority = false }: { plant: any; priority?: boolean }) {
  const m = plant.metadata ?? {};
  const difficulty = difficultyLabel(m);
  const tag = 'inline-flex items-center gap-1 text-xs font-medium text-planthia-dark/70 bg-planthia-cream px-2.5 py-1 rounded-full';

  return (
    <Link
      href={`/guia/${slugify(plant.name)}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
    >
      <div className="relative aspect-square bg-[#f3f3f1] overflow-hidden">
        <Image
          src={plant.image}
          alt={plant.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          preload={priority}
          fetchPriority={priority ? 'high' : undefined}
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h2 className="font-headline font-extrabold text-base text-planthia-dark leading-tight">{plant.name}</h2>
        {m.scientificName && <p className="text-xs italic text-planthia-dark/70">{m.scientificName}</p>}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className={tag}><Sun size={12} />{lightLabel(m)}</span>
          {m.water && <span className={`${tag} max-w-full`}><Droplets size={12} className="flex-shrink-0" /><span className="truncate">{m.water}</span></span>}
          {difficulty && <span className={tag}>{difficulty}</span>}
          {m.pet_friendly === true && <span className={tag} title="Segura para mascotas"><PawPrint size={12} /></span>}
        </div>
      </div>
    </Link>
  );
}
