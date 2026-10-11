'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { type Faq, getFaqs } from '@/lib/api/faq';


export default function FaqAccordion() {
  // Estado para rastrear qué pregunta está expandida
  // Si es null, todas están colapsadas.
  const [openId, setOpenId] = useState<number | null>(null);

  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getFaqs()
      .then((data) => {
        if (!cancelled) setFaqs(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudieron cargar las preguntas frecuentes.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full relative z-10">
      {/* Encabezado de sección, con el mismo patrón que Convocatoria */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-0.5 bg-[#ED1C24]" />
        <span className="text-xs font-extrabold tracking-widest text-[#ED1C24] uppercase">
          Preguntas Frecuentes
        </span>
      </div>

      <div className="max-w-3xl mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
          Resolvemos tus dudas
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base font-normal">
          Lo que más nos preguntan sobre los eventos y la vida en SupplyMentum.
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-zinc-500 text-sm py-8">
          <Loader2 size={16} className="animate-spin" />
          Cargando preguntas frecuentes...
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-400 py-8">{error}</p>
      )}

      {!loading && !error && faqs.length === 0 && (
        <p className="text-sm text-zinc-500 py-8">
          Aún no hay preguntas frecuentes publicadas.
        </p>
      )}

      {/* Grilla de tarjetas desplegables */}
      {!loading && !error && faqs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {faqs.map((faq) => {
            const isOpen = openId === faq.faq_id;

            return (
              <div
                key={faq.faq_id}
                className={`group relative bg-[#121216] border p-7 transition-all duration-300 ${
                  isOpen
                    ? 'border-[#ED1C24]/40 shadow-2xl shadow-red-950/20'
                    : 'border-zinc-800/80 hover:border-zinc-700 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-red-950/20'
                }`}
              >
                {/* Pregunta */}
                <button
                  onClick={() => toggleFaq(faq.faq_id)}
                  className="w-full flex items-start justify-between gap-4 text-left focus:outline-none select-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <h3
                    className={`text-base sm:text-lg font-black leading-snug transition-colors ${
                      isOpen
                        ? 'text-[#ED1C24]'
                        : 'text-white group-hover:text-[#ED1C24]'
                    }`}
                  >
                    {faq.pregunta}
                  </h3>

                  <span className="shrink-0 mt-0.5">
                    <span className="w-8 h-8 border border-zinc-700/60 flex items-center justify-center bg-[#0A0A0C] group-hover:border-zinc-500 transition-colors">
                      <ChevronDown
                        size={16}
                        className={`text-zinc-400 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#ED1C24]' : ''
                        }`}
                      />
                    </span>
                  </span>
                </button>

                {/* Respuesta */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100 mt-5'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-5 border-t border-zinc-800/60 text-zinc-400 text-sm leading-relaxed">
                      {faq.respuesta}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
