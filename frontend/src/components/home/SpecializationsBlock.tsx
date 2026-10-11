"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import * as THREE from "three";
import type { Specialization } from "@/lib/data/specializations";
import RevealOnScroll from "../ui/RevealOnScroll";

const AUTO_ADVANCE_MS = 10000;

/* Mismos tiempos que `.area-fade`/`.is-out` en site.css (areas.html) para el
   texto del frente: transición de .32s y swap del contenido a los 200ms. */
const FADE_TRANSITION_MS = 320;
const FADE_SWAP_DELAY_MS = 200;

/* Órbita */
const STEP = Math.PI / 3; // 60° entre planetas
const FRONT = Math.PI / 2; // el frente mira a cámara (abajo en pantalla)
const ORBIT_R = 3.3;
const PLANET_R = 0.34;
/* Persecución del ángulo por frame (lenta, cinemática: ~1.5s en asentarse) */
const EASE = 0.05;

interface SpecializationsBlockProps {
  specializations: Specialization[];
}

/* Textura radial para los glows aditivos (núcleo y planetas). */
function glowTexture(inner: string, mid: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner);
  g.addColorStop(0.35, mid);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/**
 * Bloque de especializaciones (RF-05) como escena orbital en Three.js:
 * un núcleo oscuro con disco de acreción de partículas (rojo/ámbar de
 * marca) y las seis áreas orbitando como planetas —esferas reales en
 * perspectiva—, avanzando solas de izquierda a derecha cada
 * `AUTO_ADVANCE_MS`. El planeta del frente brilla encendido y muestra
 * nombre + descripción; los laterales quedan atenuados mostrando solo el
 * ícono; los traseros se desvanecen y reaparecen con cada transición.
 *
 * La mecánica de la rueda viene de `areas.html` del prototipo (nodos en
 * elipse, profundidad → escala/opacidad/apilado, easing perseguidor);
 * aquí la elipse es una órbita 3D de verdad y la perspectiva la da la
 * cámara. Los íconos son botones HTML proyectados sobre cada planeta
 * (posición 3D → pantalla en cada frame): siguen siendo clicables y el
 * escenario responde a las flechas del teclado.
 *
 * `prefers-reduced-motion`: sin bucle de animación — se renderiza un solo
 * frame estático y cada cambio de área re-renderiza directo, sin easing.
 * Si WebGL no está disponible, la escena queda vacía y el panel de texto
 * sigue rotando solo.
 */
export default function SpecializationsBlock({ specializations }: SpecializationsBlockProps) {
  const [index, setIndex] = useState(0);
  const [isOut, setIsOut] = useState(false);
  const [reduced, setReduced] = useState(false);
  const indexRef = useRef(index);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const swapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const targetRef = useRef(0);
  const snapRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (value) queueMicrotask(() => setReduced(true));
  }, []);

  /* ── Texto del frente: mismo fade is-out/is-in de tareas anteriores ── */
  const goTo = (next: number) => {
    if (reduced) {
      setIndex(next);
      return;
    }
    setIsOut(true);
    if (swapTimeoutRef.current) clearTimeout(swapTimeoutRef.current);
    swapTimeoutRef.current = setTimeout(() => {
      setIndex(next);
      setIsOut(false);
    }, FADE_SWAP_DELAY_MS);
  };

  const restartTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      goTo((indexRef.current + 1) % specializations.length);
    }, AUTO_ADVANCE_MS);
  };

  useEffect(() => {
    restartTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (swapTimeoutRef.current) clearTimeout(swapTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restartTimer se reconstruye cada render a propósito, no debe re-disparar el efecto
  }, [specializations.length]);

  const stepBy = (delta: number) => {
    const n = specializations.length;
    goTo(((index + delta) % n + n) % n);
    restartTimer();
  };

  const onStageKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      stepBy(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      stepBy(-1);
    }
  };

  /* ── Ángulo objetivo de la órbita: sigue a `index` por el camino corto ── */
  useEffect(() => {
    const TWO_PI = Math.PI * 2;
    const want = -index * STEP;
    const t = targetRef.current;
    const diff = ((((want - t) % TWO_PI) + TWO_PI + Math.PI) % TWO_PI) - Math.PI;
    targetRef.current = t + diff;
    snapRef.current?.(); // sólo existe en modo reduced: re-render estático
  }, [index]);

  /* ── Escena Three.js ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedLocal = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = specializations.length;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return; // sin WebGL: el panel de texto sigue funcionando solo
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 2.6, 9.2);
    camera.lookAt(0, 0.1, 0);

    /* Todo el sistema va en un grupo con un leve alabeo diagonal,
       como el referente del disco de acreción visto en ángulo. */
    const system = new THREE.Group();
    system.rotation.z = -0.08;
    scene.add(system);

    /* Núcleo: esfera oscura + glow aditivo */
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x140406,
      roughness: 0.35,
      metalness: 0.15,
      emissive: 0x2b0406,
      emissiveIntensity: 0.55,
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(1.4, 48, 48), coreMat);
    system.add(core);

    const coreGlowTex = glowTexture("rgba(255,238,214,.95)", "rgba(237,28,36,.5)");
    const coreGlowMat = new THREE.SpriteMaterial({
      map: coreGlowTex,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.9,
    });
    const coreGlow = new THREE.Sprite(coreGlowMat);
    coreGlow.scale.setScalar(6.4);
    system.add(coreGlow);

    /* Disco de acreción: anillo de partículas en el plano de la órbita */
    const RING_COUNT = 1100;
    const ringPos = new Float32Array(RING_COUNT * 3);
    const ringCol = new Float32Array(RING_COUNT * 3);
    const inner = new THREE.Color(0xffbd59);
    const outer = new THREE.Color(0x920207);
    for (let i = 0; i < RING_COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.7 + Math.pow(Math.random(), 1.6) * 1.5;
      ringPos[i * 3] = Math.cos(a) * r;
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 0.12;
      ringPos[i * 3 + 2] = Math.sin(a) * r;
      const c = inner.clone().lerp(outer, (r - 1.7) / 1.5);
      ringCol[i * 3] = c.r;
      ringCol[i * 3 + 1] = c.g;
      ringCol[i * 3 + 2] = c.b;
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute("position", new THREE.BufferAttribute(ringPos, 3));
    ringGeo.setAttribute("color", new THREE.BufferAttribute(ringCol, 3));
    const ringMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.85,
    });
    const ring = new THREE.Points(ringGeo, ringMat);
    system.add(ring);

    /* Aro fino y nítido, como el filo brillante del disco */
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(2.02, 0.014, 8, 160),
      new THREE.MeshBasicMaterial({
        color: 0xffbd59,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.5,
      })
    );
    torus.rotation.x = Math.PI / 2;
    system.add(torus);

    /* Campo de estrellas */
    const STAR_COUNT = 420;
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);
    const starA = new THREE.Color(0xf5f4f2);
    const starB = new THREE.Color(0xed1c24);
    for (let i = 0; i < STAR_COUNT; i++) {
      const v = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      )
        .normalize()
        .multiplyScalar(14 + Math.random() * 16);
      starPos[i * 3] = v.x;
      starPos[i * 3 + 1] = v.y;
      starPos[i * 3 + 2] = v.z;
      const c = Math.random() < 0.85 ? starA : starB;
      starCol[i * 3] = c.r;
      starCol[i * 3 + 1] = c.g;
      starCol[i * 3 + 2] = c.b;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        size: 0.07,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      })
    );
    scene.add(stars);

    /* Planetas + su glow */
    const planetGlowTex = glowTexture("rgba(255,189,89,.9)", "rgba(237,28,36,.4)");
    const planets: THREE.Mesh[] = [];
    const planetMats: THREE.MeshStandardMaterial[] = [];
    const glows: THREE.Sprite[] = [];
    const glowMats: THREE.SpriteMaterial[] = [];
    for (let i = 0; i < n; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xed1c24,
        roughness: 0.38,
        metalness: 0.05,
        emissive: 0xed1c24,
        emissiveIntensity: 0.3,
        transparent: true,
      });
      const planet = new THREE.Mesh(new THREE.SphereGeometry(PLANET_R, 32, 32), mat);
      system.add(planet);
      planets.push(planet);
      planetMats.push(mat);

      const gm = new THREE.SpriteMaterial({
        map: planetGlowTex,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0,
      });
      const glow = new THREE.Sprite(gm);
      system.add(glow);
      glows.push(glow);
      glowMats.push(gm);
    }

    /* Luces: el núcleo ilumina a los planetas desde adentro */
    scene.add(new THREE.AmbientLight(0x1a0d10, 1.4));
    const coreLight = new THREE.PointLight(0xed1c24, 55, 30);
    scene.add(coreLight);
    const warmLight = new THREE.PointLight(0xffbd59, 22, 20);
    warmLight.position.set(0, 1.6, 0);
    scene.add(warmLight);
    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(0, 3, 8);
    scene.add(fill);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      /* En encuadres angostos (mobile) la cámara retrocede para que los
         planetas laterales sigan asomando por los costados. */
      camera.position.z = camera.aspect < 1.2 ? 14 : 9.2;
      camera.lookAt(0, 0.1, 0);
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedLocal) {
        update();
        renderer.render(scene, camera);
      }
    });
    resizeObserver.observe(canvas);

    let angle = targetRef.current;
    const proj = new THREE.Vector3();

    /* Coloca planetas según `angle` y proyecta los íconos HTML encima */
    const update = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      for (let i = 0; i < n; i++) {
        const theta = FRONT + i * STEP + angle;
        const t = Math.sin(theta); // -1 atrás · +1 al frente
        planets[i].position.set(Math.cos(theta) * ORBIT_R, 0, t * ORBIT_R);
        const scale = 0.8 + 0.4 * Math.max(0, t);
        planets[i].scale.setScalar(scale);
        const opacity = t >= 0 ? 0.55 + 0.45 * t : Math.max(0, 0.55 + t * 1.3);
        planetMats[i].opacity = opacity;
        planetMats[i].emissiveIntensity = 0.25 + Math.max(0, t) * 1.2;
        glows[i].position.copy(planets[i].position);
        glows[i].scale.setScalar(scale * 2.4);
        glowMats[i].opacity = opacity * (t > 0 ? 0.75 : 0.3);

        const btn = iconRefs.current[i];
        if (btn) {
          planets[i].getWorldPosition(proj).project(camera);
          const x = (proj.x * 0.5 + 0.5) * w;
          const y = (-proj.y * 0.5 + 0.5) * h;
          btn.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale.toFixed(3)})`;
          btn.style.opacity = opacity.toFixed(3);
          btn.style.zIndex = String(100 + Math.round(t * 50));
          btn.style.pointerEvents = opacity < 0.2 ? "none" : "auto";
        }
      }
    };

    if (reducedLocal) {
      update();
      renderer.render(scene, camera);
      snapRef.current = () => {
        angle = targetRef.current;
        update();
        renderer.render(scene, camera);
      };
    }

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      angle += (targetRef.current - angle) * (1 - Math.pow(1 - EASE, dt * 60));

      /* Movimiento ambiental, lento */
      ring.rotation.y += dt * 0.05;
      torus.rotation.z += dt * 0.02;
      stars.rotation.y += dt * 0.006;
      coreGlowMat.opacity = 0.82 + Math.sin(now * 0.0007) * 0.1;
      core.rotation.y += dt * 0.04;
      for (const p of planets) p.rotation.y += dt * 0.35;

      update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reducedLocal) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    if (!reducedLocal) {
      raf = requestAnimationFrame(tick);
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      snapRef.current = null;
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points || o instanceof THREE.Sprite) {
          o.geometry?.dispose?.();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          for (const m of mats) {
            if ("map" in m && m.map instanceof THREE.Texture) m.map.dispose();
            m.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [specializations]);

  const current = specializations[index];

  return (
    <section className="overflow-hidden border-t border-white/[.07]">
      <RevealOnScroll direction="up" className="mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <p className="mb-5 flex items-center gap-3.5 font-[family-name:var(--font-archivo)] text-xs font-bold tracking-[.22em] text-[#ED1C24] uppercase before:h-[2px] before:w-[34px] before:flex-none before:bg-current">
          Especializaciones
        </p>
        <h2 className="max-w-[26ch] font-[family-name:var(--font-archivo-black)] text-[clamp(30px,4.2vw,58px)] leading-[1.02] tracking-[-.03em] text-balance">
          Seis ramas, un mismo centro
        </h2>
      </RevealOnScroll>

      {/* Escenario 3D */}
      <div
        ref={stageRef}
        role="group"
        tabIndex={0}
        aria-label="Especializaciones del centro. Usa las flechas para girar la órbita o haz clic en un área."
        onKeyDown={onStageKeyDown}
        className="relative mx-auto h-[62vh] max-h-[720px] min-h-[460px] w-full outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ED1C24]"
      >
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        {specializations.map((spec, i) => (
          <button
            key={spec.slug}
            ref={(el) => {
              iconRefs.current[i] = el;
            }}
            type="button"
            tabIndex={-1}
            onClick={() => {
              goTo(i);
              restartTimer();
            }}
            aria-label={spec.name}
            aria-current={i === index ? "true" : undefined}
            className="absolute top-0 left-0 flex h-14 w-14 items-center justify-center text-white opacity-0 will-change-transform"
            style={{ pointerEvents: "none" }}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-7 w-7 fill-none stroke-current stroke-[1.6] drop-shadow-[0_2px_6px_rgba(0,0,0,.6)]"
            >
              {spec.icon.split("|").map((d) => (
                <path key={d} d={d} strokeLinecap="round" strokeLinejoin="round" />
              ))}
            </svg>
          </button>
        ))}
      </div>

      {/* Panel del área al frente */}
      <div
        aria-live="polite"
        style={{ transitionDuration: reduced ? undefined : `${FADE_TRANSITION_MS}ms` }}
        className={`mx-auto -mt-10 max-w-[52ch] px-4 pb-16 text-center transition-[opacity,transform] ease-[cubic-bezier(.22,.61,.36,1)] lg:pb-24 ${
          isOut ? "translate-y-[10px] opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <span className="mb-3 block font-[family-name:var(--font-archivo)] text-xs font-bold tracking-[.16em] text-[#FFBD59] uppercase">
          {current.short}
        </span>
        <h3 className="mb-4 font-[family-name:var(--font-archivo)] text-2xl font-bold tracking-[-.015em]">
          {current.name}
        </h3>
        <p className="text-[clamp(16px,1.25vw,19px)] leading-[1.7] font-light text-zinc-400 text-pretty">
          {current.desc}
        </p>
      </div>
    </section>
  );
}
