import Link from "next/link";
import Image from "next/image";
import RevealOnScroll from "../ui/RevealOnScroll";
import aboutImage from "@/assets/Foto15_Sesion3_2025.jpg";

/**
 * Sección "¿Qué es SupplyMentum UNI?" (RF-02, Tarea 1).
 * Portada del bloque `wrap split` en `template/index.html` (líneas 64-81):
 * texto descriptivo a la izquierda + imagen representativa a la derecha,
 * con botón "Conócenos →".
 *
 * Layout: CSS Grid de 2 columnas en desktop (`lg:grid-cols-2`), colapsa
 * a 1 columna en mobile con la imagen debajo del texto.
 *
 * La imagen usa el tratamiento `.figure` del prototipo:
 * - aspect-ratio 4/3
 * - border sutil con el token --line-strong
 * - filtro greyscale + brightness reducida en reposo
 * - on hover: se restaura color, leve zoom
 * - overlay con degradado de marca (rojo profundo → negro semi-transparente)
 */
export default function AboutSection() {
  return (
    <section className="border-t border-white/[.07]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-[clamp(32px,5vw,72px)] lg:px-8 lg:py-24">
        {/* ── Texto ── */}
        <RevealOnScroll direction="up">
          <p className="mb-5 flex items-center gap-3.5 font-[family-name:var(--font-archivo)] text-xs font-bold tracking-[.22em] text-[#ED1C24] uppercase before:h-[2px] before:w-[34px] before:flex-none before:bg-current">
            ¿Qué es SupplyMentum UNI?
          </p>
          <h2 className="font-[family-name:var(--font-archivo-black)] text-[clamp(30px,4.2vw,58px)] leading-[1.02] tracking-[-.03em] text-balance">
            Una comunidad que impulsa el Supply Chain en el Perú
          </h2>
          <p className="mt-[22px] max-w-[56ch] text-[clamp(16px,1.25vw,19px)] leading-[1.7] font-light text-zinc-400 text-pretty">
            Nacimos en la UNI para cerrar la distancia entre la teoría del aula y la
            operación real de una cadena de suministro. Formamos, conectamos y ponemos
            a prueba a nuestros miembros en proyectos con impacto medible.
          </p>
          <Link
            href="/conocenos"
            className="mt-8 inline-flex items-center justify-center gap-2.5 border border-[#ED1C24] bg-transparent px-8 py-4 font-[family-name:var(--font-archivo)] text-[13px] font-bold tracking-[.12em] text-[#ED1C24] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ED1C24] hover:text-white"
          >
            Conócenos →
          </Link>
        </RevealOnScroll>

        {/* ── Imagen representativa (figure) ── */}
        <RevealOnScroll direction="up" delayMs={120}>
          <div className="group relative aspect-[4/3] overflow-hidden border border-white/[.16]">
            <Image
              src={aboutImage}
              alt="Miembros de SupplyMentum UNI durante una sesión del programa formativo."
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover grayscale-[.5] brightness-[.72] contrast-[1.06] transition-[filter,transform] duration-[600ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:grayscale-0 group-hover:brightness-[.9] group-hover:contrast-[1.02] group-hover:scale-[1.04]"
            />
            {/* Overlay con degradado de marca — equivalente a .figure::after */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(155deg, rgba(146,2,7,.42), rgba(10,10,11,.25))",
              }}
            />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
