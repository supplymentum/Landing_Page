# Plan de trabajo — Proyectos | SupplyMentum UNI

**Sección:** Proyectos
**Integrantes:** Mori · Leonel
**Rama base:** `main`
**Ramas de trabajo:** `feature/proyectos-mori` · `feature/proyectos-leonel`
**Regla:** Todo PR necesita al menos 1 aprobación.

Referencia: Contamos con los archivos de prototipo estático `proyectos.html` y `proyecto.html` como base visual/funcional.

---

## Fase 1 — Hero Section + Banda Transportadora (RF-12)
**Responsable: Mori**

- [x] Migrar el diseño de cabecera (Hero Header) con el título destacado "PROYECTOS" y subtítulo de introducción en [page.tsx](file:///d:/Carpeta_de_clases_2023-2025/SUPPLYMENTUM%20UNI%20-%20Landing/SupplyMentum-Landing-Page/frontend/src/app/proyectos/page.tsx).
- [x] Crear el componente de tarjeta de proyecto individual [ProyectoCard.tsx](file:///d:/Carpeta_de_clases_2023-2025/SUPPLYMENTUM%20UNI%20-%20Landing/SupplyMentum-Landing-Page/frontend/src/components/proyectos/ProyectoCard.tsx) con soporte para categorías (TECNOLOGÍA, MARKETING, TALENTO, CONSULTORÍA, OPERACIONES, CORPORATIVAS).
- [x] Implementar la cinta transportadora animada [BandaTransportadora.tsx](file:///d:/Carpeta_de_clases_2023-2025/SUPPLYMENTUM%20UNI%20-%20Landing/SupplyMentum-Landing-Page/frontend/src/components/proyectos/BandaTransportadora.tsx) con autoscroll infinito y pausado al hacer hover/drag.
- [ ] Optimizar el loop de animación (`requestAnimationFrame`) para evitar fugas de memoria o caídas de FPS.
- [ ] Asegurar responsividad completa en la banda transportadora y cards.

---

## Fase 2 — Catálogo de Proyectos en Racks / Almacén (RF-13)
**Responsable: Leonel**

- [ ] Crear el componente `<ProyectosRacks />` para simular la visualización en formato de estantería o racks.
- [ ] Diseñar el layout de los racks para que se visualicen adecuadamente en pantallas mobile, tablet and desktop (grilla adaptable).
- [ ] Implementar la barra de búsqueda por texto en tiempo real para buscar por nombre o descripción del proyecto.
- [ ] Implementar los botones de selección rápida (chips de área) para filtrar por categorías (`Todos`, `Operaciones`, `Marketing`, `Talento`, `Corporativas`, `Consultoría`, `Tecnología`).
- [ ] Implementar el control de paginación (`Anterior`, `Siguiente`, indicador de páginas) limitado a 6 elementos por página.
- [ ] Diseñar el estado vacío cuando la búsqueda o filtros no devuelvan resultados.

---

## Fase 3 — Detalle de Proyecto en Pop-up / Modal (RF-14.1)
**Responsable: Mori**

- [ ] Implementar el componente `<ProyectoModal />` para mostrar la información del proyecto cuando se hace clic en cualquier tarjeta del catálogo o la cinta.
- [ ] Maquetar el contenido del modal:
  * Imagen de portada del proyecto.
  * Badge del área/categoría y año de ejecución.
  * Título y descripción detallada del proyecto.
  * Grilla de **Participantes** con su respectivo rol.
  * **Galería del proyecto** (carrusel o rejilla de imágenes complementarias).
- [ ] Agregar el llamado a la acción (CTA) inferior en el modal: "¿Quieres liderar el próximo?" con un botón hacia Convocatorias.
- [ ] Asegurar soporte de accesibilidad (cerrar modal con tecla Escape, trampar el foco de teclado, accesibilidad de lectores de pantalla).

---

## Fase 4 — Integración de Datos Reales
**Responsable: Ambos**

- [ ] Crear el archivo de datos JSON centralizado en `frontend/src/data/proyectos.json` migrando la información de `SM.proyectos` del prototipo.
- [ ] Configurar las rutas de imágenes en Next.js (colocándolas en la carpeta `public/images/`).
- [ ] Conectar `<BandaTransportadora />` y `<ProyectosRacks />` para que lean dinámicamente de este archivo JSON centralizado en lugar de datos quemados en los componentes.

---

## Checklist de integración final (ambos)

- [ ] Validar compatibilidad y rendimiento en dispositivos móviles de gama media.
- [ ] Ejecutar linting (`npm run lint`) y typecheck (`npx tsc --noEmit`) antes de integrar.
- [ ] Verificar que no existan advertencias de hidratación de React.
- [ ] Documentar decisiones finales en sus respectivas implementaciones.
