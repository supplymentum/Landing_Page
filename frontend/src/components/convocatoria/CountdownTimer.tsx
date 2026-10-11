"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  isConvocatoriaActive: boolean;
  /** ISO date string from settings */
  deadline?: string;
  /** Abre el modal de postulación */
  onApply: () => void;
}

export default function CountdownTimer({
  isConvocatoriaActive,
  deadline,
  onApply,
}: CountdownTimerProps) {
  // Target date (fallback if deadline is missing)
  const targetDateStr = deadline ?? "2026-08-15T23:59:59.000Z";
  const targetDate = new Date(targetDateStr).getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [formattedDate, setFormattedDate] = useState("Cierre de postulaciones...");

  useEffect(() => {
    try {
      const dateObj = new Date(targetDateStr);
      const formatted = new Intl.DateTimeFormat("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Lima"
      }).format(dateObj);
      setFormattedDate(`Cierre de postulaciones: ${formatted}`);
    } catch {
      setFormattedDate("Cierre de postulaciones: Por definir");
    }

    if (!isConvocatoriaActive) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isConvocatoriaActive, targetDate, targetDateStr]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Main Countdown Grid - Slightly Larger Balanced Boxes */}
      <div
        className={`flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 transition-all duration-300 ${
          isConvocatoriaActive ? "" : "grayscale opacity-50"
        }`}
      >
        {/* Days Box */}
        <div className="w-24 sm:w-28 lg:w-32 h-26 sm:h-30 lg:h-34 bg-[#141418] border-t-3 border-t-[#ED1C24] border-x border-b border-zinc-800 flex flex-col items-center justify-center shadow-xl">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans">
            {pad(timeLeft.days)}
          </span>
          <span className="text-[9.5px] sm:text-[11px] font-extrabold tracking-[0.2em] text-zinc-400 uppercase mt-2.5">
            DÍAS
          </span>
        </div>

        {/* Hours Box */}
        <div className="w-24 sm:w-28 lg:w-32 h-26 sm:h-30 lg:h-34 bg-[#141418] border-t-3 border-t-[#ED1C24] border-x border-b border-zinc-800 flex flex-col items-center justify-center shadow-xl">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans">
            {pad(timeLeft.hours)}
          </span>
          <span className="text-[9.5px] sm:text-[11px] font-extrabold tracking-[0.2em] text-zinc-400 uppercase mt-2.5">
            HORAS
          </span>
        </div>

        {/* Minutes Box */}
        <div className="w-24 sm:w-28 lg:w-32 h-26 sm:h-30 lg:h-34 bg-[#141418] border-t-3 border-t-[#ED1C24] border-x border-b border-zinc-800 flex flex-col items-center justify-center shadow-xl">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans">
            {pad(timeLeft.minutes)}
          </span>
          <span className="text-[9.5px] sm:text-[11px] font-extrabold tracking-[0.2em] text-zinc-400 uppercase mt-2.5">
            MINUTOS
          </span>
        </div>

        {/* Seconds Box */}
        <div className="w-24 sm:w-28 lg:w-32 h-26 sm:h-30 lg:h-34 bg-[#141418] border-t-3 border-t-[#ED1C24] border-x border-b border-zinc-800 flex flex-col items-center justify-center shadow-xl">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans">
            {pad(timeLeft.seconds)}
          </span>
          <span className="text-[9.5px] sm:text-[11px] font-extrabold tracking-[0.2em] text-zinc-400 uppercase mt-2.5">
            SEGUNDOS
          </span>
        </div>
      </div>

      {/* Date detail text */}
      <p className="mt-7 text-xs sm:text-sm text-zinc-400 font-normal">
        {formattedDate}
      </p>

      {/* Red POSTULA AHORA Button */}
      <div className="mt-7">
        <button
          type="button"
          onClick={onApply}
          disabled={!isConvocatoriaActive}
          className={`px-12 sm:px-16 py-4 text-xs sm:text-sm font-extrabold tracking-widest text-white uppercase rounded-none transition-all shadow-xl ${
            isConvocatoriaActive
              ? "bg-[#ED1C24] hover:bg-red-600 hover:scale-[1.02] active:scale-95 shadow-red-600/30 cursor-pointer"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
        >
          {isConvocatoriaActive ? "POSTULA AHORA" : "CONVOCATORIA CERRADA"}
        </button>
      </div>
    </div>
  );
}
