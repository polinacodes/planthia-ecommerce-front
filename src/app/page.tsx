//src/app/page.tsx
'use client'
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories"
import CareGuideBanner from "@/components/home/CareGuideBanner";
import BlogSection from "@/components/home/BlogSection";
import BenefitsBar from "@/components/home/BenefitsBar";
import NewsletterBlock from "@/components/layout/NewsletterBlock";
import { HOME_CONTAINER } from "@/lib/layout";
import { Reveal } from "@/components/motion/Reveal";
import RecommendedSection from '@/components/home/RecommendedSection';
import { usePlants } from "@/hooks/usePlants";


export default function HomePage() {
  const { plants, loading } = usePlants();
  

  const featuredPlants = plants.filter(p => p.featured === true);


  return (
    <>
    <main className="relative overflow-x-clip px-0 md:px-4 lg:px-12 pt-10 pb-20">
      <Hero />
      <RecommendedSection plants={featuredPlants} />
      <Categories />
      <Reveal><CareGuideBanner /></Reveal>
      <BlogSection />
    </main>
    {/* Beneficios y newsletter a todo el ancho, pegados al footer */}
    <BenefitsBar />
    <NewsletterBlock containerClassName={HOME_CONTAINER} />
    </>
  );
}