"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  warm: boolean;
}

interface Shipment {
  a: number;
  b: number;
  t: number;
  speed: number;
}

const LINK_DISTANCE = 168;
const SPAWN_INTERVAL_MS = 1100;
const MAX_SHIPMENTS = 5;

/**
 * Fondo de red animada, compartido por toda la Home: nodos que derivan,
 * unidos por rutas, con "envíos" recorriéndolas de a poco. Portado de
 * `initNetwork` (site.js) del prototipo estático.
 */
export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let shipments: Shipment[] = [];
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(64, (width * height) / 26000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.17,
        vy: (Math.random() - 0.5) * 0.17,
        r: Math.random() * 1.5 + 0.7,
        warm: Math.random() < 0.18,
      }));
      shipments = [];
    };

    const spawn = () => {
      if (nodes.length < 2 || shipments.length > MAX_SHIPMENTS) return;
      const a = (Math.random() * nodes.length) | 0;
      let b = (Math.random() * nodes.length) | 0;
      if (a === b) b = (b + 1) % nodes.length;
      shipments.push({ a, b, t: 0, speed: 0.004 + Math.random() * 0.004 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d > LINK_DISTANCE) continue;
          ctx.strokeStyle = `rgba(237,28,36,${(1 - d / LINK_DISTANCE) * 0.16})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = n.warm ? "rgba(237,28,36,.55)" : "rgba(245,244,242,.26)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      shipments = shipments.filter((s) => s.t <= 1);
      for (const s of shipments) {
        s.t += s.speed;
        const a = nodes[s.a];
        const b = nodes[s.b];
        if (!a || !b) continue;
        const fade = Math.sin(s.t * Math.PI);
        ctx.fillStyle = `rgba(255,189,89,${fade * 0.85})`;
        ctx.beginPath();
        ctx.arc(a.x + (b.x - a.x) * s.t, a.y + (b.y - a.y) * s.t, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    const spawnTimer = setInterval(spawn, SPAWN_INTERVAL_MS);
    draw();

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(spawnTimer);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="net"
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full pointer-events-none opacity-[.55] motion-reduce:hidden"
    />
  );
}
