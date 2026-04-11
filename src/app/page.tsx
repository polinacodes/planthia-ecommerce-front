import { Star } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="relative px-12 pt-10 pb-20">
      {/* Hero Section */}
      <section className="grid grid-cols-12 gap-4 items-center min-h-[70vh]">

        {/* Contenido Izquierdo */}
        <div className="col-span-12 lg:col-span-5 z-10">
          <span className="font-headline font-bold tracking-[0.2em] text-xs text-planthia-dark mb-4 block uppercase">
            #RefugioVerde
          </span>
          <h1 className="text-6xl md:text-7xl font-headline font-extrabold leading-[1.1] mb-8 text-planthia-dark">
            Llená de Vida <br /> Tus Espacios
          </h1>
          <p className="font-body text-planthia-dark/60 text-lg max-w-md mb-10 leading-relaxed">
            Somos especialistas en plantas. En Planthia encontrás todo lo que necesitás para crear tu propio refugio verde en un solo lugar
          </p>

          <div className="flex items-center gap-4">
            <button className="bg-planthia-green text-white px-10 py-5 font-bold hover:opacity-90 transition-all cursor-pointer 
              rounded-tl-2xl rounded-bl-sm skew-x-[-15deg] origin-bottom overflow-hidden shadow-lg shadow-planthia-green/20">
              <span className="inline-block skew-x-[15deg]">Coleccion</span>
            </button>
            <button className="bg-white border border-gray-100 px-10 py-5 font-bold text-planthia-green hover:bg-gray-50 transition-all cursor-pointer 
              rounded-tr-sm rounded-br-2xl skew-x-[-15deg] origin-bottom shadow-sm">
              <span className="inline-block skew-x-[15deg]">Ver cuidados</span>
            </button>
          </div>
        </div>

        {/* Contenido Derecho */}
        <div className="col-span-12 lg:col-span-7 relative h-full min-h-[700px]">
          {/* CONTENEDOR DE CÍRCULOS */}
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-[48%] w-[680px] h-[680px] z-0 flex items-center justify-center">
            {/* Círculo Exterior */}
            <div className="absolute inset-0 border-[6px] border-white rounded-full shadow-md"></div>
            {/* Círculo Interior */}
            <div className="relative w-[92%] h-[92%] bg-white rounded-full shadow-md border border-[#F6F6F6]"></div>
          </div>

          {/* CONTENEDOR DE PLANTA */}
          <div className="absolute -top-32 left-20 z-10 w-full max-w-4xl h-[140%] -mb-40 aspect-square flex items-start justify-center overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src="/hero.webp"
                alt="Marble Queen Pothos Planthia"
                fill
                priority
                className="object-cover object-top transition-transform duration-700 ease-out hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
            </div>

            {/* CARD */}
            <div className="absolute bottom-82 left-10 lg:left-20 z-20 
              bg-white/60 
              backdrop-blur-md 
              border border-white/80 
              p-5 rounded-2xl 
              flex items-center gap-4 
              max-w-[300px] 
              shadow-[0_12px_40px_0_rgba(0,0,0,0.06)]">

              <div className="bg-white p-3 rounded-xl shadow-sm flex-shrink-0">
                <Star className="w-6 h-6 text-planthia-green fill-planthia-green" />
              </div>

              <div className="flex flex-col">
                <h4 className="font-headline font-bold text-planthia-dark text-base leading-tight">
                  La más vendida
                </h4>
                <p className="font-body text-xs text-planthia-dark/50 mt-1 leading-snug">
                  Marble Queen pothus
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}