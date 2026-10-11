import Link from "next/link";
import RevealOnScroll from "../ui/RevealOnScroll";

interface ExploreCard {
  num: string;
  title: string;
  desc: string;
  href: string;
}

/**
 * Bloque "Explora" (RF-07). Portado 1:1 del `grid grid-4` en `index.html`
 * del prototipo: cards numeradas 01–04 hacia Conócenos, Áreas, Proyectos
 * y Eventos, mismo copy y mismo orden que el template.
 */
const CARDS: ExploreCard[] = [
  {
    num: "01",
    title: "Conócenos",
    desc: "Nuestra historia, misión, visión y el equipo detrás del centro.",
    href: "/conocenos",
  },
  {
    num: "02",
    title: "Áreas",
    desc: "Seis áreas donde puedes aportar y desarrollarte.",
    href: "/areas",
  },
  {
    num: "03",
    title: "Proyectos",
    desc: "El catálogo de iniciativas que hemos hecho realidad.",
    href: "/proyectos",
  },
  {
    num: "04",
    title: "Eventos",
    desc: "Charlas, talleres y congresos: pasados y por venir.",
    href: "/eventos",
  },
];

export default function ExploreSection() {
  return (
    <section className="section border-t border-white/[.07]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <RevealOnScroll direction="up" className="mb-12">
          <p className="mb-5 flex items-center gap-3.5 font-[family-name:var(--font-archivo)] text-xs font-bold tracking-[.22em] text-[#ED1C24] uppercase before:h-[2px] before:w-[34px] before:flex-none before:bg-current">
            Explora
          </p>
          <h2 className="font-[family-name:var(--font-archivo-black)] text-[clamp(30px,4.2vw,58px)] leading-[1.02] tracking-[-.03em] text-balance">
            Descubre SupplyMentum UNI
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card, i) => (
            <RevealOnScroll key={card.href} direction="up" delayMs={i * 90}>
              <Link
                href={card.href}
                className="group flex h-full flex-col overflow-hidden border border-white/[.07] bg-[#121215] text-inherit no-underline transition-[border-color,transform,box-shadow] duration-[350ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1.5 hover:border-[#ED1C24]/55 hover:shadow-[0_22px_52px_rgba(0,0,0,.42)]"
              >
                <div className="flex flex-1 flex-col gap-2.5 px-6 pt-[26px] pb-7">
                  <div className="mb-1 font-[family-name:var(--font-archivo)] text-[13px] font-bold tracking-[.2em] text-[#ED1C24]">
                    {card.num}
                  </div>
                  <h3 className="font-[family-name:var(--font-archivo)] text-2xl font-bold tracking-[-.015em]">
                    {card.title}
                  </h3>
                  <p className="text-[15px] leading-[1.7] font-light text-zinc-400">{card.desc}</p>
                  <div className="mt-auto flex items-center gap-3 pt-2 font-[family-name:var(--font-archivo)] text-xs font-semibold tracking-[.06em] text-[#ED1C24]">
                    Entrar →
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
