import RevealOnScroll from "../ui/RevealOnScroll";

interface ChainLink {
  num: string;
  title: string;
  desc: string;
}

/**
 * Bloque "Nuestros rubros" (RF-02, Tarea 2). Portado del `.chain` del
 * prototipo (`template/index.html`, líneas 83-113).
 *
 * La numeración 01-04 es real: las cuatro etapas son una secuencia, por eso
 * van en una sola fila con separadores y el chevron entre celdas (`.link::after`).
 * En mobile la fila se parte en 1/2 columnas y el chevron se oculta.
 */
const LINKS: ChainLink[] = [
  {
    num: "01",
    title: "Planeamiento",
    desc: "Demanda, S&OP e inventarios: anticipamos lo que la cadena necesita.",
  },
  {
    num: "02",
    title: "Abastecimiento",
    desc: "Compras, sourcing y gestión de proveedores estratégicos.",
  },
  {
    num: "03",
    title: "Producción",
    desc: "Operaciones, Lean y mejora continua en planta y servicios.",
  },
  {
    num: "04",
    title: "Distribución",
    desc: "Logística, transporte y última milla hasta el cliente final.",
  },
];

export default function ChainSection() {
  return (
    <section className="border-t border-white/[.07]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <RevealOnScroll direction="up">
          <p className="mb-5 flex items-center gap-3.5 font-[family-name:var(--font-archivo)] text-xs font-bold tracking-[.22em] text-[#ED1C24] uppercase before:h-[2px] before:w-[34px] before:flex-none before:bg-current">
            Nuestros rubros
          </p>
          <h2 className="font-[family-name:var(--font-archivo-black)] text-[clamp(30px,4.2vw,58px)] leading-[1.02] tracking-[-.03em] text-balance">
            De extremo a extremo de la cadena
          </h2>
          <p className="mt-5 max-w-[56ch] text-[clamp(16px,1.25vw,19px)] leading-[1.7] font-light text-zinc-400 text-pretty">
            Cubrimos las cuatro etapas del flujo, en el orden en que ocurren.
          </p>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delayMs={120} className="mt-13">
          {/* Los separadores se resuelven con `gap-px` sobre el color de línea:
              así valen igual en las tres grillas (1, 2 y 4 columnas). */}
          <div className="grid grid-cols-1 gap-px border border-white/[.07] bg-white/[.07] sm:grid-cols-2 lg:grid-cols-4">
            {LINKS.map((link, i) => (
              <article
                key={link.num}
                className="group relative bg-[#09090B] px-[30px] pt-[38px] pb-[34px] transition-colors duration-[350ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:bg-[#121215]"
              >
                {/* Barra roja superior que se despliega al hover — .link::before */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[#ED1C24] transition-transform duration-[450ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-x-100"
                />
                <div className="mb-[18px] font-[family-name:var(--font-archivo-black)] text-[32px] leading-none text-[#22222A] transition-colors duration-[350ms] group-hover:text-[#920207]">
                  {link.num}
                </div>
                <h3 className="mb-2.5 font-[family-name:var(--font-archivo)] text-xl font-bold tracking-[-.015em]">
                  {link.title}
                </h3>
                <p className="text-[15px] leading-[1.7] font-light text-zinc-400">{link.desc}</p>

                {/* Chevron entre etapas — sólo en la fila completa de desktop */}
                {i < LINKS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 -right-[5px] hidden size-[9px] -translate-y-1/2 rotate-45 border-t border-r border-white/[.16] bg-[#09090B] lg:block"
                  />
                )}
              </article>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
