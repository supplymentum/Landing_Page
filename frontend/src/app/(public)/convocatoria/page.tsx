"use client";

import { useEffect, useState } from "react";
import ConvocatoriaMarquee from "@/components/convocatoria/ConvocatoriaMarquee";
import CountdownTimer from "@/components/convocatoria/CountdownTimer";
import AreasGrid from "@/components/convocatoria/AreasGrid";
import BenefitsGrid from "@/components/convocatoria/BenefitsGrid";
import ConstellationBackground from "@/components/convocatoria/ConstellationBackground";
import ApplicationModal from "@/components/convocatoria/ApplicationModal";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Image from "next/image";
import heroImage from "@/assets/Foto_Evento2_2023_2.jpg";
import { getConvocatoriaSettings, type ConvocatoriaSettings } from "@/lib/api/settings";
import { getPublicAreas, type PublicArea } from "@/lib/api/areas";

export default function ConvocatoriaPage() {
  const [settings, setSettings] = useState<ConvocatoriaSettings | null>(null);
  const [areas, setAreas] = useState<PublicArea[]>([]);
  const [isConvocatoriaActive, setIsConvocatoriaActive] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  /* Postular desde una tarjeta de área: abre el modal con esa área
     ya seleccionada como primera opción. */
  const handleSelectAreaForForm = (areaName: string) => {
    if (!isConvocatoriaActive) {
      return;
    }

    setSelectedArea(areaName);
    setIsFormOpen(true);
  };

  /* Postular desde el botón principal, sin área preseleccionada. */
  const handleOpenForm = () => {
    setSelectedArea(null);
    setIsFormOpen(true);
  };

  /* Al cerrar limpiamos el hash, si no el enlace #postula del header
     dejaría de reabrir el modal la segunda vez. */
  const handleCloseForm = () => {
    setIsFormOpen(false);

    if (window.location.hash === "#postula") {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  };

  /* El header enlaza a /convocatoria#postula desde otras páginas:
     al llegar con ese hash abrimos el modal directamente. */
  useEffect(() => {
    const openIfHashMatches = () => {
      if (window.location.hash === "#postula") {
        setSelectedArea(null);
        setIsFormOpen(true);
      }
    };

    openIfHashMatches();

    window.addEventListener("hashchange", openIfHashMatches);

    return () => {
      window.removeEventListener("hashchange", openIfHashMatches);
    };
  }, []);

  useEffect(() => {
    async function fetchSettingsAndAreas() {
      try {
        const [data, areasData] = await Promise.all([
          getConvocatoriaSettings(),
          getPublicAreas()
        ]);
        setSettings(data);
        setIsConvocatoriaActive(data.is_active);
        setAreas(areasData);
      } catch (err) {
        console.error("Error fetching data", err);
        setIsConvocatoriaActive(true);
      }
    }
    void fetchSettingsAndAreas();
  }, []);

  return (
    <div className="relative w-full flex flex-col min-h-screen bg-[#070709] text-white overflow-hidden">
      <SmoothScroll />

      {/* Constellation Canvas background */}
      <ConstellationBackground />

      {/* Ticker background */}
      <div className="relative z-10">
        <ConvocatoriaMarquee />
      </div>

      {/* Hero Section with Red Radial Glow */}
      <section className="relative z-10 w-full min-h-[65vh] flex flex-col justify-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 items-center text-center overflow-hidden mt-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="SupplyMentum Convocatoria"
            fill
            className="object-cover opacity-[0.65]"
            priority
          />
          {/* Overlays to blend with the dark theme and ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070709] via-[#070709]/50 to-[#070709]" />
        </div>

        {/* Red Radial Glow Effect */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[720px] h-[450px] pointer-events-none opacity-55 z-0"
          style={{
            background:
              "radial-gradient(circle, rgba(146, 2, 7, 0.42) 0%, rgba(237, 28, 36, 0.12) 40%, rgba(7, 7, 9, 0) 75%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full">
          {/* Section Header Line */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-widest text-[#ED1C24] uppercase mb-5">
            <span className="w-8 h-0.5 bg-[#ED1C24]" />
            <span>CONVOCATORIA 2026-II</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 leading-tight whitespace-nowrap">
            {settings?.title ?? "Únete a SupplyMentum UNI"}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-400 font-normal max-w-xl mb-10">
            {settings?.description ?? "La convocatoria está abierta. El tiempo corre."}
          </p>

          {/* Countdown & Button Component */}
          <CountdownTimer
            isConvocatoriaActive={isConvocatoriaActive}
            deadline={settings?.deadline}
            onApply={handleOpenForm}
          />
        </div>
      </section>

      {/* Áreas Abiertas Section */}
      <div className="relative z-10">
        <AreasGrid
          areas={areas}
          onSelectAreaForForm={handleSelectAreaForForm}
          isConvocatoriaActive={isConvocatoriaActive}
        />
      </div>

      {/* Benefits Section */}
      <div className="relative z-10">
        <BenefitsGrid />
      </div>

      {/* Formulario de postulación (modal) */}
      <ApplicationModal
        open={isFormOpen}
        onClose={handleCloseForm}
        preselectedArea={selectedArea}
      />
    </div>
  );
}
