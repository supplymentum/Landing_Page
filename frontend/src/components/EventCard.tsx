import React from 'react';
import { Event } from '../types/event';
import { FALLBACK_EVENT_IMAGE } from '@/lib/api/events';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const isProximo = event.status === 'PRÓXIMO';
  const badgeColor = isProximo ? 'bg-[#ED1C24]' : 'bg-[#2A2A2A] text-gray-400';
  const dateColor = isProximo ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="bg-[#131316] rounded-sm overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300 border border-[#26262A] hover:border-[#ED1C24]">
      
      {/* Imagen Top */}
      <div className="h-[170px] w-full relative overflow-hidden border-b border-[#26262A]">
        <img 
          src={event.imageUrl || FALLBACK_EVENT_IMAGE} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 saturate-50 group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] to-transparent opacity-60"></div>
      </div>

      {/* Contenido Inferior */}
      <div className="p-6 flex flex-col flex-1">
        
        {/* Etiqueta y Fecha */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`${badgeColor} text-xs font-bold px-2 py-1 uppercase tracking-wider ${isProximo ? 'text-white' : ''}`}>
            {event.status}
          </span>
          <span className={`${dateColor} font-semibold text-xs tracking-wide`}>
            {event.date}
          </span>
        </div>

        {/* Título y Descripción */}
        <h3 className="text-xl font-bold text-white mb-2 leading-snug">
          {event.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-3">
          {event.description}
        </p>
      </div>
    </div>
  );
}
