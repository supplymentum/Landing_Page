"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";

import type { PublicArea } from "@/lib/api/areas";
import NetworkBackground from "@/components/home/NetworkBackground";
import Cube3D from "@/components/home/Cube3D";

import {
  AREA_ICON_PATHS,
} from "@/lib/data/areaIcons";

interface AreasSectionProps {
  initialAreas: PublicArea[];
}

export default function AreasSection({
  initialAreas,
}: AreasSectionProps) {
  const wheelRef = useRef<HTMLDivElement>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const currentIdxRef = useRef(0);

  const nodeRefs =
    useRef<(HTMLButtonElement | null)[]>([]);

  /*
   * Estado de la animación.
   * Se utilizan refs para evitar renders constantes
   * durante el movimiento del carrusel.
   */
  const angleRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const movedRef = useRef(0);

  const FRONT = Math.PI / 2;

  const N = initialAreas.length;

  const STEP =
    N > 0
      ? (Math.PI * 2) / N
      : 0;

  const RX = 38;
  const RY = 25;

  const displayArea =
    initialAreas[displayIdx] ?? null;

  useEffect(() => {
    if (currentIdx === displayIdx) {
      return;
    }

    setIsFading(true);

    const timeout = setTimeout(() => {
      setDisplayIdx(currentIdx);
      setIsFading(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [currentIdx, displayIdx]);

  const goTo = useCallback(
    (index: number) => {
      if (N === 0 || STEP === 0) {
        return;
      }

      const want =
        FRONT - index * STEP;

      let diff =
        (want - targetRef.current) %
        (Math.PI * 2);

      if (diff > Math.PI) {
        diff -= Math.PI * 2;
      }

      if (diff < -Math.PI) {
        diff += Math.PI * 2;
      }

      targetRef.current += diff;
    },
    [FRONT, STEP, N],
  );

  useEffect(() => {
    if (N === 0 || STEP === 0) {
      return;
    }

    const reduced = window
      .matchMedia(
        "(prefers-reduced-motion: reduce)",
      )
      .matches;

    const layout = () => {
      let front = 0;
      let best = -Infinity;

      nodeRefs.current.forEach((element, index) => {
        if (!element) {
          return;
        }

        const theta =
          angleRef.current + index * STEP;

        const depth =
          (Math.sin(theta) + 1) / 2;

        element.style.left =
          `${50 + RX * Math.cos(theta)}%`;

        element.style.top =
          `${50 + RY * Math.sin(theta)}%`;

        element.style.transform =
          `scale(${(
            0.62 +
            depth * 0.48
          ).toFixed(3)})`;

        element.style.opacity =
          (0.4 + depth * 0.6).toFixed(3);

        element.style.zIndex =
          Math.round(depth * 100).toString();

        if (depth > best) {
          best = depth;
          front = index;
        }
      });

      nodeRefs.current.forEach(
        (element, index) => {
          if (!element) {
            return;
          }

          const active =
            index === front;

          element.classList.toggle(
            "is-active",
            active,
          );

          element.setAttribute(
            "aria-pressed",
            active ? "true" : "false",
          );
        },
      );

      if (
        currentIdxRef.current !== front
      ) {
        currentIdxRef.current = front;
        setCurrentIdx(front);
      }
    };

    const loop = () => {
      const difference =
        targetRef.current -
        angleRef.current;

      if (
        Math.abs(difference) >
        1e-4
      ) {
        angleRef.current +=
          difference * 0.11;

        layout();
      }

      rafRef.current =
        requestAnimationFrame(loop);
    };

    goTo(0);

    angleRef.current = FRONT;

    layout();

    if (!reduced) {
      rafRef.current =
        requestAnimationFrame(loop);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(
          rafRef.current,
        );
      }
    };
  }, [STEP, FRONT, N, goTo]);

  function handlePointerDown(
    event: React.PointerEvent,
  ) {
    if (N === 0) {
      return;
    }

    isDraggingRef.current = true;

    lastXRef.current =
      event.clientX;

    movedRef.current = 0;
  }

  function handlePointerMove(
    event: React.PointerEvent,
  ) {
    if (
      !isDraggingRef.current ||
      N === 0 ||
      STEP === 0
    ) {
      return;
    }

    const dx =
      event.clientX -
      lastXRef.current;

    lastXRef.current =
      event.clientX;

    movedRef.current +=
      Math.abs(dx);

    targetRef.current +=
      dx * 0.009;

    angleRef.current +=
      dx * 0.009;

    let front = 0;
    let best = -Infinity;

    nodeRefs.current.forEach(
      (element, index) => {
        if (!element) {
          return;
        }

        const theta =
          angleRef.current +
          index * STEP;

        const depth =
          (Math.sin(theta) + 1) /
          2;

        element.style.left =
          `${50 + RX * Math.cos(theta)}%`;

        element.style.top =
          `${50 + RY * Math.sin(theta)}%`;

        element.style.transform =
          `scale(${(
            0.62 +
            depth * 0.48
          ).toFixed(3)})`;

        element.style.opacity =
          (0.4 + depth * 0.6).toFixed(3);

        element.style.zIndex =
          Math.round(
            depth * 100,
          ).toString();

        if (depth > best) {
          best = depth;
          front = index;
        }
      },
    );

    nodeRefs.current.forEach(
      (element, index) => {
        if (!element) {
          return;
        }

        const active =
          index === front;

        element.classList.toggle(
          "is-active",
          active,
        );

        element.setAttribute(
          "aria-pressed",
          active
            ? "true"
            : "false",
        );
      },
    );

    if (
      currentIdxRef.current !== front
    ) {
      currentIdxRef.current =
        front;

      setCurrentIdx(front);
    }
  }

  function release() {
    if (
      !isDraggingRef.current ||
      N === 0 ||
      STEP === 0
    ) {
      return;
    }

    isDraggingRef.current = false;

    const raw =
      (FRONT -
        targetRef.current) /
      STEP;

    const index =
      ((Math.round(raw) % N) +
        N) %
      N;

    goTo(index);
  }

  function handleKeyDown(
    event: React.KeyboardEvent,
  ) {
    if (N === 0) {
      return;
    }

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown"
    ) {
      goTo(
        (currentIdx + 1) % N,
      );

      event.preventDefault();
    }

    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp"
    ) {
      goTo(
        (currentIdx - 1 + N) %
        N,
      );

      event.preventDefault();
    }
  }

  /*
   * Si todavía no existen áreas activas en la base de datos,
   * mostramos un estado vacío en lugar de intentar construir
   * el carrusel.
   */
  if (
    initialAreas.length === 0 ||
    !displayArea
  ) {
    return (
      <>
        <NetworkBackground />

        <section
          className="section"
          style={{
            paddingBlock:
              "clamp(48px,6vw,90px)",
          }}
        >
          <div className="wrap">
            <div className="py-20 text-center">
              <p className="eyebrow">
                Nuestras áreas
              </p>

              <h2 className="display mt-4">
                Próximamente
              </h2>

              <p className="lede mx-auto mt-4 max-w-xl">
                Actualmente no hay áreas
                disponibles para mostrar.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <NetworkBackground />

      <section
        className="section"
        style={{
          paddingBlock:
            "clamp(48px,6vw,90px)",
        }}
      >
        <div className="wrap areas-inner">
          <div
            className="wheel"
            id="wheel"
            role="group"
            aria-label="Selector de áreas. Usa las flechas o arrastra para girar."
            tabIndex={0}
            ref={wheelRef}
            onKeyDown={handleKeyDown}
            onPointerDown={
              handlePointerDown
            }
            onPointerMove={
              handlePointerMove
            }
            onPointerUp={release}
            onPointerCancel={release}
          >
            <div
              className="wheel-track"
              aria-hidden="true"
            />

            <div
              className="wheel-core"
              id="wheel-core"
              aria-hidden="true"
            >
              <Cube3D
                size={1.5}
                turnsPerMin={3.2}
                interactive={false}
                camZ={6.6}
                fallbackSrc="/cubo.png"
                fallbackAlt="Logo cubo"
              />
            </div>

            {initialAreas.map(
              (area, index) => {
                const isActive =
                  index === currentIdx;

                const iconPaths =
                  area.icon_key &&
                    area.icon_key in AREA_ICON_PATHS
                    ? AREA_ICON_PATHS[
                    area.icon_key as keyof typeof AREA_ICON_PATHS
                    ]
                    : null;

                return (
                  <button
                    key={area.area_id}
                    ref={(element) => {
                      nodeRefs.current[
                        index
                      ] = element;
                    }}
                    type="button"
                    className={`node ${isActive
                      ? "is-active"
                      : ""
                      }`}
                    aria-label={
                      area.name
                    }
                    aria-pressed={
                      isActive
                    }
                    onClick={(event) => {
                      if (
                        movedRef.current >
                        6
                      ) {
                        event.stopPropagation();
                        event.preventDefault();

                        return;
                      }

                      goTo(index);
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      {iconPaths ? (
                        iconPaths.map(
                          (path, pathIndex) => (
                            <path
                              key={pathIndex}
                              d={path}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          ),
                        )
                      ) : (
                        <>
                          <circle
                            cx="12"
                            cy="12"
                            r="8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />

                          <path
                            d="M8 12h8M12 8v8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                );
              },
            )}
          </div>

          <div className="area-panel">
            <p className="eyebrow">
              Nuestras áreas
            </p>

            <div
              className={`area-fade ${isFading
                ? "is-out"
                : ""
                }`}
              id="area-content"
            >
              {displayArea.short_name && (
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#ED1C24]">
                  {displayArea.short_name}
                </p>
              )}

              <h2
                className="display"
                id="area-name"
              >
                {displayArea.name}
              </h2>

              <p
                className="lede"
                id="area-desc"
              >
                {displayArea.description ??
                  "Conoce más sobre esta área de SupplyMentum."}
              </p>

              <div className="area-lists">
                <div className="area-list">
                  <h4>Qué realizamos</h4>

                  {displayArea.activities.length > 0 ? (
                    <ul id="area-do">
                      {displayArea.activities.map(
                        (item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-zinc-600">
                      Aún no se han registrado actividades.
                    </p>
                  )}
                </div>

                <div className="area-list is-seek">
                  <h4>Qué buscamos</h4>

                  {displayArea.requirements.length > 0 ? (
                    <ul id="area-seek">
                      {displayArea.requirements.map(
                        (item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-zinc-600">
                      Aún no se han registrado requisitos.
                    </p>
                  )}
                </div>
              </div>



              <Link
                href={`/areas/${displayArea.area_id}`}
                className="btn btn-primary mt-6"
                id="area-link"
              >
                Descubre más →
              </Link>
            </div>

            <p className="wheel-hint">
              <span aria-hidden="true">
                ↔
              </span>{" "}
              Arrastra, usa las
              flechas o haz clic en
              un área
            </p>
          </div>
        </div>
      </section>
    </>
  );
}