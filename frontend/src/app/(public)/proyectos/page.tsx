"use client";

import Image from "next/image";

import ConstellationBackground from "@/components/convocatoria/ConstellationBackground";
import BandaTransportadora from "@/components/proyectos/BandaTransportadora";
import ProyectosRacks from "@/components/proyectos/ProyectosRacks";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { Archivo_Black, Archivo, Open_Sans } from "next/font/google";

import proyectosHeroImage from "@/assets/data-visualization-for-project-management-vw4gow5w6tyzaygb.jpg";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black"
});

const archivoN = Archivo({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-archivo-n"
});

const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-open-sans"
});

export default function ProyectosPage() {
  return (
    <div className={`${archivoBlack.variable} ${archivoN.variable} ${openSans.variable} relative w-full flex flex-col min-h-screen bg-[#070709] text-white overflow-hidden justify-start items-center`}>
      <SmoothScroll />

      {/* Hero: imagen de fondo con tratamiento de marca */}
      <div className="relative z-0 w-full overflow-hidden">
        <Image
          src={proyectosHeroImage}
          alt="Visualización de datos aplicada a la gestión de proyectos."
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover grayscale-[.4] brightness-[.35] contrast-[1.05]"
        />

        {/* Constellation Canvas background */}
        <ConstellationBackground />

        {/* Red Radial Glow Effect */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[720px] h-[450px] pointer-events-none opacity-50 z-0"
          style={{
            background:
              "radial-gradient(circle, rgba(146, 2, 7, 0.42) 0%, rgba(237, 28, 36, 0.1) 40%, rgba(7, 7, 9, 0) 75%)",
          }}
        />

        {/* Hero Header */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center pt-22 pb-16 px-4">
          {/* Medium-large title */}
          <h1 className={`${archivoBlack.className} text-[70px] leading-none tracking-wider text-white mb-4 uppercase`}>
            PROYECTOS
          </h1>

          {/* Small subtitle below */}
          <p className={`${openSans.className} text-sm sm:text-base md:text-lg text-zinc-400 font-normal max-w-2xl leading-relaxed opacity-80`}>
            Iniciativas reales que llevan el Supply Chain de la teoría a la práctica.
          </p>
        </div>

        {/* Degradado inferior para fundir la foto con el resto de la página */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-b from-transparent to-[#070709]" />
      </div>

      {/* Sección Proyectos Destacados */}
      <section className="relative z-10 w-full pt-12 sm:pt-16 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center border-t border-zinc-900/60">
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start">

          {/* Subtitle with line */}
          <div className="flex items-center gap-3 ml-16">
            <span className="w-6 h-[2px] bg-[#ED1C24]" />
            <span className={`${archivoN.className} text-[12px] font-bold tracking-[0.2em] text-[#ED1C24] uppercase`}>
              DESTACADOS
            </span>
          </div>

          {/* Conveyor Belt / Banda Transportadora */}
          <div className="w-full">
            <BandaTransportadora />
          </div>
        </div>
      </section>

      {/* Sección Catálogo de Proyectos */}
      <ProyectosRacks />
    </div>
  );
}
