//src/components/home/Hero.tsx
"use client";
import { useId } from "react";
import { useRouter } from 'next/navigation';
import { Star } from "lucide-react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

// Íconos sobre el círculo exterior (ángulo en grados: 0 = derecha, 90 = abajo)
const ORBIT_ICONS = [
  { angle: -60, kind: "flor" },
  { angle: 30, kind: "hoja" },
  { angle: 120, kind: "flor" },
  { angle: 210, kind: "hoja" },
] as const;

// Hoja con relleno (con la nervadura calada)
// Flor rellena de cinco pétalos (el logo anterior): en los íconos que giran combina mejor con la hoja
function FlowerFilled({ className }: { className?: string }) {
  const maskId = useId();
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <mask id={maskId}>
        <rect width="64" height="64" fill="#fff" />
        <circle cx="32" cy="32" r="5.2" fill="#000" />
      </mask>
      <g mask={`url(#${maskId})`} fill="currentColor">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse key={angle} cx="32" cy="20" rx="8" ry="12.5" transform={`rotate(${angle} 32 32)`} />
        ))}
      </g>
      <circle cx="32" cy="32" r="2.6" fill="currentColor" />
    </svg>
  );
}

function LeafFilled({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M20.5 3.5C11 3.5 4 8 4 16.5c0 1.3.2 2.5.6 3.6.4-.3.9-.7 1.4-1.2C8.3 16.5 11 13.6 14 11c-2.6 2.9-5.2 6-7 8.6 1.4.6 3 .9 4.5.9 7.4 0 9.3-6.6 9-17Z" />
    </svg>
  );
}

export default function Hero() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return (
    // <section className="relative bg-white py-20 px-6 md:px-12">
    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 overflow-visible">
    <section className="grid grid-cols-12 gap-4 items-center lg:min-h-[50vh] xl:min-h-[70vh]">

      {/* Contenido Izquierdo  */}
      {/* Los márgenes negativos acercan el texto a la planta cuando van apilados (celular y tablet).
          En tablet vertical (md) la planta crece con el ancho, por eso el margen usa vw. */}
      {/* Desde lg, el texto se corre lo justo para quedar alineado con el nav (sin mover la planta).
          En pantallas de 1696px o más ya coincide, así que ahí no se mueve */}
      <div className="lg:[translate:max(-48px,min(0px,calc((100vw-1696px)/2)))_0] col-span-12 lg:col-span-5 z-10 -mt-[120px] max-[370px]:-mt-[150px] sm:-mt-[172px] md:mt-[calc(32.3vw-424px)] lg:-mt-30 xl:-mt-30 2xl:-mt-40 lg:portrait:-mt-[248px] 2xl:max-[2200px]:-mt-[240px] md:px-0 order-last lg:order-first max-[1366px]:order-last flex flex-col items-center lg:items-start text-center lg:text-left">
        <span className="font-headline font-bold tracking-[0.2em] text-xs text-planthia-dark mb-4 block uppercase">
          #RefugioVerde
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-headline font-extrabold leading-[1.05] tracking-tight mb-6 lg:mb-8 text-planthia-dark">
          Llená de vida <br className="hidden sm:block" /> tus espacios
        </h1>
        <p className="font-body text-planthia-dark/60 text-base sm:text-lg max-w-md mb-8 lg:mb-10 leading-relaxed mx-auto lg:mx-0">
          Somos especialistas en plantas. En Planthia encontrás todo lo que necesitás para crear tu propio refugio verde en un solo lugar
        </p>

        {/* Botones encastrados: "Ir al shop" termina redondo y "Guía de cuidados" arranca con
            un borde en media luna que lo abraza, separados por unos píxeles (ver .pill-crescent) */}
        <div className="hero-pills flex flex-row items-center">
          <button
            onClick={() => router.push('/shop')}
            className="relative z-10 h-[var(--pill-h)] rounded-full bg-planthia-green text-white px-6 sm:px-8 2xl:px-10 font-headline font-bold whitespace-nowrap hover:bg-planthia-green-dark transition-colors cursor-pointer shadow-md shadow-planthia-green/20 flex-1 sm:flex-none text-[15px] max-[374px]:text-sm sm:text-lg lg:text-[15px] xl:text-base 2xl:text-lg"
          >
            Ir al shop
          </button>
          <button
            onClick={() => router.push('/guia')}
            className="pill-crescent h-[var(--pill-h)] pr-6 sm:pr-8 2xl:pr-10 font-headline font-bold whitespace-nowrap text-planthia-green-dark cursor-pointer flex-1 sm:flex-none text-[15px] max-[374px]:text-sm sm:text-lg lg:text-[15px] xl:text-base 2xl:text-lg"
          >
            Guía de cuidados
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
          <div className="relative w-full lg:w-[110%] max-[1366px]:w-full h-full overflow-y-clip" style={{ containerType: "size" }}>
            {/* MARCO DE LA PLANTA: mide exactamente lo que medía la imagen con object-cover + object-top
                (por el alto o por el ancho, lo que sea mayor; entre 640 y 767 px, por el alto
                para que no se corte abajo). --plant-scale achica solo la planta (desde arriba, así las sogas siguen saliendo del tope); los círculos mantienen su tamaño y bajan/suben con la maceta. 1 = tamaño original. Los círculos van adentro en %,
                así siempre quedan centrados en la maceta y escalan junto con la planta. */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 aspect-[1086/1448] w-[max(100cqw,75cqh)] sm:max-md:w-[75cqh] [--plant-scale:0.92] max-[370px]:[--plant-scale:0.86] 2xl:scale-[0.85] origin-[50%_46%]"
            >
              {/* CÍRCULOS (centrados en la maceta; para subirlos o bajarlos, cambiá el 48% de top-[calc(48%*…)]) */}
              <div className="absolute left-1/2 lg:left-[51%] top-[calc(50%*var(--plant-scale))] -translate-x-1/2 -translate-y-1/2 w-[78%] max-[370px]:w-[66%] sm:w-[80%] aspect-square">
                {/* Círculo Exterior */}
                <div className="absolute inset-0 border-[4px] sm:border-[6px] border-white rounded-full shadow-md" />
                {/* Círculo Interior */}
                <div className="absolute inset-[6%] bg-white rounded-full shadow-md border border-[#F6F6F6]" />

                {/* Íconos que giran sobre el círculo exterior (detrás de la planta) */}
                <motion.div
                  className="absolute inset-0"
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
                          className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 2xl:w-9 2xl:h-9 rounded-full bg-white shadow-sm text-planthia-green"
                          animate={reduceMotion ? undefined : { rotate: -360 }}
                          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                        >
                          {kind === "flor" ? (
                            <FlowerFilled className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6" />
                          ) : (
                            <LeafFilled className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5" />
                          )}
                        </motion.div>
                      </div>
                    );
                  })}
                </motion.div>

                {/* PLANTA (Monstera apoyada): 92% del círculo, así las hojas
                    asoman apenas por arriba y la maceta queda cerca del borde de abajo. Va después de los íconos,
                    así queda por delante de ellos. Para moverla: top-[3%] (arriba/abajo) y w-[92%] (tamaño) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[3%] w-[92%] aspect-square">
                  <Image
                    src="/hero-monstera.webp"
                    alt="Monstera deliciosa en maceta blanca"
                    fill
                    preload
                    fetchPriority="high"
                    className="object-contain transition-transform duration-700 ease-out hover:scale-105"
                    sizes="(max-width: 1023px) 85vw, 45vw"
                  />
                </div>
              </div>

              {/* PLANTA ANTERIOR (pothos colgante): se achicaba desde el borde de arriba con --plant-scale
              <div className="absolute inset-0 origin-top scale-[var(--plant-scale)]">
              <Image
                src="/heroo-corto.webp"
                alt="Marble Queen Pothos Planthia"
                fill
                preload
                fetchPriority="high"
                className="object-contain transition-transform duration-700 ease-out hover:scale-110"
                sizes="(max-width: 1023px) 100vw, 55vw"
              />
              </div>
              */}
            </div>
          </div>

          {/* CARD */}
          {/* Posición por pantalla: bottom (altura) y left; el tamaño se ajusta con scale desde la esquina de abajo a la izquierda.
              Celular chico (<400px): más arriba. Celular grande (400-639px): un poco más grande y más arriba.
              Tablet ancha (900-1023px, Surface): más grande. 1280-1535px (Nest Hub): un poco más abajo. 1536px o más: más grande */}
          <div className="absolute bottom-50 min-[400px]:bottom-48 sm:bottom-40 md:bottom-80 lg:bottom-60 xl:bottom-[330px] 2xl:bottom-120 left-4 sm:left-10 md:left-20 lg:left-0 xl:left-10 z-20
              origin-bottom-left min-[400px]:max-sm:scale-110 min-[900px]:max-lg:scale-[1.2] 2xl:scale-[1.2]
              bg-white/60
              backdrop-blur-md
              border border-white/80
              p-2.5 sm:p-3 md:p-4 lg:p-3 xl:p-4 rounded-xl
              flex items-center gap-2.5 sm:gap-4
              max-w-[200px] sm:max-w-[300px] lg:max-w-[300px] xl:max-w-[400px] 2xl:max-w-[450px]
              shadow-[0_12px_40px_0_rgba(0,0,0,0.06)]">

            <div className="bg-white p-1.5 sm:p-2 lg:p-2 xl:p-2 rounded-lg sm:rounded-xl shadow-sm flex-shrink-0">
              <Star className="w-4 h-4 sm:w-6 sm:h-6 text-planthia-green fill-planthia-green" />
            </div>

            <div className="flex flex-col">
              <p className="font-headline font-bold text-planthia-dark text-xs sm:text-base leading-tight">
                La más vendida
              </p>
              <p className="font-body text-[10px] sm:text-xs text-planthia-dark/50 mt-0.5 sm:mt-1 leading-snug">
                Monstera deliciosa
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}