//src/app/page.tsx
'use client'
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories"
import CareGuideBanner from "@/components/home/CareGuideBanner";
import RecommendedSection from '@/components/home/RecommendedSection';
import { usePlants } from "@/hooks/usePlants";


export default function HomePage() {
  const { plants, loading } = usePlants();
  

  const featuredPlants = plants.filter(p => p.featured === true);


  return (
    <main className="relative overflow-x-clip px-0 md:px-4 lg:px-12 pt-10 pb-20">
      <Hero />
      <RecommendedSection plants={featuredPlants} />
      <Categories />
      <CareGuideBanner />
    </main>
  );
}