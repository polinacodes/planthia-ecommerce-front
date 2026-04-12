import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories"

export default function HomePage() {
  return (
    <main className="relative px-0 md:px-4 lg:px-12 pt-10 pb-20">
      <Hero />
      <Categories />
      {/* Próximamente: <FeaturedProducts /> */}
      
    </main>
  );
}