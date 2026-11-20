//src/components/home/Hero.tsx
"use client";
import { useRouter } from 'next/navigation';
import { Star, Leaf } from "lucide-react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Logo from "@/components/layout/Logo";

// Íconos sobre el círculo exterior (ángulo en grados, 0 = derecha, 90 = abajo)
const ORBIT_ICONS = [
  { angle: -45, kind: "flor" },
  { angle: 45, kind: "hoja" },
  { angle: 135, kind: "flor" },
  { angle: 225, kind: "hoja" },
] as const;

export default function Hero() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

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
            onClick={() => router.push('/shop')}
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
      {/* Todo vive dentro de un "escenario" cuadrado: círculos, planta, íconos y card
          se posicionan en % del escenario, así quedan alineados en cualquier pantalla
          y solo hay que cambiar el ancho del escenario por breakpoint. */}
      <div className="col-span-12 lg:col-span-7 order-first lg:order-last max-[1366px]:order-first flex justify-center pt-16 sm:pt-20 lg:pt-24 pb-6">
        <div className="relative aspect-square w-[min(84vw,420px)] sm:w-[480px] lg:w-[min(100%,500px)] xl:w-[540px] 2xl:w-[680px]">

          {/* Círculo exterior */}
          <div className="absolute inset-0 rounded-full border-[4px] sm:border-[6px] border-white shadow-md" />
          {/* Círculo interior */}
          <div className="absolute inset-[5%] rounded-full bg-white shadow-md border border-planthia-cream" />

          {/* Íconos que giran sobre el círculo exterior */}
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          >
            {ORBIT_ICONS.map(({ angle, kind }) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <div
                  key={angle}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${50 + 50 * Math.cos(rad)}%`, top: `${50 + 50 * Math.sin(rad)}%` }}
                >
                  {/* Gira al revés para que el ícono quede siempre derecho */}
                  <motion.div
                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 2xl:w-14 2xl:h-14 rounded-full bg-white shadow-md text-planthia-green"
                    animate={reduceMotion ? undefined : { rotate: -360 }}
                    transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                  >
                    {kind === "flor" ? (
                      <Logo symbolOnly className="w-6 h-6 sm:w-7 sm:h-7 2xl:w-8 2xl:h-8" />
                    ) : (
                      <Leaf className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-7 2xl:h-7" />
                    )}
                  </motion.div>
                </div>
              );
            })}
          </motion.div>

          {/* Planta: centrada en el escenario; las sogas salen por arriba del círculo */}
          <div className="absolute z-10 left-[10%] w-[80%] -top-[14%] aspect-[1086/1448]">
            <Image
              src="/heroo.webp"
              alt="Marble Queen Pothos Planthia"
              fill
              priority
              className="object-contain transition-transform duration-700 ease-out hover:scale-105"
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 400px, 560px"
            />
          </div>

          {/* CARD */}
          <div className="absolute z-30 left-0 sm:-left-[4%] bottom-[18%]
              bg-white/60
              backdrop-blur-md
              border border-white/80
              p-3 sm:p-4 rounded-xl
              flex items-center gap-3 sm:gap-4
              max-w-[260px] sm:max-w-[300px]
              shadow-[0_12px_40px_0_rgba(0,0,0,0.06)]">

            <div className="bg-white p-2 rounded-xl shadow-sm flex-shrink-0">
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