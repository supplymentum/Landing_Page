"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Novedad } from "@/lib/data/novedades";

/**
 * Riel de novedades con autoscroll infinito. Porta `initAutoRails()` de
 * `template/assets/js/site.js`:
 *
 * - El contenido se duplica para encadenar el bucle; la copia es
 *   `aria-hidden` y no recibe foco (evita leerla dos veces y no rompe el tab).
 * - Avanza a 34 px/s con `requestAnimationFrame`, acumulando la posición en
 *   un decimal propio: sumar sobre `scrollLeft` directo se pierde por
 *   redondeo y el riel se queda clavado en cero.
 * - Se pausa en hover, foco, arrastre, rueda y cuando la pestaña o el riel
 *   no están a la vista. Mientras manda el usuario, seguimos su posición.
 * - Con `prefers-reduced-motion` no se duplica ni se anima: queda como un
 *   riel de scroll normal.
 */
export default function NovedadesRail({ items }: { items: Novedad[] }) {
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const originales = items.length;
    if (!originales) return;

    const VELOCIDAD = 34; // píxeles por segundo
    let pausado = false;
    let arrastrando = false;
    let visible = true;
    let pos = rail.scrollLeft;
    let ultimo = performance.now();
    let raf = 0;

    // Distancia exacta de un juego completo de tarjetas (incluye su separación).
    const puntoDeBucle = () => {
      const hijos = rail.children;
      const primera = hijos[0] as HTMLElement | undefined;
      const copia = hijos[originales] as HTMLElement | undefined;
      return primera && copia ? copia.offsetLeft - primera.offsetLeft : 0;
    };

    const paso = (ahora: number) => {
      const dt = Math.min((ahora - ultimo) / 1000, 0.05);
      ultimo = ahora;

      if (visible && !pausado && !arrastrando && !document.hidden) {
        pos += VELOCIDAD * dt;
        const limite = puntoDeBucle();
        if (limite > 0 && pos >= limite) pos -= limite;
        rail.scrollLeft = pos;
      } else {
        pos = rail.scrollLeft;
      }
      raf = requestAnimationFrame(paso);
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, {
      threshold: 0.05,
    });
    io.observe(rail);

    const pausar = () => { pausado = true; };
    const reanudarScroll = () => { pausado = false; };
    const tomarControl = () => { arrastrando = true; };
    const soltarControl = () => { arrastrando = false; };

    let reanudar: ReturnType<typeof setTimeout>;
    const alRodar = () => {
      arrastrando = true;
      clearTimeout(reanudar);
      reanudar = setTimeout(() => { arrastrando = false; }, 1200);
    };

    rail.addEventListener("pointerenter", pausar);
    rail.addEventListener("pointerleave", reanudarScroll);
    rail.addEventListener("focusin", pausar);
    rail.addEventListener("focusout", reanudarScroll);
    rail.addEventListener("pointerdown", tomarControl);
    rail.addEventListener("wheel", alRodar, { passive: true });
    window.addEventListener("pointerup", soltarControl);

    raf = requestAnimationFrame(paso);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(reanudar);
      io.disconnect();
      rail.removeEventListener("pointerenter", pausar);
      rail.removeEventListener("pointerleave", reanudarScroll);
      rail.removeEventListener("focusin", pausar);
      rail.removeEventListener("focusout", reanudarScroll);
      rail.removeEventListener("pointerdown", tomarControl);
      rail.removeEventListener("wheel", alRodar);
      window.removeEventListener("pointerup", soltarControl);
    };
  }, [items.length]);

  // El duplicado se renderiza siempre: con movimiento reducido simplemente
  // no se anima, y el riel sigue siendo desplazable a mano.
  const tarjetas = [
    ...items.map((n) => ({ novedad: n, copia: false })),
    ...items.map((n) => ({ novedad: n, copia: true })),
  ];

  return (
    <div
      ref={railRef}
      tabIndex={0}
      role="region"
      aria-label="Novedades — desplázate horizontalmente"
      className="rail-scrollbar flex gap-5 overflow-x-auto px-4 pt-1 pb-5 sm:px-6 lg:px-8"
    >
      {tarjetas.map(({ novedad, copia }, i) => (
        <Link
          key={`${novedad.title}-${i}`}
          href={novedad.href}
          aria-hidden={copia || undefined}
          tabIndex={copia ? -1 : undefined}
          className="group flex w-[min(268px,72vw)] flex-none flex-col overflow-hidden border border-white/[.07] bg-[#121215] text-inherit no-underline transition-[border-color,transform,box-shadow] duration-[350ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1.5 hover:border-[#ED1C24]/55 hover:shadow-[0_22px_52px_rgba(0,0,0,.42)]"
        >
          <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[.07]">
            <Image
              src={novedad.img}
              alt=""
              fill
              sizes="268px"
              className="object-cover brightness-[.74] grayscale-[.5] transition-[filter,transform] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-105 group-hover:brightness-[.94] group-hover:grayscale-0"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2.5 px-6 pt-[26px] pb-7">
            <span className="self-start bg-[#ED1C24] px-2.5 py-[5px] font-[family-name:var(--font-archivo)] text-[10.5px] font-bold tracking-[.12em] text-white uppercase">
              {novedad.tag}
            </span>
            <h3 className="font-[family-name:var(--font-archivo)] text-xl font-bold tracking-[-.015em]">
              {novedad.title}
            </h3>
            <p className="text-[15px] leading-[1.7] font-light text-zinc-400">{novedad.desc}</p>
            <div className="mt-auto pt-2 font-[family-name:var(--font-archivo)] text-xs font-semibold tracking-[.06em] text-zinc-500">
              {novedad.date}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
