import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories"
import RecommendedSection from '@/components/products/RecommendedSection';
import plantsData from '@/data/products.json';

export default function HomePage() {

const featuredPlants = plantsData.filter(p => p.featured);

  return (
    <main className="relative px-0 md:px-4 lg:px-12 pt-10 pb-20">
      <Hero />
      <Categories />
      <RecommendedSection plants={featuredPlants} />
      {/* Próximamente: <FeaturedProducts /> */}
      
    </main>
  );
}