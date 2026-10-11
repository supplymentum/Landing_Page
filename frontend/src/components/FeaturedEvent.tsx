import React from 'react';
import { Event } from '../types/event';
import { FALLBACK_EVENT_IMAGE } from '@/lib/api/events';
import Link from 'next/link';

interface FeaturedEventProps {
  event: Event;
}

export default function FeaturedEvent({ event }: FeaturedEventProps) {
  return (
    <div className="flex flex-col md:flex-row w-full bg-[#131316] border border-[#26262A] rounded-sm overflow-hidden mb-12 shadow-2xl">
      {/* Texto - Lado Izquierdo */}
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
        
        {/* Etiqueta y Fecha */}
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-[#ED1C24] text-white text-xs font-bold px-3 py-1 tracking-wider uppercase">
            {event.status}
          </span>
          <span className="text-[#ED1C24] font-semibold text-sm tracking-wide">
            {event.date}
          </span>
        </div>

        {/* Título y Descripción */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          {event.title}
        </h2>
        <p className="text-gray-400 text-base md:text-lg mb-8 max-w-2xl">
          {event.description}
        </p>

        {/* Iconos (Ubicación y Hora) */}
        <div className="flex items-center gap-6 text-gray-300 text-sm mb-8 font-medium">
          {event.location && (
            <div className="flex items-center gap-2">
              <span className="text-[#ED1C24]">📍</span>
              <span>{event.location}</span>
            </div>
          )}
          {event.time && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">🕒</span>
              <span>{event.time}</span>
            </div>
          )}
        </div>

        {/* Botón Inscríbete */}
        {event.registrationLink && (
          <div>
            <Link 
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#ED1C24] hover:bg-red-700 transition-colors text-white font-bold py-3 px-8 rounded-sm inline-block uppercase tracking-wide text-sm"
            >
              Inscríbete
            </Link>
          </div>
        )}
      </div>

      {/* Imagen - Lado Derecho */}
      <div className="w-full md:w-[45%] relative min-h-[380px] border-l border-[#26262A]">
        <img 
          src={event.imageUrl || FALLBACK_EVENT_IMAGE} 
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(146,2,7,0.3)] to-[rgba(11,11,12,0.2)]"></div>
      </div>
    </div>
  );
}
