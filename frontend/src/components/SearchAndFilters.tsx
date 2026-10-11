'use client';

import React from 'react';

export type FilterType = 'TODOS' | 'PRÓXIMO' | 'PASADO';

interface SearchAndFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchAndFilters({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange
}: SearchAndFiltersProps) {
  
  const buttons: { label: string, value: FilterType }[] = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Próximos', value: 'PRÓXIMO' },
    { label: 'Realizados', value: 'PASADO' },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-start items-center gap-6 mb-12">
      {/* Barra de Búsqueda */}
      <div className="w-full md:w-80 relative">
        <input 
          type="text"
          placeholder="Buscar evento..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#111111] text-white border border-[#222222] rounded-sm py-3 px-4 pl-10 focus:outline-none focus:border-[#ED1C24] placeholder-gray-500 text-sm"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          🔍
        </span>
      </div>

      {/* Botones de Filtro */}
      <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        {buttons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => onFilterChange(btn.value)}
            className={`px-6 py-2.5 rounded-sm font-medium transition-colors whitespace-nowrap text-sm ${
              currentFilter === btn.value 
                ? 'bg-[#ED1C24] text-white border border-[#ED1C24]' 
                : 'bg-transparent text-gray-400 border border-[#222222] hover:bg-[#111111] hover:text-white'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
