"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import heroImage from "@/assets/Foto_Evento2_2023_3.jpg";

import type {
  PublicExecutive,
} from "@/lib/api/executives";

interface ConocenosProps {
  initialExecutives: PublicExecutive[];
}

export default function Conocenos({
  initialExecutives,
}: ConocenosProps) {

  const duplicatedExecutives = [
    ...initialExecutives,
    ...initialExecutives,
  ];

  return (
    <div className="min-h-screen bg-transparent font-sans text-[#F5F4F2]">
      {/* HERO */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-b border-[#1A1A1F] px-4 text-center">
        <Image
          src={heroImage}
          alt="Miembros de SupplyMentum UNI durante un evento de la comunidad."
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 z-0 object-cover object-center grayscale-[.35] brightness-[.45]"
        />

        {/* Degradado de marca sobre la foto para mantener legibilidad y coherencia visual */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#070709]/80 via-[#070709]/70 to-[#070709]"
        />
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#920207]/25 to-transparent blur-[100px]" />

        <div className="relative z-20 mx-auto max-w-4xl px-4">
          <span className="mb-4 block text-[12px] font-bold uppercase tracking-[6px] text-[#FFBD59] md:text-[13px]">
            CONÓCENOS
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-6xl">
            Inspiramos a los futuros profesionales a{" "}
            <span className="text-[#ED1C24]">
              transformar
            </span>{" "}
            el mundo empresarial
          </h1>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="border border-[#26262A] border-l-[6px] border-l-[#ED1C24] bg-[#131316] p-10 transition-transform duration-300 hover:scale-[1.01]">
            <span className="mb-4 block text-[13px] font-extrabold tracking-[4px] text-[#ED1C24]">
              MISIÓN
            </span>

            <p className="text-lg font-light leading-relaxed text-[#D8D7D4] md:text-xl">
              Brindar formación aplicada y accesible para fortalecer
              competencias técnicas y estratégicas, mediante programas
              innovadores y metodologías prácticas.
            </p>
          </div>

          <div className="bg-[#ED1C24] p-10 shadow-xl shadow-[#ED1C24]/10 transition-transform duration-300 hover:scale-[1.01]">
            <span className="mb-4 block text-[13px] font-extrabold tracking-[4px] text-[#FFBD59]">
              VISIÓN
            </span>

            <p className="text-lg font-light leading-relaxed text-white md:text-xl">
              Ser la comunidad universitaria líder en{" "}
              <strong className="font-semibold text-[#FED775]">
                Supply Chain
              </strong>{" "}
              en el Perú, reconocida por su excelencia, innovación y por
              inspirar a los futuros profesionales a transformar el mundo
              empresarial.
            </p>
          </div>
        </div>
      </section>

      {/* JUNTA DIRECTIVA */}
      <section className="overflow-hidden border-t border-[#131316] bg-[#070709] py-24">
        <div className="mx-auto mb-14 max-w-7xl px-6 md:px-12">
          <span className="mb-2 block text-[12px] font-bold tracking-[4px] text-[#ED1C24]">
            JUNTA DIRECTIVA
          </span>

          <h2 className="text-3xl font-black text-white md:text-5xl">
            Conoce a nuestro equipo
          </h2>
        </div>

        {initialExecutives.length > 0 ? (
          <div className="relative w-full">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-[60px] bg-gradient-to-r from-[#070709] to-transparent md:w-[120px]" />

            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-[60px] bg-gradient-to-l from-[#070709] to-transparent md:w-[120px]" />

            <div className="w-full select-none overflow-hidden pb-6 pt-2">
              <div className="marquee-track">
              {duplicatedExecutives.map(
                (
                  executive,
                  index,
                ) => (
                  <div
                    key={`${executive.executive_id}-${index}`}
                    className="mr-6 w-[340px] flex-shrink-0 border border-[#22222a] bg-[#121216] transition-transform duration-300 hover:scale-[1.01] md:w-[380px]"
                  >
                    {/* FOTO */}
                    <div className="group relative h-[340px] w-full overflow-hidden border-b-[3px] border-b-[#ED1C24] md:h-[380px]">
                      {executive.image_url ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              executive.image_url
                            }
                            alt={
                              executive.full_name
                            }
                            className="absolute inset-0 h-full w-full object-cover brightness-[85%] grayscale-[35%] transition-all duration-500 group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0"
                          />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#18181C]">
                          <span className="text-[72px] font-black uppercase text-[#34343A]">
                            {executive.full_name
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* LINKEDIN */}
                      {executive.linkedin_url && (
                        <a
                          href={
                            executive.linkedin_url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`LinkedIn de ${executive.full_name}`}
                          className="absolute right-4 top-4 flex h-[38px] w-[38px] items-center justify-center border border-[#22222a] bg-[#0B0B0C] text-[15px] font-bold text-[#ED1C24] shadow-md transition-colors duration-300 hover:bg-[#ED1C24] hover:text-white"
                        >
                          <svg
                            className="h-5 w-5 fill-current"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                    </div>

                    {/* DATOS */}
                    <div className="p-6">
                      <div className="text-[17px] font-bold tracking-wide text-white">
                        {
                          executive.full_name
                        }
                      </div>

                      {executive.role && (
                        <div className="mt-2 text-[12px] font-bold uppercase tracking-[1.5px] text-[#ED1C24]">
                          {
                            executive.role.name
                          }
                        </div>
                      )}

                      <p className="mt-4 min-h-[72px] text-[13px] font-light leading-[1.6] text-[#9B9AA0]">
                        {executive.description ??
                          "Miembro de la Junta Directiva de SupplyMentum UNI."}
                      </p>

                      {executive.area && (
                        <div className="mt-4 border-t border-[#22222A] pt-3 text-[10px] font-semibold uppercase tracking-[1.4px] text-zinc-600">
                          {executive.area
                            .short_name ??
                            executive.area
                              .name}
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="border border-[#22222A] bg-[#121216] px-6 py-12 text-center">
              <p className="text-sm text-zinc-500">
                Aún no hay directivos disponibles para mostrar.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-[#131316] bg-[#0A0A0B]/40 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(146,2,7,0.38),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <h2 className="mb-4 text-3xl font-black text-white md:text-5xl">
            ¿Quieres formar parte?
          </h2>

          <p className="mx-auto mb-10 max-w-xl text-sm font-light text-zinc-400 md:text-base">
            Revisa las áreas abiertas y postula a la convocatoria vigente.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/convocatoria"
              className="bg-[#ED1C24] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-[#ED1C24]/10 transition-all duration-300 hover:bg-[#C4151C] hover:shadow-[#ED1C24]/20"
            >
              Postula aquí
            </Link>

            <Link
              href="/areas"
              className="border border-zinc-800 bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-all duration-300 hover:border-[#ED1C24] hover:text-[#ED1C24]"
            >
              Ver las áreas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}