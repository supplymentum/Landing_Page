"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scrolling inercial (efecto tipo los referentes de diseño). Lenis
 * conduce el scroll nativo por `requestAnimationFrame`, así que
 * `position: sticky` (Header), los canvas `fixed` (fondos animados) y los
 * `IntersectionObserver` (contadores, reveals) siguen funcionando igual.
 *
 * Se monta por ruta (Home y Convocatoria), no en el layout, para aplicarlo
 * solo donde se quiere. Respeta `prefers-reduced-motion`: si el usuario lo
 * prefiere, no se inicializa y queda el scroll nativo del sistema.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cúbico, como --ease del sitio
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
