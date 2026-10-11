# Plan de trabajo — Home | SupplyMentum UNI

**Sección:** Home
**Integrantes:** Renato · Camila
**Rama base:** `main`
**Ramas de trabajo:** `feature/home-renato` · `feature/home-camila`
**Regla:** ningún merge a `main` hasta que Navbar y Footer (Renato) estén mergeados. Todo PR necesita al menos 1 aprobación.

Referencia: ya existe un prototipo estático (`index.html`, `site.css`, `site.js`, `cube.js`, `data.js`) que sirve de base visual/funcional para migrar a Next.js + React + TypeScript.

---

## Fase 1 — Hero Section + cubo 3D animado (RF-01)
**Responsable: Renato**

- [ ] Migrar el layout del Hero (`header.hero`) a componente React: título con "UNI" en bold y color de marca, tagline, botones "Postula ahora" / "Explora las áreas".
- [ ] Portar la lógica de `cube.js` (Three.js) a un componente `<Cube3D />`: marco cúbico blanco exterior + marco rojo interior anidado, rotación antihoraria continua, respuesta sutil al puntero.
- [ ] Manejar el fallback: si WebGL no carga, mostrar `cubo.png` (ya contemplado en el prototipo).
- [ ] Implementar el fondo con degradado + glows (`hero-glow`) y el fondo de red animada (`initNetwork` de `site.js`) como componente aparte, reutilizable en toda la Home.
- [ ] Respetar `prefers-reduced-motion` (ya resuelto en el prototipo, portar el criterio).
- [ ] Responsive: verificar que el cubo y el texto se reordenen en mobile.

---

## Fase 2 — Descripción general + fotos representativas (RF-02)
**Responsable: Camila**

- [ ] Migrar la sección "¿Qué es SupplyMentum UNI?" (`wrap split`): texto + imagen representativa, botón "Conócenos →".
- [ ] Conectar la imagen a los assets reales del centro (reemplazar placeholders de picsum).
- [ ] Migrar el bloque de "Nuestros rubros" (Planeamiento, Abastecimiento, Producción, Distribución) como secuencia numerada 01–04.
- [ ] Animación de entrada tipo `reveal` al hacer scroll (`initReveal` del prototipo) como hook reutilizable (`useReveal` o `IntersectionObserver` en componente).

---

## Fase 3 — Sección de métricas (RF-03)
**Responsable: Renato**

- [ ] Migrar `section.metrics` con los 4 indicadores: miembros activos, eventos realizados, proyectos ejecutados, empresas aliadas.
- [ ] Portar la animación de conteo (`initCounters`) como hook, activado por `IntersectionObserver` cuando la sección entra en viewport.
- [ ] Dejar los valores (`data-count`) conectados a una fuente de datos (props o fetch), no hardcodeados, para que se puedan actualizar sin tocar el componente.

---

## Fase 4 — Carrusel de novedades (RF-04)
**Responsable: Camila**

- [ ] Migrar el `rail#novedades` con las cards de eventos/talleres recientes (tag, imagen, título, descripción, fecha).
- [ ] Portar la lógica de autoscroll infinito (`initAutoRails`): duplicado de contenido, pausa en hover/focus/drag, reinicio de bucle.
- [ ] Conectar el listado al array `SM.novedades` (o su equivalente tipado en TS) en vez de datos estáticos en el componente.
- [ ] Botón "Ver eventos →" enlazando a la sección/página de Eventos.

---

## Fase 5 — Sección animada de especializaciones/ramas (RF-05)
**Responsable: Renato**

- [ ] Diseñar y construir el bloque de especializaciones del centro con el logo de SupplyMentum animado como disparador (cada cierto tiempo/interacción muestra una especialización + descripción).
- [ ] Definir transición entre especializaciones (fade/slide) reutilizando el patrón `is-out` / `is-in` del prototipo (visto en `areas.html` para el panel de área).
- [ ] Asegurar accesibilidad: versión sin animación para `prefers-reduced-motion`, navegación por teclado si hay controles manuales.

> Nota: esta sección **no existe todavía en el prototipo HTML**; hay que construirla desde cero siguiendo el criterio visual del resto de la Home (mismas variables de `site.css`: tipografía Archivo/Open Sans, paleta rojo/negro/blanco del brandbook).

---

## Fase 6 — Motivos para unirse + botón "Postula aquí" (RF-06)
**Responsable: Camila**

- [ ] Migrar la sección "¿Por qué unirte?" (`grid#beneficios`) con las tarjetas de beneficios.
- [ ] Conectar al array `SM.beneficios`.
- [ ] Botón principal "Postula aquí" enlazando a Convocatoria.
- [ ] (Opcional/potencial) Espacio reservado para mascota ilustrada, a definir con diseño.

---

## Fase 7 — Cards de navegación a otras secciones (RF-07)
**Responsable: Renato**

- [ ] Migrar el bloque "Explora" (`grid grid-4`): cards hacia Conócenos, Áreas, Proyectos, Eventos, numeradas 01–04.
- [ ] Cada card enlaza a su página/sección correspondiente con hover consistente con el resto del sitio (`.card`).
- [ ] Verificar que el `aria-current="page"` y el resaltado de navegación (`initNav`) sigan funcionando al integrar con el router de Next.js.

---

## Checklist de integración final (ambos)

- [ ] Confirmar que Navbar y Footer de Renato ya están mergeados en `main` antes de abrir PR de Home.
- [ ] Revisar consistencia visual entre las fases de Renato y Camila (espaciados, tipografía, paleta del Brandbook).
- [ ] Probar la Home completa en mobile, tablet y desktop.
- [ ] Verificar performance del cubo 3D y el fondo de red (no deben bajar el frame rate en dispositivos de gama media).
- [ ] Abrir PR único de `feature/home-renato` y `feature/home-camila` hacia `main` (o PRs separados, según se acuerde), con al menos 1 revisión aprobada.
- [ ] Documentar en `docs/home/IMPLEMENTATIONS-home.md` las decisiones técnicas tomadas.
