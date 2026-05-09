//src/app/page.tsx
'use client'
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories"
import RecommendedSection from '@/components/home/RecommendedSection';
import { usePlants } from "@/hooks/usePlants";


export default function HomePage() {
  const { plants, loading } = usePlants();
  

  const featuredPlants = plants.filter(p => p.featured === true);

  console.log("Plantas filtradas:", featuredPlants);

  return (
    <main className="relative px-0 md:px-4 lg:px-12 pt-10 pb-20">
      <Hero />
      <Categories />
      <RecommendedSection plants={featuredPlants} />
    </main>
  );
}