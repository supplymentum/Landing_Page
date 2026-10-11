import Link from "next/link";
import RevealOnScroll from "../ui/RevealOnScroll";
import { getBeneficios } from "@/lib/data/beneficios";

/**
 * Sección "¿Por qué unirte?" (RF-06). Portada del `grid#beneficios` del
 * prototipo: tarjetas con borde izquierdo rojo (que vira a ámbar en hover)
 * y el CTA "Postula aquí" hacia Convocatoria.
 */
export default async function BenefitsSection() {
  const beneficios = await getBeneficios();

  return (
    <section className="border-t border-white/[.07]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <RevealOnScroll direction="up" className="mb-12">
          <p className="mb-5 flex items-center gap-3.5 font-[family-name:var(--font-archivo)] text-xs font-bold tracking-[.22em] text-[#ED1C24] uppercase before:h-[2px] before:w-[34px] before:flex-none before:bg-current">
            ¿Por qué unirte?
          </p>
          <h2 className="font-[family-name:var(--font-archivo-black)] text-[clamp(30px,4.2vw,58px)] leading-[1.02] tracking-[-.03em] text-balance">
            Lo que ganas siendo parte de SupplyMentum
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {beneficios.map((beneficio, i) => (
            <RevealOnScroll key={beneficio.title} direction="up" delayMs={i * 80}>
              <div className="group h-full border border-white/[.07] border-l-[3px] border-l-[#ED1C24] bg-[#121215] px-6 py-[26px] transition-[background-color,border-color] duration-[350ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:border-l-[#FFBD59] hover:bg-[#1A1A20]">
                <h3 className="mb-2 font-[family-name:var(--font-archivo)] text-xl font-bold tracking-[-.015em]">
                  {beneficio.title}
                </h3>
                <p className="text-[15px] leading-[1.7] font-light text-zinc-400">
                  {beneficio.desc}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-13 flex justify-center">
          <Link
            href="/convocatoria"
            className="inline-flex items-center justify-center gap-2.5 bg-[#ED1C24] px-10 py-[18px] font-[family-name:var(--font-archivo)] text-sm font-bold tracking-[.12em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#920207] hover:shadow-[0_18px_44px_rgba(237,28,36,.28)]"
          >
            Postula aquí
          </Link>
        </div>
      </div>
    </section>
  );
}
