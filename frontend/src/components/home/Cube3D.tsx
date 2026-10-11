"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Cube3DProps {
  size?: number;
  turnsPerMin?: number;
  interactive?: boolean;
  camZ?: number;
  fallbackSrc: string;
  fallbackAlt: string;
  className?: string;
}

/** Pose isométrica: la silueta de un cubo se lee como el hexágono del isotipo. */
const ISO_X = Math.atan(1 / Math.SQRT2); // ≈ 35.264°
const ISO_Y = Math.PI / 4; // 45°

function cubeFrame(size: number, thick: number, material: THREE.Material) {
  const group = new THREE.Group();
  const h = size / 2;
  const len = size + thick; // se solapan en las esquinas
  const add = (w: number, ht: number, d: number, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, ht, d), material);
    mesh.position.set(x, y, z);
    group.add(mesh);
  };
  for (const y of [-h, h]) for (const z of [-h, h]) add(len, thick, thick, 0, y, z);
  for (const x of [-h, h]) for (const z of [-h, h]) add(thick, len, thick, x, 0, z);
  for (const x of [-h, h]) for (const y of [-h, h]) add(thick, thick, len, x, y, 0);
  return group;
}

/**
 * Isotipo de SupplyMentum como geometría real: dos marcos cúbicos anidados
 * (blanco por fuera, rojo por dentro) que giran sobre el eje vertical y
 * responden sutilmente al puntero. Portado de `cube.js` del prototipo.
 * Si WebGL no está disponible o el usuario prefiere movimiento reducido,
 * se muestra `fallbackSrc` (el isotipo en PNG) en su lugar.
 */
export default function Cube3D({
  size = 2.05,
  turnsPerMin = 4.5,
  interactive = true,
  camZ = 6.2,
  fallbackSrc,
  fallbackAlt,
  className = "",
}: Cube3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted3d, setMounted3d] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return; // sin WebGL: se queda el PNG de respaldo
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, camZ);

    const white = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.05, roughness: 0.42 });
    const red = new THREE.MeshStandardMaterial({
      color: 0xed1c24,
      metalness: 0.08,
      roughness: 0.36,
      emissive: 0x5e0206,
      emissiveIntensity: 0.5,
    });

    const group = new THREE.Group();
    const core = cubeFrame(size * 0.6, size * 0.058, red);
    core.position.set(-size * 0.055, -size * 0.055, 0);
    group.add(cubeFrame(size, size * 0.068, white), core);
    group.rotation.set(ISO_X, ISO_Y, 0);
    scene.add(group);

    const pivot = new THREE.Group();
    pivot.add(group);
    scene.add(pivot);

    scene.add(new THREE.AmbientLight(0xb8bac8, 2.1));
    const key = new THREE.DirectionalLight(0xffffff, 3.1);
    key.position.set(4, 6.5, 5.5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd8dcea, 1.25);
    fill.position.set(-3, 1.5, 4);
    scene.add(fill);
    const rim = new THREE.PointLight(0xed1c24, 34, 24);
    rim.position.set(-4.5, -1.5, -3.5);
    scene.add(rim);
    const warm = new THREE.PointLight(0xffbd59, 12, 20);
    warm.position.set(3.5, -3, 2.5);
    scene.add(warm);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const aim = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      aim.x = (e.clientY / window.innerHeight - 0.5) * 0.5;
      aim.y = (e.clientX / window.innerWidth - 0.5) * 0.8;
    };
    if (interactive && !reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    // Se difiere al siguiente tick para no disparar un setState síncrono
    // dentro del efecto (evita el cascading render que marca el linter).
    queueMicrotask(() => setMounted3d(true));

    if (reduced) {
      renderer.render(scene, camera);
      return () => {
        resizeObserver.disconnect();
        renderer.dispose();
      };
    }

    /* Vuelta por tiempo, no por fotograma: misma velocidad a 60 Hz y 120 Hz. */
    const radPerSec = (turnsPerMin / 60) * Math.PI * 2;
    let raf = 0;
    let last = performance.now();
    let spun = 0;
    let mx = 0;
    let my = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      spun += radPerSec * dt;

      mx += (aim.x - mx) * 0.05;
      my += (aim.y - my) * 0.05;

      group.rotation.y = ISO_Y + spun + my * 0.45;
      group.rotation.x = ISO_X + Math.sin(spun * 0.5) * 0.09 + mx * 0.4;
      group.rotation.z = Math.sin(spun * 0.32) * 0.04;
      pivot.position.y = Math.sin(spun * 0.7) * 0.07;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
    };
  }, [size, turnsPerMin, interactive, camZ]);

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
      {/* eslint-disable-next-line @next/next/no-img-element -- isotipo local, no requiere optimización de next/image */}
      <img
        src={fallbackSrc}
        alt={fallbackAlt}
        className={`absolute inset-[12%] object-contain drop-shadow-[0_24px_60px_rgba(237,28,36,0.3)] motion-safe:animate-[float_7s_ease-in-out_infinite] ${
          mounted3d ? "hidden" : ""
        }`}
      />
    </div>
  );
}
