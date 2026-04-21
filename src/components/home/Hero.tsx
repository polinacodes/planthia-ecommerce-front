"use client";
import { useRouter } from 'next/navigation';
import { Star } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const router = useRouter();

  return (
    // <section className="relative bg-white py-20 px-6 md:px-12">

    <section className="grid grid-cols-12 gap-4 items-center lg:min-h-[70vh] ">

      {/* Contenido Izquierdo  */}
      <div className="col-span-12 lg:col-span-5 z-10 mt-8 lg:mt-0 px-4 md:px-0 order-last lg:order-first max-[1366px]:order-last">
        <span className="font-headline font-bold tracking-[0.2em] text-xs text-planthia-dark mb-4 block uppercase">
          #RefugioVerde
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-extrabold leading-[1.1] mb-6 lg:mb-8 text-planthia-dark">
          Llená de Vida <br className="hidden sm:block" /> Tus Espacios
        </h1>
        <p className="font-body text-planthia-dark/60 text-base sm:text-lg max-w-md mb-8 lg:mb-10 leading-relaxed">
          Somos especialistas en plantas. En Planthia encontrás todo lo que necesitás para crear tu propio refugio verde en un solo lugar
        </p>

        <div className="flex flex-row items-center gap-2 sm:gap-4">
          <button
            onClick={() => router.push('/tienda')}
            className="bg-planthia-green text-white px-4 sm:px-10 py-3 sm:py-5 font-bold hover:opacity-90 transition-all cursor-pointer
              rounded-tl-2xl rounded-bl-sm skew-x-[-15deg] origin-bottom overflow-hidden shadow-lg shadow-planthia-green/20 flex-1 sm:flex-none text-base sm:text-lg">
            <span className="inline-block skew-x-[15deg]">Coleccion</span>
          </button>
          <button className="bg-white border border-gray-100 px-4 sm:px-10 py-3 sm:py-5 font-bold text-planthia-green hover:bg-gray-50 transition-all cursor-pointer
              rounded-tr-sm rounded-br-2xl skew-x-[-15deg] origin-bottom shadow-sm flex-1 sm:flex-none text-base sm:text-lg">
            <span className="inline-block skew-x-[15deg]">Ver cuidados</span>
          </button>
        </div>
      </div>

      {/* Contenido Derecho */}
      <div className="col-span-12 lg:col-span-7 relative h-auto lg:h-full min-h-[550px] sm:min-h-[650px] lg:min-h-[700px] order-first lg:order-last max-[1366px]:order-first">

        {/* CONTENEDOR DE CÍRCULOS */}
        <div className="absolute top-[36%] md:top-[40%] lg:top-1/2 max-[1366px]:top-[40%] left-1/2 -translate-y-1/2 -translate-x-1/2 lg:-translate-x-[60%] max-[1366px]:-translate-x-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] lg:w-[680px] lg:h-[680px] z-0 flex items-center justify-center">
          {/* Círculo Exterior */}
          <div className="absolute inset-0 border-[4px] sm:border-[6px] border-white rounded-full shadow-md"></div>
          {/* Círculo Interior */}
          <div className="relative w-[92%] h-[92%] bg-white rounded-full shadow-md border border-[#F6F6F6]"></div>
        </div>

        {/* CONTENEDOR DE PLANTA */}
        <div className="absolute -top-30 sm:-top-28 lg:-top-32 max-[1366px]:-top-28 -left-4 -right-4 sm:-left-6 sm:-right-6 md:left-0 md:right-0 lg:-left-10 xl:-left-16 max-[1366px]:left-0 max-[1366px]:right-0 lg:right-auto z-10 w-auto md:w-full h-[120%] lg:h-[140%] xl:h-[150%] flex items-start justify-center lg:justify-start max-[1366px]:justify-center z-10">
          <div className="relative w-full lg:w-[110%] max-[1366px]:w-full h-full">
            <Image
              src="/hero.webp"
              alt="Marble Queen Pothos Planthia"
              fill
              priority
              className="object-cover object-top transition-transform duration-700 ease-out hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1366px) 100vw, 80vw"
            />
          </div>

          {/* CARD */}
          <div className="absolute bottom-40 sm:bottom-40 lg:bottom-80 left-4 sm:left-10 lg:left-30 z-20
              bg-white/60
              backdrop-blur-md
              border border-white/80
              p-4 sm:p-5 rounded-2xl
              flex items-center gap-3 sm:gap-4
              max-w-[260px] sm:max-w-[300px]
              shadow-[0_12px_40px_0_rgba(0,0,0,0.06)]">

            <div className="bg-white p-2 sm:p-3 rounded-xl shadow-sm flex-shrink-0">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-planthia-green fill-planthia-green" />
            </div>

            <div className="flex flex-col">
              <p className="font-headline font-bold text-planthia-dark text-sm sm:text-base leading-tight">
                La más vendida
              </p>
              <p className="font-body text-[10px] sm:text-xs text-planthia-dark/50 mt-1 leading-snug">
                Marble Queen pothus
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}