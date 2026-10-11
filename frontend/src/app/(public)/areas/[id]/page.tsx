import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import AreaCTA from "@/components/areas/AreaCTA";
import SmoothScroll from "@/components/ui/SmoothScroll";

import mktCrmFallbackImage from "@/assets/mkt-crm-hero.jpg";
import cheFallbackImage from "@/assets/capital-humano-hero.jpg";
import growthFallbackImage from "@/assets/growth-lab-hero.jpg";
import logFinFallbackImage from "@/assets/images.jpg";

/*
 * Imágenes de respaldo para el hero, solo para las áreas que aún
 * no tienen `image_url` configurada desde el backend. Se mapean
 * por `short_name` para no afectar a otras áreas.
 */
const AREA_FALLBACK_IMAGES: Record<string, typeof mktCrmFallbackImage> = {
  "MKT & CRM": mktCrmFallbackImage,
  "CHE": cheFallbackImage,
  "GROWTH": growthFallbackImage,
  "LOG & FIN": logFinFallbackImage,
};

import {
  getPublicArea,
} from "@/lib/api/areas";

import {
  type PublicExecutive,
  getPublicExecutives,
} from "@/lib/api/executives";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps) {
  const { id } = await params;

  const areaId = Number(id);

  if (
    !Number.isInteger(areaId) ||
    areaId <= 0
  ) {
    return {
      title:
        "Área no encontrada | SupplyMentum UNI",
    };
  }

  try {
    const area =
      await getPublicArea(areaId);

    return {
      title:
        `${area.name} | SupplyMentum UNI`,

      description:
        area.description ??
        `Conoce más sobre ${area.name} en SupplyMentum UNI.`,
    };
  } catch {
    return {
      title:
        "Área no encontrada | SupplyMentum UNI",
    };
  }
}

export default async function AreaDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const areaId = Number(id);

  if (
    !Number.isInteger(areaId) ||
    areaId <= 0
  ) {
    notFound();
  }

  let area;

  try {
    area =
      await getPublicArea(areaId);
  } catch {
    notFound();
  }

  /*
   * Obtenemos los directivos públicos y dejamos únicamente
   * aquellos que pertenecen al área actual.
   *
   * El backend ya los devuelve ordenados según:
   * 1. jerarquía del rol
   * 2. sort_order del directivo
   */
  let areaExecutives: PublicExecutive[] = [];

  try {
    const executives =
      await getPublicExecutives();

    areaExecutives =
      executives.filter(
        (executive) =>
          executive.area_id ===
          area.area_id,
      );
  } catch {
    /*
     * Si por algún motivo falla la carga de directivos,
     * permitimos que la información principal del área
     * siga mostrándose.
     */
    areaExecutives = [];
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F4F2]">
      <SmoothScroll />

      {/* Hero */}
      <section className="relative flex min-h-[56vh] items-end overflow-hidden">
        {(() => {
          const fallbackImage = area.short_name
            ? AREA_FALLBACK_IMAGES[area.short_name]
            : undefined;

          if (area.image_url) {
            return (
              <img
                src={area.image_url}
                alt={area.name}
                className="absolute inset-0 h-full w-full object-cover grayscale-[0.5] brightness-[0.6] contrast-[1.05]"
              />
            );
          }

          if (fallbackImage) {
            return (
              <Image
                src={fallbackImage}
                alt={area.name}
                fill
                priority
                sizes="100vw"
                className="absolute inset-0 h-full w-full object-cover grayscale-[0.5] brightness-[0.5] contrast-[1.05]"
              />
            );
          }

          return <div className="absolute inset-0 bg-[#131316]" />;
        })()}

        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(146,2,7,0.25)] via-[rgba(11,11,12,0.55)] to-[#0B0B0C]" />

        <div className="wrap relative flex flex-col items-center pb-[64px] pt-[120px] text-center">
          <Link
            href="/areas"
            className="mb-[24px] inline-block border-none bg-transparent text-[13px] tracking-[1px] text-[#C9C8CE] transition-colors hover:text-[#ED1C24] font-[family-name:var(--font-archivo)]"
          >
            ← TODAS LAS ÁREAS
          </Link>

          {area.short_name && (
            <div className="mb-4 text-[12px] font-bold uppercase tracking-[4px] text-[#ED1C24] font-[family-name:var(--font-archivo)]">
              {area.short_name}
            </div>
          )}

          <h1 className="m-0 mb-[18px] max-w-[900px] text-[40px] font-black leading-[1.05] md:text-[60px] font-[family-name:var(--font-archivo-black)]">
            {area.name}
          </h1>

          <p className="m-0 max-w-[900px] text-pretty text-[17px] font-light leading-[1.7] text-[#C9C8CE] font-[family-name:var(--font-archivo)]">
            {area.description ??
              "Conoce más sobre esta área de SupplyMentum."}
          </p>
        </div>
      </section>

      {/* Qué realizamos / Qué buscamos */}
      <section className="section py-[60px] md:py-[100px]">
        <div className="wrap mx-auto grid max-w-[1000px] grid-cols-1 gap-[20px] lg:grid-cols-2">

          {/* Qué realizamos */}
          <div className="border border-[#26262A] border-t-[3px] border-t-[#ED1C24] bg-[#131316] p-[32px] md:p-[48px_42px]">
            <h2 className="m-0 mb-[28px] text-[26px] font-extrabold md:text-[30px] font-[family-name:var(--font-archivo-black)]">
              ¿Qué realizamos?
            </h2>

            <div className="flex flex-col gap-[18px]">
              {area.activities.length > 0 ? (
                area.activities.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-[16px]"
                    >
                      <div className="mt-[9px] h-[8px] w-[8px] shrink-0 bg-[#ED1C24]" />

                      <div className="text-[15px] font-light leading-[1.7] text-[#C9C8CE] font-[family-name:var(--font-archivo)]">
                        {item}
                      </div>
                    </div>
                  ),
                )
              ) : (
                <p className="text-[14px] text-[#9B9AA0]">
                  Aún no se han registrado actividades.
                </p>
              )}
            </div>
          </div>

          {/* Qué buscamos */}
          <div className="border border-[#26262A] border-t-[3px] border-t-[#FFBD59] bg-[#131316] p-[32px] md:p-[48px_42px]">
            <h2 className="m-0 mb-[28px] text-[26px] font-extrabold md:text-[30px] font-[family-name:var(--font-archivo-black)]">
              ¿Qué buscamos?
            </h2>

            <div className="flex flex-col gap-[18px]">
              {area.requirements.length > 0 ? (
                area.requirements.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-[16px]"
                    >
                      <div className="mt-[9px] h-[8px] w-[8px] shrink-0 bg-[#FFBD59]" />

                      <div className="text-[15px] font-light leading-[1.7] text-[#C9C8CE] font-[family-name:var(--font-archivo)]">
                        {item}
                      </div>
                    </div>
                  ),
                )
              ) : (
                <p className="text-[14px] text-[#9B9AA0]">
                  Aún no se han registrado requisitos.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dirección del área */}
      {areaExecutives.length > 0 && (
        <section className="section pb-[60px] md:pb-[100px]">
          <div className="wrap mx-auto flex max-w-[900px] flex-col items-center">

            <div className="mb-[18px] text-center text-[12px] font-bold uppercase tracking-[4px] text-[#ED1C24] font-[family-name:var(--font-archivo)]">
              Liderazgo
            </div>

            <h2 className="m-0 mb-[36px] text-center text-[32px] font-extrabold md:mb-[48px] md:text-[38px] font-[family-name:var(--font-archivo-black)]">
              Dirección del área
            </h2>

            <div
              className={`mx-auto grid w-full gap-[20px] text-left ${
                areaExecutives.length === 1
                  ? "max-w-[330px] grid-cols-1"
                  : "max-w-[680px] grid-cols-1 md:grid-cols-2"
              }`}
            >
              {areaExecutives.map(
                (executive) => (
                  <div
                    key={
                      executive.executive_id
                    }
                    className="group border border-[#26262A] bg-[#131316]"
                  >
                    {/* Imagen */}
                    <div className="relative aspect-square overflow-hidden border-b-[3px] border-b-[#ED1C24]">
                      {executive.image_url ? (
                        <img
                          src={
                            executive.image_url
                          }
                          alt={
                            executive.full_name
                          }
                          className="absolute inset-0 h-full w-full object-cover grayscale-[0.35] brightness-[0.85] transition-all duration-500 group-hover:grayscale-0 group-hover:brightness-100"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1E]">
                          <span className="text-[48px] font-black text-[#34343A] font-[family-name:var(--font-archivo-black)]">
                            {executive.full_name
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* LinkedIn */}
                      {executive.linkedin_url && (
                        <a
                          href={
                            executive.linkedin_url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`LinkedIn de ${executive.full_name}`}
                          className="absolute right-[14px] top-[14px] flex h-[38px] w-[38px] items-center justify-center border border-[#26262A] bg-[#0B0B0C] text-[15px] font-extrabold text-[#ED1C24] transition-colors hover:bg-[#1f1f23] font-[family-name:var(--font-archivo-black)]"
                        >
                          in
                        </a>
                      )}
                    </div>

                    {/* Información */}
                    <div className="p-[22px_24px]">
                      <div className="text-[17px] font-bold font-[family-name:var(--font-archivo-black)]">
                        {
                          executive.full_name
                        }
                      </div>

                      {executive.role && (
                        <div className="mb-[10px] mt-[6px] text-[12px] font-semibold uppercase tracking-[1.5px] text-[#ED1C24] font-[family-name:var(--font-archivo)]">
                          {
                            executive.role.name
                          }
                        </div>
                      )}

                      {executive.description && (
                        <div className="text-[13px] font-light leading-[1.6] text-[#9B9AA0] font-[family-name:var(--font-archivo)]">
                          {
                            executive.description
                          }
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      <AreaCTA />
    </div>
  );
}