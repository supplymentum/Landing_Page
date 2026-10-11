"use client";

import { useEffect, useRef, useState } from "react";
import ProyectoCard, { Proyecto } from "./ProyectoCard";
import { getProjectImage, getPublicProjects } from "@/lib/api/projects";

export default function BandaTransportadora() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  /* La banda muestra únicamente los proyectos destacados */
  useEffect(() => {
    let cancelado = false;

    getPublicProjects()
      .then((data) => {
        if (cancelado) return;

        setProyectos(
          data
            .filter((project) => project.starred)
            .map((project) => ({
              id: String(project.project_id),
              title: project.name,
              category: project.area.toUpperCase(),
              description: project.description ?? "",
              year: String(project.year),
              imageUrl: getProjectImage(project),
            })),
        );
      })
      .catch(() => {
        /* La banda es decorativa: si falla, simplemente no se muestra. */
      });

    return () => {
      cancelado = true;
    };
  }, []);

  // We duplicate the list 3 times to ensure a completely seamless loop in both directions.
  const duplicarProyectos = () => {
    if (proyectos.length === 0) return [];
    return [...proyectos, ...proyectos, ...proyectos];
  };

  const listaDuplicada = duplicarProyectos();

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;
    const scrollSpeed = 0.7; // Pixels to scroll per frame (smooth)

    const animate = () => {
      // Auto scroll only if not hovered/paused and not actively dragging
      if (!isPaused.current && !isDragging.current) {
        container.scrollLeft += scrollSpeed;
      }

      // Continuous seamless loop logic
      if (container.scrollWidth > container.clientWidth) {
        const oneSetWidth = container.scrollWidth / 3;
        if (container.scrollLeft >= oneSetWidth * 2) {
          container.scrollLeft -= oneSetWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += oneSetWidth;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const onVisibility = () => {
      cancelAnimationFrame(animationFrameId);
      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [listaDuplicada.length]);

  // Drag-to-scroll mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollRef.current;
    if (!container) return;
    isDragging.current = true;
    startX.current = e.pageX - container.offsetLeft;
    scrollLeft.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const container = scrollRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Drag sensitivity multiplier
    container.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <div className="w-full flex flex-col items-center relative select-none">
      {/* Viewport container with horizontal fading overlays */}
      <div className="relative w-full overflow-hidden py-1">
        {/* Scrollable conveyor belt wrapper */}
        <div
          ref={scrollRef}
          className="conveyor-scrollbar w-full overflow-x-auto cursor-grab active:cursor-grabbing py-6 select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseEnter={() => {
            isPaused.current = true;
          }}
          onMouseLeave={() => {
            isPaused.current = false;
            isDragging.current = false;
          }}
          onTouchStart={() => {
            isPaused.current = true;
          }}
          onTouchEnd={() => {
            isPaused.current = false;
          }}
        >
          {/* Moving conveyor belt content (no padding for perfect seamless loop matching scrollWidth / 3) */}
          <div className="flex w-max gap-6 px-4">
            {listaDuplicada.map((proyecto, index) => (
              <ProyectoCard
                key={`${proyecto.id}-${index}`}
                proyecto={proyecto}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
