"use client";

import { useState } from "react";
import { AreaData } from "./AreaDetailModal";
import AreaDetailModal from "./AreaDetailModal";
import RevealOnScroll from "../ui/RevealOnScroll";
import { ArrowRight } from "lucide-react";

// Static AREAS_DATA removed to use dynamic API data

import { PublicArea } from "@/lib/api/areas";

interface AreasGridProps {
  areas: PublicArea[];
  onSelectAreaForForm: (areaName: string) => void;
  isConvocatoriaActive: boolean;
}

export default function AreasGrid({
  areas,
  onSelectAreaForForm,
  isConvocatoriaActive,
}: AreasGridProps) {
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);

  // Map PublicArea to AreaData format used by the modal
  const mappedAreas: AreaData[] = areas.map((a) => ({
    id: a.area_id.toString(),
    name: a.name,
    subtitle: a.short_name || "Área principal",
    description: a.description || "Descripción no disponible.",
    slots: 0, // Fallback if no slots in backend
    requirements: a.requirements || [],
    responsibilities: a.activities || [],
    directors: [], // Not provided by PublicArea
  }));

  return (
    <section id="areas" className="w-full py-20 bg-[#070709] border-t border-zinc-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Line */}
        <RevealOnScroll direction="up">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-0.5 bg-[#ED1C24]" />
            <span className="text-xs font-extrabold tracking-widest text-[#ED1C24] uppercase">
              ÁREAS ABIERTAS
            </span>
          </div>
        </RevealOnScroll>

        {/* Title and Subtitle */}
        <RevealOnScroll direction="up" delayMs={100}>
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
              Elige dónde quieres aportar
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-normal">
              Seis áreas, un mismo requisito: compromiso y ganas de construir algo real.
            </p>
          </div>
        </RevealOnScroll>

        {/* Grid of Area Cards with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappedAreas.map((area, idx) => (
            <RevealOnScroll key={area.id} direction="up" delayMs={150 + idx * 100}>
              <div className="group relative bg-[#121216] border border-zinc-800/80 hover:border-zinc-700 p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-red-950/20 h-full">
                <div>
                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-[#ED1C24] transition-colors">
                    {area.name}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {area.description}
                  </p>
                </div>

                {/* Card Footer Link */}
                <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedArea(area)}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#ED1C24] hover:text-red-400 tracking-wider uppercase group-hover:translate-x-1 transition-all"
                  >
                    Ver el área <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {/* Modal detail */}
      <AreaDetailModal
        area={selectedArea}
        onClose={() => setSelectedArea(null)}
        onApplyForArea={onSelectAreaForForm}
        isConvocatoriaActive={isConvocatoriaActive}
      />
    </section>
  );
}
