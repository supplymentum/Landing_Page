'use client';

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import FeaturedEvent from "@/components/FeaturedEvent";
import EventCard from "@/components/EventCard";
import SearchAndFilters, {
  FilterType,
} from "@/components/SearchAndFilters";

import { getPublicEvents, toDisplayEvent } from "@/lib/api/events";
import type { Event } from "@/types/event";

import SmoothScroll from "@/components/ui/SmoothScroll";
import ConstellationBackground from "@/components/convocatoria/ConstellationBackground";
import FaqAccordion from "@/components/FaqAccordion";

export default function EventosPage() {
  const [filter, setFilter] = useState<FilterType>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getPublicEvents()
      .then((data) => {
        if (!cancelled) setEvents(data.map(toDisplayEvent));
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los eventos.",
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

  // 1. Obtener el evento destacado (El más importante que es Próximo)
  // Asumimos que es el primer elemento de la lista
  const featuredEvent = events[0];

  // Usamos todos los eventos para la grilla inferior (sin excluir el destacado)
  const remainingEvents = events;

  // 2. Filtrar por Estado (Botones)
  let filteredEvents = remainingEvents;
  if (filter !== 'TODOS') {
    filteredEvents = remainingEvents.filter(e => e.status === filter);
  }

  // 3. Filtrar por Búsqueda (Texto)
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filteredEvents = filteredEvents.filter(
      e => e.title.toLowerCase().includes(query) || e.description.toLowerCase().includes(query)
    );
  }

  // 4. Lógica de Ordenamiento Avanzada
  const parseDate = (dateStr: string) => {
    const months: Record<string, number> = {
      'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'MAY': 4, 'JUN': 5,
      'JUL': 6, 'AGO': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11
    };
    const parts = dateStr.split(' ');
    if (parts.length !== 3) return 0;
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day).getTime();
  };

  filteredEvents.sort((a, b) => {
    // 1. Si tienen estados diferentes, los PRÓXIMOS siempre van primero
    if (a.status !== b.status) {
      return a.status === 'PRÓXIMO' ? -1 : 1;
    }

    // 2. Si tienen el mismo estado, aplicamos orden por fecha
    const timeA = parseDate(a.date);
    const timeB = parseDate(b.date);

    if (a.status === 'PRÓXIMO') {
      // Los próximos se ordenan ascendente (del más cercano a ocurrir al más lejano)
      return timeA - timeB;
    } else {
      // Los pasados se ordenan descendente (del más reciente que acaba de pasar al más antiguo)
      return timeB - timeA;
    }
  });

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F4F2] pt-[90px] pb-[120px] px-4 md:px-[72px] relative overflow-hidden font-sans">
      <SmoothScroll />

      {/* Fondo de constelación (mismo efecto que Home y Convocatoria) */}
      <ConstellationBackground />

      {/* Resplandor rojo extraído del HTML original */}
      <div className="absolute right-[-160px] top-[-160px] w-[560px] h-[560px] pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(237,28,36,.16) 0%, transparent 65%)' }}></div>

      <div className="w-full mx-auto relative z-10">

        {/* Header */}
        <h4 className="text-[#ED1C24] text-xs font-bold tracking-[0.25em] mb-6 uppercase">
          Próximo Evento
        </h4>

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm py-12">
            <Loader2 size={16} className="animate-spin" />
            Cargando eventos...
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-400 py-12 bg-[#151515] rounded-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* 1. Evento Destacado (Solo lo mostramos en vista por defecto) */}
            {filter === 'TODOS' && searchQuery === '' && featuredEvent && (
              <FeaturedEvent event={featuredEvent} />
            )}

            {/* Título de Grilla */}
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 mt-20 text-white">
              Todos nuestros eventos
            </h2>

            {/* 2. Filtros y Buscador */}
            <SearchAndFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* 3. Grilla Dinámica */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12 bg-[#151515] rounded-sm">
                No se encontraron eventos para esta categoría o búsqueda.
              </div>
            )}
          </>
        )}

        {/* 4. Sección de Preguntas Frecuentes */}
        <div className="mt-20">
          <FaqAccordion />
        </div>

      </div>
    </div>
  );
}
