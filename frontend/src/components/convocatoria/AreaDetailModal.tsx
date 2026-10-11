"use client";

import { useEffect } from "react";
import { X, CheckCircle, Users, Briefcase, ChevronRight } from "lucide-react";

import ModalPortal from "@/components/ui/ModalPortal";

export interface AreaData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  slots: number;
  requirements: string[];
  responsibilities: string[];
  directors: { name: string; role: string; linkedin: string }[];
}

interface AreaDetailModalProps {
  area: AreaData | null;
  onClose: () => void;
  onApplyForArea: (areaName: string) => void;
  isConvocatoriaActive: boolean;
}

export default function AreaDetailModal({
  area,
  onClose,
  onApplyForArea,
  isConvocatoriaActive,
}: AreaDetailModalProps) {
  /* Cerrar con Escape y bloquear el scroll del fondo mientras está abierto */
  useEffect(() => {
    if (!area) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [area, onClose]);

  if (!area) return null;

  return (
    <ModalPortal>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-2xl bg-[#121216] border border-zinc-800 rounded-none shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-[#0A0A0C]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#ED1C24]" />
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#ED1C24] uppercase">
                DETALLE DE ÁREA
              </span>
              <h3 className="text-xl font-black text-white">{area.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-zinc-300">
          <div>
            <span className="inline-block px-3 py-1 bg-red-950/40 text-[#ED1C24] border border-red-900/40 text-xs font-bold mb-3">
              {area.slots} Cupos Disponibles
            </span>
            <p className="text-zinc-300 leading-relaxed">{area.description}</p>
          </div>

          {/* Profile & Requirements */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-3">
              <Briefcase size={16} className="text-[#ED1C24]" />
              ¿Qué buscamos en ti?
            </h4>
            <ul className="space-y-2">
              {area.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                  <CheckCircle size={14} className="text-[#ED1C24] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Responsibilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-3">
              <Users size={16} className="text-[#ED1C24]" />
              ¿Qué realizarás en el área?
            </h4>
            <ul className="space-y-2">
              {area.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                  <span className="text-[#ED1C24] font-bold">•</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-6 border-t border-zinc-800 bg-[#0A0A0C] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            Cerrar
          </button>
          <button
            disabled={!isConvocatoriaActive}
            onClick={() => {
              onClose();
              onApplyForArea(area.name);
            }}
            className={`w-full sm:w-auto px-8 py-3 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
              isConvocatoriaActive
                ? "bg-[#ED1C24] hover:bg-red-600 text-white shadow-lg hover:shadow-red-600/30"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {isConvocatoriaActive ? (
              <>
                Postular a esta Área <ChevronRight size={16} />
              </>
            ) : (
              "Convocatoria Cerrada"
            )}
          </button>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
