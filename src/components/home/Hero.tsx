//src/components/home/Hero.tsx
"use client";
import { useRouter } from 'next/navigation';
import { Star } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const router = useRouter();

  return (
    // <section className="relative bg-white py-20 px-6 md:px-12">
    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 overflow-visible">
    <section className="grid grid-cols-12 gap-4 items-center lg:min-h-[50vh] xl:min-h-[70vh]">

      {/* Contenido Izquierdo  */}
      <div className="col-span-12 lg:col-span-5 z-10 mt-0 lg:-mt-30 xl:-mt-30 2xl:-mt-40 md:px-0 order-last lg:order-first max-[1366px]:order-last flex flex-col items-center lg:items-start text-center lg:text-left">
        <span className="font-headline font-bold tracking-[0.2em] text-xs text-planthia-dark mb-4 block uppercase">
          #RefugioVerde
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-headline font-extrabold leading-[1.1] mb-6 lg:mb-8 text-planthia-dark">
          Llená de Vida <br className="hidden sm:block" /> Tus Espacios
        </h1>
        <p className="font-body text-planthia-dark/60 text-base sm:text-lg max-w-md mb-8 lg:mb-10 leading-relaxed mx-auto lg:mx-0">
          Somos especialistas en plantas. En Planthia encontrás todo lo que necesitás para crear tu propio refugio verde en un solo lugar
        </p>

        <div className="flex flex-row items-center gap-2 sm:gap-2 lg:gap-2">
          <button
            onClick={() => router.push('/tienda')}
            className="bg-planthia-green text-white px-6 sm:px-6 md:px-8 lg:px-6 xl:px-10 py-3 sm:py-3 md:py-4 lg:py-3 xl:py-5 font-bold hover:opacity-90 transition-all cursor-pointer
              rounded-tl-2xl rounded-bl-sm skew-x-[-15deg] origin-bottom overflow-hidden shadow-lg shadow-planthia-green/20 flex-1 sm:flex-none text-base sm:text-lg">
            <span className="inline-block skew-x-[15deg]">Coleccion</span>
          </button>
          <button className="bg-white border border-gray-100 px-6 sm:px-6 md:px-8 lg:px-6 xl:px-10 py-3 sm:py-3 md:py-4 lg:py-3 xl:py-5 font-bold text-planthia-green hover:bg-gray-50 transition-all cursor-pointer
              rounded-tr-sm rounded-br-2xl skew-x-[-15deg] origin-bottom shadow-sm flex-1 sm:flex-none text-base sm:text-lg">
            <span className="inline-block skew-x-[15deg]">Cuidados</span>
          </button>
        </div>
      </div>

      {/* Contenido Derecho */}
      <div className="col-span-12 lg:col-span-7 relative h-auto lg:h-full min-h-[550px] sm:min-h-[650px] md:min-h-[860px] lg:min-h-[700px] xl:min-h-[700px] 2xl:min-h-[850px] order-first lg:order-last max-[1366px]:order-first">

        {/* CONTENEDOR DE CÍRCULOS */}
        {/* <div className="absolute 
             top-[36%] md:top-[40%] lg:top-1/2 max-[1366px]:top-[40%] 
              right-0 lg:right-[-10%] 2xl:right-[-60%]
             -translate-x-1/2 lg:translate-x-[0%] 2xl:-translate-x-[60%] max-[1366px]:-translate-x-1/2 
             -translate-y-60 lg:-translate-y-[70%] xl:-translate-y-[60%] 2xl:-translate-y-[60%]
             w-[90vw] h-[90vw] 
             min-[400px]:w-[400px] min-[400px]:h-[400px] 
             sm:w-[500px] sm:h-[500px] 
             lg:w-[500px] lg:h-[500px] 
             2xl:w-[820px] 2xl:h-[820px]
             z-0 flex items-center justify-center"> */}
          {/* Círculo Exterior */}
          {/* <div className="absolute inset-0 border-[4px] sm:border-[6px] border-white rounded-full shadow-md"></div> */}
          {/* Círculo Interior */}
          {/* <div className="relative w-[92%] h-[92%] bg-white rounded-full shadow-md border border-[#F6F6F6]"></div>
        </div> */}

        {/* CONTENEDOR DE PLANTA */}
        <div className="absolute 
             -translate-y-6 lg:translate-y-0 2xl:-translate-y-40
             -top-52 sm:-top-40 lg:-top-40 max-[1366px]:-top-28 
             -left-0 -right-0 sm:-left-6 sm:-right-6 md:left-0 md:right-0 lg:left-10 lg:right-auto xl:left-14 xl:right-auto 2xl:left-14 2xl:right-auto max-[1366px]:left-0 max-[1366px]:right-0  
             z-10 w-auto md:w-full 
             h-[120%] lg:h-[120%] xl:h-[140%] 2xl:h-[160%] 
             flex items-start justify-center lg:justify-start max-[1366px]:justify-center z-10">
          <div className="relative w-full lg:w-[110%] max-[1366px]:w-full h-full">
            <Image
              src="/heroo.webp"
              alt="Marble Queen Pothos Planthia"
              fill
              priority
              className="object-cover object-top transition-transform duration-700 ease-out hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 80vw"
            />
          </div>

          {/* CARD */}
          <div className="absolute bottom-40 sm:bottom-40 md:bottom-80 lg:bottom-60 xl:bottom-90 2xl:bottom-120 left-4 sm:left-10 md:left-20 lg:left-0 xl:left-10 z-20
              bg-white/60
              backdrop-blur-md
              border border-white/80
              p-4 sm:p-3 md:p-4 lg:p-3 xl:p-4 rounded-xl
              flex items-center gap-3 sm:gap-4
              max-w-[260px] sm:max-w-[300px] lg:max-w-[300px] xl:max-w-[400px] 2xl:max-w-[450px]
              shadow-[0_12px_40px_0_rgba(0,0,0,0.06)]">

            <div className="bg-white p-2 sm:p-2 lg:p-2 xl:p-2 rounded-xl shadow-sm flex-shrink-0">
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
    </div>
  );
}