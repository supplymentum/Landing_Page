# Implementaciones — Leonel

Documentación técnica de las decisiones y avances tomados al migrar las secciones asignadas a Leonel del prototipo estático a Next.js + React + TypeScript.

---

## Fase 2 — Catálogo de Proyectos en Racks / Almacén (RF-13)

**Estado: Completado.**

### Archivos creados / modificados

* `frontend/src/data/proyectos.ts` — Módulo TypeScript centralizado con la interfaz `ProyectoData` y el arreglo de 12 proyectos migrados desde `data.js`, compartido entre la `BandaTransportadora` y el catálogo `ProyectosRacks`.
* `frontend/src/components/proyectos/RackCard.tsx` — Componente individual modular que representa cada tarjeta/caja dentro de la estantería del rack (badge de área, imagen, título, descripción y año).
* `frontend/src/components/proyectos/ProyectosRacks.tsx` — Client Component del catálogo completo de proyectos. Implementa la estantería visual (líneas de rack), buscador por texto en tiempo real, chips de filtro por área, paginación (6 por página) y estado vacío.
* `frontend/src/app/proyectos/page.tsx` — Integración de `<ProyectosRacks />` en la página principal del catálogo de proyectos.
* `docs/proyectos/assets/` — Carpeta con las imágenes de documentación asignadas a los proyectos (`warehouse.png`, `iot.png`, `marketing.png`, `talent.png`).

### Decisiones técnicas y diseño

1. **Diseño de Racks (Estanterías de Almacén):** Se implementó una estructura visual emulando vigas y soportes industriales (líneas con degradados rojos `rgba(237,28,36,...)`) con la grilla de tarjetas superpuesta.
2. **Arquitectura Componentizada:** Se separó la lógica en dos componentes independientes: `ProyectosRacks` como contenedor de estado/filtros/paginación y `RackCard` como elemento reutilizable.
3. **Filtros e Interactividad:** 
   - Los chips de área cuentan con un efecto hover de borde rojo iluminado (`border-[#ED1C24]/60`) manteniendo la coherencia del sistema de diseño.
   - Botones de paginación (*Anterior* / *Siguiente*) adaptados con el efecto hover de elevación y cambio de color a rojo (`hover:-translate-y-0.5 hover:border-[#ED1C24] hover:text-[#ED1C24]`), heredado de la landing de inicio.
4. **Espaciado y Grid:** Ajuste de márgenes (`gap-8` y `px-8` en desktop) para lograr suficiente espacio de respiración entre las tarjetas y la estructura del rack.
