import AnimatedCounter from "./AnimatedCounter";
import { getMetrics } from "@/lib/data/metrics";
import RevealOnScroll from "../ui/RevealOnScroll";

/**
 * Sección de métricas (RF-03). Portada de `section.metrics` del prototipo.
 * El conteo animado vive en `AnimatedCounter` (hook `useCountUp`). Los
 * valores vienen de `getMetrics()` (por ahora un mock, ver
 * `lib/data/metrics.ts`) en vez de estar hardcodeados en el componente.
 */
export default async function MetricsSection() {
  const metrics = await getMetrics();

  return (
    <section aria-label="Cifras del centro" className="border-y border-[#ED1C24] bg-[#ED1C24]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-y-8 px-4 py-11 sm:px-6 lg:grid-cols-4 lg:gap-y-0 lg:px-8 lg:py-16">
        {metrics.map((metric, i) => {
          const dividerMobile = i % 2 === 1; // 2ª columna en la grilla de 2 (mobile)
          const dividerDesktop = i > 0; // toda columna salvo la primera, en la grilla de 4
          const borderClass = dividerMobile
            ? dividerDesktop
              ? "border-l border-white/30"
              : "border-l border-white/30 lg:border-l-0"
            : dividerDesktop
              ? "lg:border-l lg:border-white/30"
              : "";
          return (
            <RevealOnScroll
              key={metric.label}
              direction="up"
              delayMs={i * 90}
              className={`relative px-3 lg:px-8 ${borderClass}`}
            >
              <AnimatedCounter
                value={metric.value}
                prefix={metric.prefix}
                className="font-[family-name:var(--font-archivo-black)] text-[clamp(38px,4.6vw,62px)] leading-none tracking-[-.04em] text-white tabular-nums"
              />
              <div className="mt-3 font-[family-name:var(--font-archivo)] text-[11.5px] font-bold tracking-[.16em] text-white/90 uppercase">
                {metric.label}
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
