# Implementación de la Sección de Áreas

Este documento resume los cambios arquitectónicos y de estilo implementados para la sección de áreas del proyecto SupplyMentum, garantizando una fidelidad total con el diseño original (HTML + CSS Vanilla).

## Estructura de Componentes

Se adoptó una estructura basada en componentes de cliente/servidor para maximizar el rendimiento y la capacidad de SSR/SSG de Next.js:

1.  **`src/app/areas/page.tsx`**: Server component encargado del layout principal de la vista de áreas.
2.  **`src/components/areas/AreasSection.tsx`**: Client component que contiene la lógica interactiva de la "rueda orbital" (wheel) para seleccionar áreas y renderiza la vista 3D.
3.  **`src/app/areas/[id]/page.tsx`**: Server component dinámico que genera las páginas de detalle de cada área en base a la información extraída de `areasData.ts`.
4.  **`src/components/areas/AreaCTA.tsx`**: Componente reutilizable para el Call-To-Action.
5.  **`src/components/home/Cube3D.tsx`**: Componente de Three.js / React Three Fiber central que se incrustó en el medio de la rueda interactiva de áreas.

## Integración del Diseño (Fidelidad HTML/CSS)

Para asegurar la fidelidad al 100% con los archivos `template/areas.html` y `template/area.html`:

-   **Componente Interactivo**: La matemática elíptica de la rueda de selección (radios X/Y) y el sistema de rotación continuo e interactivo fue adaptado de JavaScript Vanilla a React hooks (`useRef`, `useCallback`, `requestAnimationFrame`). Se conservaron todas las funciones que otorgan inercia y arrastre (dragging).
-   **CSS de la Rueda Orbital**: Debido a que los estilos para animar los nodos (`.wheel`, `.wheel-track`, `.node`, etc.) requerían propiedades CSS avanzadas, fueron extraídos de `site.css` y migrados directamente al archivo global de Tailwind `globals.css` en la aplicación de Next.js.
-   **Páginas de Detalle**: En `app/areas/[id]/page.tsx`, la maquetación se reconstruyó utilizando clases de utilidad de Tailwind pero conservando de forma estricta los valores de marca (`#ED1C24`, `#FFBD59`) y las variables tipográficas CSS (`var(--font-archivo-black)`, `var(--font-open-sans)`).

## Optimizaciones de Layout y Rendimiento (Refinamientos)

- **Layout Global (`.wrap`)**: Se reintrodujo la clase `.wrap` en `globals.css` (con un `max-width` global) para forzar un centrado simétrico en todas las secciones, eliminando los márgenes asimétricos y optimizando el espaciado en la página de detalle (`[id]/page.tsx`). 
- **Proporciones de Retratos**: Se ajustaron las tarjetas de liderazgo de las áreas a `aspect-square` y se limitó el ancho (`max-w-[680px]`) para asegurar que las fotos de los directores respeten las dimensiones verticales sin perder nitidez, con interacciones visuales (grayscale/brightness) replicadas de la maqueta original.
- **Performance a 60fps (Rueda Orbital)**: Se reescribió la lógica de la animación de `AreasSection.tsx` para evitar cuellos de botella del ciclo de vida de React (`setState`). Ahora, `requestAnimationFrame` actualiza directamente el DOM a través de referencias (`useRef`), lo cual soluciona los problemas de latencia (saltos) permitiendo manipular los 360 grados sin problemas.
- **Navegación Interactiva Mejorada**: Se añadió un sistema de "Shortest Path" o "Camino Más Corto". Ahora se puede hacer clic directamente en cualquier nodo del sistema orbital para que la rueda trace el ángulo más óptimo sin necesidad de usar las flechas. Además, el panel de detalles ahora respeta los micro-retrasos y las transiciones asíncronas de desvanecimiento ("fade out / in") para el cambio de área.

## Datos de las Áreas

El archivo `data/areasData.ts` ahora actúa como "Single Source of Truth", consolidando:

-   Paths SVG extraídos del `data.js` del template original.
-   Toda la información del área (descripción corta, listas "Qué realizamos" y "Qué buscamos").
-   Detalle de los directores/líderes (fotos e hipervínculos).
-   Las imágenes hero para las páginas de detalle.

El frontend fue adaptado exitosamente del diseño estático al framework de React, respetando los guidelines de la marca.
