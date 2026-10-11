"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1400;

/**
 * Conteo animado desde 0 hasta `target`, disparado cuando el elemento
 * devuelto por `ref` entra en viewport. Portado de `initCounters` (site.js)
 * del prototipo estático como hook reutilizable.
 *
 * Respeta `prefers-reduced-motion`: si el usuario lo prefiere, el valor se
 * fija directamente en `target` sin animar.
 */
export function useCountUp<T extends HTMLElement>(target: number) {
  const ref = useRef<T | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Diferido para no disparar un setState síncrono dentro del efecto.
      queueMicrotask(() => setValue(target));
      return;
    }

    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target]);

  return { ref, value };
}
