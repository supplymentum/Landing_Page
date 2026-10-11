import Link from "next/link";
import Cube3D from "./Cube3D";

/**
 * Hero de la Home (RF-01). Portado de `header.hero` del prototipo estático:
 * copy + CTAs a la izquierda, isotipo 3D animado a la derecha, con glow de
 * marca de fondo. En mobile el cubo pasa arriba del texto (ver `order-*`).
 */
export default function Hero() {
  return (
    <header className="relative overflow-hidden">
      {/* Glow de marca — degradado radial que ancla la esquina del hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] -bottom-[30%] aspect-square w-[min(760px,80vw)] blur-[10px]"
        style={{
          background:
            "radial-gradient(circle, rgba(146,2,7,.30) 0%, transparent 66%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-8 lg:py-24">
        <div className="order-2 lg:order-1">
          <p className="mb-5 flex items-center gap-3.5 font-[family-name:var(--font-archivo)] text-xs font-bold tracking-[.22em] text-[#ED1C24] uppercase before:h-[2px] before:w-[34px] before:flex-none before:bg-current">
            Universidad Nacional de Ingeniería
          </p>

          <h1 className="mb-6 font-[family-name:var(--font-archivo-black)] text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-.03em] text-balance">
            Movemos el talento que mueve{" "}
            <span className="text-[#ED1C24]">al mundo.</span>
          </h1>

          <p className="mb-9 max-w-[56ch] text-[clamp(16px,1.25vw,19px)] leading-[1.7] font-light text-zinc-400 text-pretty">
            Somos la comunidad universitaria que impulsa el desarrollo académico y
            profesional en gestión de la cadena de suministro. Aprendemos juntos,
            compartimos experiencias y crecemos de forma colaborativa, más allá de las aulas.
          </p>

          <div className="flex flex-wrap gap-3.5">
            <Link
              href="/convocatoria"
              className="inline-flex items-center justify-center gap-2.5 bg-[#ED1C24] px-8 py-4 font-[family-name:var(--font-archivo)] text-[13px] font-bold tracking-[.12em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E13526] hover:shadow-[0_12px_32px_rgba(237,28,36,.34)]"
            >
              Postula ahora
            </Link>
            <Link
              href="/areas"
              className="inline-flex items-center justify-center gap-2.5 border border-white/[.16] px-8 py-4 font-[family-name:var(--font-archivo)] text-[13px] font-bold tracking-[.12em] text-zinc-100 uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ED1C24] hover:text-[#ED1C24]"
            >
              Explora las áreas
            </Link>
          </div>

          <div className="mt-11 flex items-center gap-4.5 border-t border-white/[.07] pt-6 font-[family-name:var(--font-archivo)] text-xs font-semibold tracking-[.1em] text-zinc-500 uppercase">
            <span aria-hidden="true" className="h-1.5 w-1.5 flex-none bg-[#ED1C24]" />
            <span>Convocatoria 2026-II abierta</span>
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-[380px] lg:order-2 lg:max-w-[560px]">
          <Cube3D
            fallbackSrc="/cubo.png"
            fallbackAlt="Isotipo tridimensional de SupplyMentum: dos marcos cúbicos anidados, blanco y rojo."
          />
        </div>
      </div>
    </header>
  );
}
