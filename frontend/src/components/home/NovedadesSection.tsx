import Link from "next/link";
import RevealOnScroll from "../ui/RevealOnScroll";
import NovedadesRail from "./NovedadesRail";
import { getNovedades } from "@/lib/data/novedades";

/**
 * Sección "Novedades" (RF-04). Portada del bloque `rail#novedades` del
 * prototipo: encabezado con botón "Ver eventos →" y carrusel con autoscroll.
 * Los datos vienen de `getNovedades()` (mock en `lib/data/novedades.ts`),
 * no del componente; el riel en sí vive en `NovedadesRail` (cliente).
 */
export default async function NovedadesSection() {
  const novedades = await getNovedades();

  return (
    <section className="border-t border-white/[.07]">
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <RevealOnScroll
          direction="up"
          className="mb-12 flex flex-wrap items-end justify-between gap-8"
        >
          <div>
            <p className="mb-5 flex items-center gap-3.5 font-[family-name:var(--font-archivo)] text-xs font-bold tracking-[.22em] text-[#ED1C24] uppercase before:h-[2px] before:w-[34px] before:flex-none before:bg-current">
              Novedades
            </p>
            <h2 className="font-[family-name:var(--font-archivo-black)] text-[clamp(30px,4.2vw,58px)] leading-[1.02] tracking-[-.03em] text-balance">
              Lo último del centro
            </h2>
          </div>
          <Link
            href="/eventos"
            className="inline-flex items-center justify-center gap-2.5 border border-white/[.16] bg-transparent px-6 py-3 font-[family-name:var(--font-archivo)] text-xs font-bold tracking-[.12em] text-zinc-200 uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ED1C24] hover:text-white"
          >
            Ver eventos →
          </Link>
        </RevealOnScroll>
      </div>

      {/* El riel sangra a todo el ancho: las tarjetas entran y salen por el borde. */}
      <div className="mx-auto w-full max-w-7xl pb-16 lg:pb-24">
        <NovedadesRail items={novedades} />
      </div>
    </section>
  );
}
