# Implementaciones — Mori

Documentación técnica de las decisiones y avances tomados al migrar las secciones asignadas a Mori del prototipo estático a Next.js + React + TypeScript.

---

## Fase 1 — Hero Section + Banda Transportadora (RF-12)

**Estado: En progreso (componentes base construidos).**

### Archivos creados

* [ProyectoCard.tsx](file:///d:/Carpeta_de_clases_2023-2025/SUPPLYMENTUM%20UNI%20-%20Landing/SupplyMentum-Landing-Page/frontend/src/components/proyectos/ProyectoCard.tsx): Tarjeta de presentación individual para cada proyecto.
  * Diseñado con un tamaño fijo para integrarse correctamente con la banda.
  * Incluye efectos de escala al hacer hover, sombreado con resplandor rojo de marca (`rgba(237,28,36,0.1)`) y bordes de acento.
  * Soporta categorías tipadas: `TECNOLOGÍA`, `MARKETING`, `TALENTO`, `CONSULTORÍA`.
* [BandaTransportadora.tsx](file:///d:/Carpeta_de_clases_2023-2025/SUPPLYMENTUM%20UNI%20-%20Landing/SupplyMentum-Landing-Page/frontend/src/components/proyectos/BandaTransportadora.tsx): Carrusel o cinta transportadora animada de proyectos destacados.
  * Implementa lógica de desplazamiento infinito (auto-scroll) mediante un bucle de `requestAnimationFrame`.
  * Duplica el listado original de datos 3 veces para evitar vacíos visuales al hacer scroll hacia adelante o atrás.
  * Implementa scroll interactivo arrastrando con el ratón (drag-to-scroll) para ordenadores de escritorio y pausa automática en hover.

### Archivos modificados

* [page.tsx](file:///d:/Carpeta_de_clases_2023-2025/SUPPLYMENTUM%20UNI%20-%20Landing/SupplyMentum-Landing-Page/frontend/src/app/proyectos/page.tsx): Monta la estructura de la página de proyectos.
  * Agrega el fondo de constelación interactiva `<ConstellationBackground />`.
  * Define la cabecera (Hero Header) en mayúsculas ("PROYECTOS") con tipografía de marca (`Archivo Black`) y el gradiente radial rojo de fondo.
  * Integra la sección destacados cargando la `<BandaTransportadora />`.

---

## Decisiones técnicas

1. **Loop sin fin mediante replicación:** Para lograr una transición imperceptible y fluida en la banda transportadora, se multiplica el array de datos por 3. Cuando el scroll llega a dos tercios del ancho total (`oneSetWidth * 2`), el scroll se resetea sutilmente a un tercio sin que el usuario lo note visualmente.
2. **Pausa al interactuar:** La animación automática se pausa dinámicamente cuando el puntero hace hover sobre el carrusel o cuando se inicia un evento táctil o de arrastre (drag).
3. **Limpieza en useEffect:** Se agregaron controladores de eventos en el desmontaje del hook para prevenir fugas de memoria, cancelando el frame actual con `cancelAnimationFrame` y eliminando listeners del documento (`visibilitychange`).
