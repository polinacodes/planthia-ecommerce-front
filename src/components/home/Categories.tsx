//src/components/home/Categories.tsx
import Image from "next/image";
import Link from "next/link";

const categories = [
  { title: "Interior", img: "/interior.webp", link: "/tienda?type=plantas&category=interior" },
  { title: "Exterior", img: "/exterior-2.webp", link: "/tienda?type=plantas&category=exterior" },
  { title: "Aromáticas", img: "/aromaticas.webp", link: "/tienda?type=plantas&category=aromaticas" },
  { title: "Cuidados", img: "/cuidados.webp", link: "/tienda?type=cuidados" },
];

export default function Categories() {
  return (
    <section className="bg-cream pt-48 pb-20 lg:pt-20 xl:pt-48 xl:pb-24 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto relative z-0">
      
      {/* Encabezado */}
      <div className="mb-16"> 
        <h2 className="text-3xl xl:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
          Nuestras colecciones
        </h2>
        <p className="text-gray-400 mt-3 text-lg font-medium">
          Seleccionadas para transformar cada rincón.
        </p>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
        {categories.map((cat) => (
          <Link key={cat.title} href={cat.link} className="group cursor-pointer">
            {/* Contenedor de imagen */}
            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-planthia-green/10">
              <Image
                src={cat.img} 
                alt={cat.title}
                fill
                className="object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            
            <div className="mt-6 flex justify-between items-center px-2">
              <h3 className="text-xl lg:text-2xl font-bold text-[#1A1A1A]">{cat.title}</h3>
              <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-planthia-green group-hover:text-white group-hover:border-planthia-green transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}