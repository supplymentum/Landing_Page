# Implementaciones — Renato

Documentación técnica de las decisiones tomadas al migrar las secciones asignadas a Renato
(`PLAN-DE-TRABAJO-home.md`) del prototipo estático (`template/`) a Next.js + React + TypeScript
(`frontend/`).

---

## Fase 1 — Hero Section + cubo 3D animado (RF-01)

**Estado: completada.**

### Archivos creados

- `frontend/src/components/home/Hero.tsx` — Server Component. Layout del hero (`header.hero`
  del prototipo): eyebrow, `h1` con el acento en rojo de marca, lede, botones CTA y el bloque
  "Convocatoria 2026-II abierta". Usa CSS Grid de dos columnas en desktop
  (`lg:grid-cols-[1.05fr_.95fr]`) que colapsa a una columna en mobile.
- `frontend/src/components/home/Cube3D.tsx` — Client Component (`"use client"`). Isotipo 3D
  (dos marcos cúbicos anidados, blanco y rojo) portado 1:1 de `template/assets/js/cube.js`,
  usando `three` como dependencia npm (`import * as THREE from "three"`) en vez de cargarlo
  por CDN — el prototipo usaba `import()` dinámico desde `unpkg` porque el HTML se abre por
  `file://`; en Next.js eso no aplica, así que se resuelve como paquete normal y se bundlea.
- `frontend/src/components/home/NetworkBackground.tsx` — Client Component. Fondo de red
  animada (nodos + "envíos") portado de `initNetwork()` en `template/assets/js/site.js`.
  Pensado para reutilizarse en el resto de la Home (no solo el hero): se monta una sola vez
  en `page.tsx` como capa `fixed inset-0` detrás de todo el contenido.

### Archivos modificados

- `frontend/src/app/page.tsx` — monta `<NetworkBackground />` y `<Hero />`.
- `frontend/src/app/layout.tsx` — se agregaron las tipografías del Brandbook 1.0 vía
  `next/font/google`: `Archivo_Black` (display), `Archivo` (subtítulos/botones/eyebrow, pesos
  500–800) y `Open_Sans` (cuerpo, pesos 300–700), expuestas como variables CSS
  (`--font-archivo-black`, `--font-archivo`, `--font-open-sans`) y aplicadas puntualmente en
  `Hero.tsx` vía `font-[family-name:var(--font-*)]`. La fuente global del sitio (Geist, usada
  por `Header`/`Footer`) no se tocó — así no hay riesgo de romper el resto de la Home que
  construye Camila.
- `frontend/src/app/globals.css` — se agregó el `@keyframes float` que usa el fallback en PNG
  del cubo (equivalente a `@keyframes floatY` del prototipo).
- `frontend/public/cubo.png` — copiado desde `template/assets/cubo.png` (no existía ningún
  asset del centro en `frontend/public`).

### Decisiones técnicas

1. **Fallback WebGL → PNG.** `Cube3D` intenta crear el `THREE.WebGLRenderer`; si falla
   (try/catch, igual que el original), el `<canvas>` queda vacío y el `<img>` de respaldo
   (`fallbackSrc`) sigue visible porque el estado `mounted3d` nunca pasa a `true`. Si el
   render 3D sí se monta, el PNG se oculta (`hidden`) — equivalente a la clase `.is-3d` del
   prototipo que ocultaba `.cube-fallback` por CSS.
2. **`prefers-reduced-motion`.** Igual que el original: si el usuario prefiere movimiento
   reducido, `Cube3D` monta el renderer y pinta **un solo frame estático** (sin loop de
   animación ni listener de `pointermove`); `NetworkBackground` directamente no monta el
   canvas (`return` temprano en el `useEffect`, además de `motion-reduce:hidden` como
   refuerzo CSS). No se depende solo de CSS porque ambos son animaciones por
   `requestAnimationFrame`, que `prefers-reduced-motion` de CSS no puede frenar por sí solo.
3. **`setState` dentro de `useEffect`.** El linter de React (`react-hooks/set-state-in-effect`)
   marcó como error llamar `setMounted3d(true)` de forma síncrona dentro del efecto que monta
   Three.js. Se difirió con `queueMicrotask(() => setMounted3d(true))` para evitar el
   cascading render, sin introducir un delay perceptible.
4. **Responsive.** En mobile (`<lg`) el cubo se reordena arriba del texto con
   `order-1`/`order-2` (Tailwind), igual que `.hero-stage{ order:-1 }` en el prototipo.
5. **Limpieza de recursos.** A diferencia del script original (que vive toda la vida de la
   página), `Cube3D` y `NetworkBackground` corren dentro de componentes React que se pueden
   desmontar (ej. navegación SPA), así que se agregó cleanup explícito en el `return` del
   `useEffect`: `cancelAnimationFrame`, `clearInterval`, `resizeObserver.disconnect()`,
   remoción de listeners y `renderer.dispose()` — nada de esto existía en el prototipo porque
   no lo necesitaba (recarga completa de página entre secciones).
6. **Colores de marca inline.** Se usaron los hex del Brandbook directamente en clases
   arbitrarias de Tailwind (`#ED1C24`, `#E13526`, etc.) en vez de crear tokens Tailwind nuevos,
   siguiendo el mismo patrón que ya usan `Header.tsx` y `Footer.tsx` (no hay `tailwind.config`
   con paleta custom en este proyecto, Tailwind v4 usa `@import "tailwindcss"` directo).

### Verificación

- `npm run lint` — sin errores (solo warnings preexistentes en `ApplicationForm.tsx`, de la
  Fase de Camila, sin relación con este cambio).
- `npx tsc --noEmit` — sin errores de tipos.
- `npm run build` — build de producción exitoso.
- Verificación visual con Playwright headless en `/` a 1440×900 (desktop) y 390×844 (mobile):
  cubo 3D renderiza y gira, fondo de red visible detrás del contenido, CTAs y reordenamiento
  mobile correctos, sin errores de consola.

### Pendiente / fuera de alcance de esta fase

- Los assets de imagen (`logo.png`, resto de fotos) se migrarán cuando corresponda a cada
  sección que los use.

---

## Fase 3 — Sección de métricas (RF-03)

**Estado: en progreso, tarea por tarea.**

### Tarea 1 — Migrar `section.metrics` con los 4 indicadores

**Estado: completada.**

#### Archivos creados

- `frontend/src/components/home/MetricsSection.tsx` — Server Component. Portado de
  `section.metrics` / `.metrics-grid` del prototipo: franja roja de ancho completo con los 4
  indicadores (miembros activos, eventos realizados, proyectos ejecutados, empresas aliadas)
  en grid (`grid-cols-2` en mobile, `grid-cols-4` en desktop), con separador vertical entre
  columnas replicando `.metric + .metric::before` del CSS original.
- Valores (`METRICS`) **hardcodeados por ahora** — esto es intencional: la tarea 1 solo migra
  el layout estático. Quedar conectados a una fuente de datos externa (props/fetch) es la
  tarea 3 de esta fase, y el conteo animado (`initCounters`) es la tarea 2. No se adelantó
  ninguna de las dos para mantener el alcance de esta tarea acotado.

#### Archivos modificados

- `frontend/src/app/page.tsx` — se monta `<MetricsSection />` después de `<Hero />`.

#### Decisiones técnicas

1. **Sin JS todavía.** Al no tener aún el conteo animado, el componente es un Server
   Component puro (sin `"use client"`), consistente con la regla del proyecto de mantener
   los Client Components acotados a donde realmente se necesita interactividad/efectos.
2. **Separador entre métricas.** El CSS original usaba `.metric + .metric::before` con un
   `border-left` absoluto y ocultaba el divisor en columnas impares en mobile
   (`.metric:nth-child(odd)::before{ display:none }`, grid de 2 columnas). Se replicó con
   clases condicionales por índice (`i % 2` para mobile de 2 columnas, `i > 0` para desktop
   de 4), en vez de depender de selectores CSS `nth-child` que son más frágiles de leer en
   JSX.

#### Verificación

- `npm run lint` — sin errores.
- `npx tsc --noEmit` — sin errores.
- Verificación visual con Playwright headless en `/` a 1440×900: la franja de métricas se ve
  igual al prototipo (valores, separadores, tipografía), sin errores de consola.

### Tarea 2 — Portar la animación de conteo (`initCounters`) como hook, activado por `IntersectionObserver`

**Estado: completada.**

#### Archivos creados

- `frontend/src/hooks/useCountUp.ts` — hook reutilizable (`useCountUp<T>(target)`). Porta
  `initCounters()` de `site.js`: cuenta desde 0 hasta `target` con easing cúbico de salida
  (`1 - (1-p)³`) en 1400ms, usando `requestAnimationFrame`. Devuelve `{ ref, value }`; el
  conteo arranca recién cuando el elemento referenciado por `ref` entra en viewport
  (`IntersectionObserver`, `threshold: 0.5`, se desconecta con `unobserve` tras disparar una
  vez — igual que el original). Si `IntersectionObserver` no existe en el navegador, corre
  igual sin esperar (fallback del prototipo). Primer hook del proyecto — se creó la carpeta
  `frontend/src/hooks/` porque no existía.
- `frontend/src/components/home/AnimatedCounter.tsx` — Client Component "de hoja" que
  consume `useCountUp` y renderiza `{prefix}{value}` en un `<div>` con el `className` que le
  pase el padre (para no duplicar los estilos tipográficos ya definidos en `MetricsSection`).

#### Archivos modificados

- `frontend/src/components/home/MetricsSection.tsx` — cada número ahora se renderiza con
  `<AnimatedCounter value={...} prefix={...} className={...} />` en vez del texto estático.
  `MetricsSection` en sí **sigue siendo Server Component**: solo `AnimatedCounter` (la hoja
  que necesita `useEffect`/estado) se marca `"use client"`, siguiendo el mismo criterio de
  "reducir el bundle de cliente" que ya se aplicó en `Hero.tsx` (Server) + `Cube3D.tsx`
  (Client) en la Fase 1.

#### Decisiones técnicas

1. **Un observer por contador, no uno por sección.** El prototipo observaba cada
   `[data-count]` individualmente (`nums.forEach(n => io.observe(n))`), no la sección
   completa. Se mantuvo ese criterio: cada `AnimatedCounter` monta su propio
   `IntersectionObserver` vía el hook. Con solo 4 elementos el costo es insignificante y es
   más simple que coordinar un observer compartido entre 4 componentes independientes.
2. **`prefers-reduced-motion`.** Igual que el resto de animaciones portadas en este proyecto
   (Fase 1): si el usuario prefiere movimiento reducido, el valor se fija directo en
   `target` sin animar — el original hacía lo mismo (`if (REDUCED) { el.textContent = ...; return; }`).
3. **`setState` dentro de `useEffect`.** El mismo error de lint que ya apareció en `Cube3D`
   (`react-hooks/set-state-in-effect`) saltó aquí al fijar el valor final de forma síncrona
   en la rama de `prefers-reduced-motion`. Misma solución: `queueMicrotask(() => setValue(target))`.
4. **Tipado genérico del hook.** `useCountUp<T extends HTMLElement>` para que `AnimatedCounter`
   pueda tipar su propio `ref` como `HTMLDivElement` sin `as` ni `any`.

#### Verificación

- `npm run lint` — sin errores (mismos 4 warnings preexistentes de `ApplicationForm.tsx`).
- `npx tsc --noEmit` — sin errores.
- Verificación visual con Playwright headless: se hizo scroll hasta la sección y se capturó
  a los ~700ms (mitad de la animación de 1400ms) y al finalizar. La primera captura muestra
  valores intermedios (+115/+38/+14/+19) y la segunda los valores finales (+120/+40/+15/+20),
  confirmando que el conteo anima en vez de saltar directo al valor final. Sin errores de
  consola.

### Tarea 3 — Conectar los valores a una fuente de datos (props o fetch), no hardcodeados

**Estado: completada.** Nota del encargo: para imágenes, de momento se usan mocks — no aplica
a esta tarea puntual (las métricas no tienen imágenes), pero queda como criterio para tareas
futuras de Renato que sí las requieran (Fase 5, Fase 7).

#### Archivos creados

- `frontend/src/lib/data/metrics.ts` — exporta el tipo `Metric` y `getMetrics()`, una función
  `async` que hoy devuelve un array mock (`MOCK_METRICS`) pero está pensada como el único
  punto de reemplazo cuando exista una fuente real (API/CMS): el componente que la consume no
  cambia. Sigue el mismo criterio de "un solo lugar para editar los datos" que `data.js` en el
  prototipo (`SM.novedades`, `SM.beneficios`, etc.), pero como módulo TypeScript tipado en vez
  de un objeto global `SM`.

#### Archivos modificados

- `frontend/src/components/home/MetricsSection.tsx` — pasó de `const METRICS = [...]`
  hardcodeado dentro del archivo a `async function MetricsSection()` que hace
  `await getMetrics()`. Sigue siendo Server Component (ahora async), consistente con el
  patrón de Next.js para fetch de datos en Server Components (no se necesita `useEffect` ni
  estado de carga porque no hay nada de por medio en el cliente).

#### Decisiones técnicas

1. **`async function` en vez de `use()` o un hook.** Next.js App Router permite que un Server
   Component sea `async` y haga `await` directamente en el cuerpo; es el patrón estándar para
   fetch de datos server-side (documentado en `01-getting-started/06-fetching-data.md` del
   propio Next.js instalado). No hace falta Client Component, `useEffect` ni estado de
   carga/error para este caso.
2. **Mock async, no sync.** `getMetrics()` devuelve una `Promise` aunque hoy no haga ningún
   I/O real, precisamente para que el día que se conecte a una API de verdad
   (`fetch(...)`) no haya que tocar la firma ni el componente que la consume — solo el cuerpo
   de la función.

#### Verificación

- `npm run lint` — sin errores.
- `npx tsc --noEmit` — sin errores.
- `npm run build` — build de producción exitoso.
- Verificación visual con Playwright headless: la sección se ve y anima igual que antes del
  cambio (+120/+40/+15/+20 al finalizar), sin errores de consola.

---

## Fase 5 — Sección animada de especializaciones/ramas (RF-05)

**Estado: en progreso, tarea por tarea.** Esta sección **no existe en el prototipo estático**;
se construye desde cero siguiendo el criterio visual del resto de la Home (misma paleta y
tipografía de `site.css` / Brandbook 1.0), y su contenido se basa en las seis áreas descritas
en `SM.areas` del prototipo (`assets/js/data.js`), resumidas para este formato.

### Tarea 1 — Bloque de especializaciones con el logo de SupplyMentum como disparador

**Estado: completada.**

#### Archivos creados

- `frontend/src/lib/data/specializations.ts` — tipo `Specialization` y `getSpecializations()`
  (mock `async`, mismo patrón que `lib/data/metrics.ts` de la Fase 3): las seis
  especializaciones (Operaciones, Marketing, Talento, Corporativas, Proyectos, Tecnología)
  con nombre corto, nombre completo y descripción, adaptadas de `SM.areas`.
- `frontend/src/components/home/Specializations.tsx` — Server Component `async` que hace
  `await getSpecializations()` y pasa el resultado como prop a `SpecializationsBlock`. Mismo
  criterio de "reducir el bundle de cliente" usado en `MetricsSection`/`AnimatedCounter`
  (Fase 3) y `Hero`/`Cube3D` (Fase 1): el fetch de datos queda en el server, solo el bloque
  interactivo se manda al cliente.
- `frontend/src/components/home/SpecializationsBlock.tsx` — Client Component. El isotipo
  (`/cubo.png`) se muestra como botón circular con un anillo pulsante (`animate-ping`)
  alrededor: es el "disparador" que pide el RF-05. Un `setInterval` de 5000ms avanza sola la
  especialización mostrada; un clic en el logo la avanza también de inmediato y reinicia el
  temporizador (para no encimar un avance automático justo después de uno manual). El nombre,
  nombre corto y descripción de la especialización activa se muestran al lado del logo.

#### Archivos modificados

- `frontend/src/app/page.tsx` — se monta `<Specializations />` después de `<MetricsSection />`.

#### Decisiones técnicas

1. **Reutilizar el isotipo (`cubo.png`) en vez de crear un logo nuevo.** El RF-05 pide "el
   logo de SupplyMentum animado como disparador"; se usó el mismo asset que ya sirve de
   fallback del cubo 3D en el Hero (Fase 1), evitando introducir un asset nuevo para un
   propósito que el isotipo ya cumple visualmente.
2. **Auto-avance + avance manual conviven en el mismo disparador.** El botón que dispara el
   avance manual es el mismo elemento que actúa como isotipo/logo, en vez de agregar
   controles separados (flechas, dots) — esos son responsabilidad de la tarea 3
   (accesibilidad y navegación por teclado, si se decide agregar controles manuales
   explícitos).
3. **Reinicio del temporizador al interactuar.** `restartTimer()` limpia el `setInterval`
   anterior y arranca uno nuevo cada vez que el usuario hace clic, para que la cadencia de
   5s siempre se cuente desde la última interacción del usuario, no desde el último tick
   automático — evita el caso de "clic justo antes del auto-avance" saltándose una
   especialización de golpe.
4. **Todavía sin transición de fade ni `prefers-reduced-motion`.** El cambio de contenido
   hoy es un swap directo de React (sin animación de salida/entrada) — se resuelve en la
   tarea 2, que porta explícitamente el patrón `is-out`/`is-in` visto en `areas.html` del
   prototipo. Se documenta la ausencia a propósito para que quede claro que no es un olvido,
   sino el alcance de esta tarea puntual.

#### Verificación

- `npm run lint` — sin errores.
- `npx tsc --noEmit` — sin errores.
- Verificación visual con Playwright headless: se hizo scroll hasta la sección (arranca en
  "Operaciones & Logística"), se hizo clic en el logo (avanza a "Marketing & Contenidos") y
  se esperó el intervalo completo de 5s sin interacción (avanza solo a "Gestión del
  Talento"). Sin errores de consola.

### Tarea 2 — Transición entre especializaciones (fade/slide), portando el patrón `is-out`/`is-in`

**Estado: completada.**

#### Archivos modificados

- `frontend/src/components/home/SpecializationsBlock.tsx`:
  - El bloque de texto (nombre corto, nombre, descripción) ahora es el equivalente a
    `.area-fade` de `areas.html`: transición CSS de `opacity` + `transform` de 320ms
    (`FADE_TRANSITION_MS`), con el mismo *easing* `cubic-bezier(.22,.61,.36,1)` que usa
    `--ease` en `site.css`. El estado `isOut` agrega/quita las clases equivalentes a
    `.is-out` (`opacity-0 translate-y-[10px]` ↔ `opacity-100 translate-y-0`).
  - Se agregó `goTo(next)`: pone `isOut = true` y, a los 200ms (`FADE_SWAP_DELAY_MS` — el
    mismo valor que `setTimeout(paint, 200)` del prototipo, **menor** que los 320ms de la
    transición a propósito, para que el contenido cambie mientras el fade-out todavía está
    a medias y el fade-in retome desde ahí, en vez de encadenar dos transiciones completas),
    actualiza el `index` y vuelve a poner `isOut = false`.
  - Tanto el clic manual (`advance`) como el auto-avance (`setInterval` dentro de
    `restartTimer`) pasan ahora por `goTo`, así que el fade aplica en ambos casos por igual.
  - Se agregó `indexRef` (sincronizado con `index` vía `useEffect`) para que el callback del
    `setInterval` lea siempre el índice más reciente sin recrear el timer en cada cambio de
    `index` — evita que `restartTimer` tuviera que declarar `index` como dependencia (lo que
    reiniciaría el temporizador en cada avance, rompiendo la cadencia de 5s constante).

#### Decisiones técnicas

1. **Tiempos calcados 1:1 del prototipo, no inventados.** 320ms de transición y 200ms de
   delay antes del swap de contenido son exactamente los valores de `.area-fade` y del
   `setTimeout(paint, 200)` en el script de `areas.html`. No se ajustaron "a ojo": es
   literalmente el mismo patrón que ya se usa en el sitio, solo trasladado a React.
2. **`ref` en vez de agregar `index` a las dependencias del timer.** La alternativa directa
   (leer `index` desde el closure del efecto) hubiera obligado a reiniciar `restartTimer` en
   cada avance — con eso el auto-avance nunca alcanzaría a dispararse solo, porque cada
   render lo estaría reiniciando. `indexRef` evita ese problema sin sacrificar la lectura del
   valor más reciente.
3. **Todavía sin `prefers-reduced-motion` ni navegación por teclado.** Ambos quedan para la
   tarea 3 de esta fase, tal como lo separa el plan de trabajo. Con la transición ya
   integrada, un usuario con movimiento reducido hoy igual ve el fade (aunque sea breve) —
   se corrige explícitamente en la siguiente tarea, no es un descuido.

#### Verificación

- `npm run lint` — sin errores.
- `npx tsc --noEmit` — sin errores.
- Verificación visual con Playwright headless: captura antes del clic, captura ~100ms
  después del clic (se ve el texto con desenfoque de movimiento, a media transición) y
  captura tras completarse — confirma que el contenido no cambia de golpe sino que
  desvanece/reaparece con corrimiento vertical, igual que `.area-fade`/`.is-out` en el
  prototipo. Sin errores de consola.

### Tarea 3 — Accesibilidad: sin animación en `prefers-reduced-motion`, navegación por teclado

**Estado: completada.**

#### Archivos modificados

- `frontend/src/components/home/SpecializationsBlock.tsx`:
  - `reducedMotionRef` (leído una vez con `matchMedia("(prefers-reduced-motion: reduce)")` al
    montar, mismo criterio que ya usan `Cube3D`, `NetworkBackground` y `useCountUp` en fases
    anteriores — no se agregó un listener reactivo a cambios en vivo del media query, para
    mantener el mismo patrón establecido en el resto del proyecto). Dentro de `goTo`, si
    `reducedMotionRef.current` es `true`, el `index` se actualiza directo (`setIndex(next)`),
    sin pasar por `isOut`/`setTimeout` — replica el
    `if (REDUCED) { paint(); return; }` de `areas.html` en vez de solo apagar la transición
    por CSS y dejar el delay de 200ms igual (que hubiera dejado un salto sin animación pero
    igual de lento).
  - `stepBy(delta)` generaliza el avance a cualquier dirección:
    `((index + delta) % n + n) % n` (aritmética modular segura para `delta` negativo), usado
    tanto por el clic (`advance = () => stepBy(1)`) como por el teclado.
  - `onTriggerKeyDown` en el botón disparador: `ArrowRight`/`ArrowDown` avanza,
    `ArrowLeft`/`ArrowUp` retrocede — mismo mapeo de teclas que el `keydown` de la rueda en
    `areas.html`. El disparador ya era un `<button>` real (no un `<div>` con `onClick`), así
    que el foco y la activación con Enter/Espacio ya eran nativos desde la tarea 1; esta
    tarea solo agrega el soporte de flechas.
  - `aria-label` del botón actualizado para mencionar la interacción por teclado ("Actívalo o
    usa las flechas para ver otra"), no solo el clic.

#### Decisiones técnicas

1. **Sin controles manuales adicionales (flechas/dots visibles).** El plan condiciona la
   navegación por teclado a "si hay controles manuales" — el único control manual de este
   bloque es el propio disparador (isotipo), así que el soporte de teclado se agregó ahí
   mismo, sin introducir botones nuevos que no pidió ninguna tarea anterior.
2. **`reducedMotionRef` leído una sola vez, no reactivo.** Coherente con cómo ya se resolvió
   `prefers-reduced-motion` en `Cube3D` (Fase 1) y `useCountUp` (Fase 3): se lee el valor al
   montar el componente, no se suscribe a cambios en vivo del media query. Cambiar de
   criterio solo para este componente hubiera introducido una inconsistencia entre fases sin
   ninguna necesidad concreta que la justifique.
3. **Reinicio del temporizador también en la navegación por teclado.** `stepBy` llama a
   `restartTimer()` igual que el clic — si el usuario está navegando manualmente con las
   flechas, no tiene sentido que el auto-avance interrumpa esa navegación a mitad de camino.

#### Verificación

- `npm run lint` — sin errores.
- `npx tsc --noEmit` — sin errores.
- Verificación visual con Playwright headless:
  - **Teclado:** foco en el disparador (anillo de foco visible), `ArrowRight` avanza de
    "Operaciones & Logística" a "Marketing & Contenidos", `ArrowLeft` vuelve a "Operaciones &
    Logística".
  - **`prefers-reduced-motion`:** con `page.emulateMedia({ reducedMotion: "reduce" })`, un
    clic en el disparador y una captura a los 50ms ya muestra el contenido final
    ("Marketing & Contenidos") completamente nítido, sin el desenfoque de movimiento que sí
    se ve en la Tarea 2 a los 100ms con la transición activa — confirma que no anima.
  - Sin errores de consola en ningún caso.

---

## Fase 7 — Cards de navegación a otras secciones (RF-07)

**Estado: en progreso, tarea por tarea.**

### Tarea 1 — Migrar el bloque "Explora" (`grid grid-4`), cards numeradas 01–04

**Estado: completada.**

#### Archivos creados

- `frontend/src/components/home/ExploreSection.tsx` — Server Component (sin interactividad,
  no necesita `"use client"`). Portado 1:1 del bloque `Explora` de `index.html`: mismo copy,
  mismo orden y misma numeración (01 Conócenos, 02 Áreas, 03 Proyectos, 04 Eventos) que el
  prototipo. La grilla `grid grid-4` se replicó como `grid-cols-1 sm:grid-cols-2
  lg:grid-cols-4`, igual a los *breakpoints* de `.grid-4` en `site.css` (2 columnas bajo
  1080px, 1 columna bajo 760px). Cada card usa `next/link` (`<Link href="/conocenos">`, etc.)
  en vez del `<a href="conocenos.html">` estático del prototipo.

#### Archivos modificados

- `frontend/src/app/page.tsx` — se monta `<ExploreSection />` después de `<Specializations />`.

#### Decisiones técnicas

1. **Contenido hardcodeado en el componente, no en un `lib/data/*`.** A diferencia de
   Métricas (Fase 3) o Especializaciones (Fase 5), esta tarea no pide desacoplar los datos de
   una fuente externa — el plan solo dice "migrar el bloque". No se adelantó ese patrón sin
   que una tarea lo pidiera explícitamente.
2. **Rutas ya usadas por `Header.tsx`.** Los `href` (`/conocenos`, `/areas`, `/proyectos`,
   `/eventos`) son los mismos que ya usa la navegación principal (`Header.tsx`), aunque esas
   páginas todavía no existen en `frontend/src/app` — es el mismo estado en el que ya está el
   resto del sitio (el nav ya enlaza a rutas sin construir), no una inconsistencia nueva.
3. **Estilo del `.card` recreado con Tailwind, no una clase global nueva.** Se replicaron las
   propiedades de `.card`/`.card-body`/`.card-meta` de `site.css` (fondo `--surface`
   `#121215`, borde `--line`, hover con borde rojo + `translateY(-6px)` + sombra) como
   utilidades Tailwind en el propio componente, siguiendo el mismo criterio ya usado en
   Métricas y Especializaciones (colores de marca en clases arbitrarias, sin
   `tailwind.config` de paleta custom).

#### Verificación

- `npm run lint` — sin errores.
- `npx tsc --noEmit` — sin errores.
- Verificación visual con Playwright headless: captura desktop (4 columnas, numeración y
  copy idénticos al template), captura con hover en la primera card (borde rojo visible,
  igual que `.card:hover`) y captura mobile a 390px (colapsa a 1 columna). Sin errores de
  consola.

### Tarea 2 — Cada card enlaza a su página/sección correspondiente, con hover consistente con `.card`

**Estado: completada.**

#### Archivos modificados

- `frontend/src/components/home/ExploreSection.tsx` — se ajustaron dos valores para que el
  hover coincida con `.card` de `site.css` al detalle, no solo aproximadamente:
  - `transition-duration` pasó de `duration-300` (300ms) a `duration-[350ms]`, igual al
    `.35s` que usa `.card` en `transition:border-color .35s var(--ease), transform .35s
    var(--ease), box-shadow .35s var(--ease)`.
  - El padding del cuerpo de la card pasó de `p-6 pb-7` (24px arriba) a
    `px-6 pt-[26px] pb-7`, igual al `padding:26px 24px 28px` de `.card-body`.

#### Decisiones técnicas

1. **`.card` de `site.css` como única referencia, no las cards ya existentes en
   `convocatoria/`.** Antes de tocar nada revisé `AreasGrid.tsx` y `BenefitsGrid.tsx`
   (`frontend/src/components/convocatoria/`), que también renderizan grillas de tarjetas ya
   migradas a Next.js. Su hover es distinto al de `.card` del prototipo: borde que pasa a
   `zinc-700` (no rojo) y sombra `shadow-red-950/20`, en vez del borde
   `rgba(237,28,36,.55)` y la sombra `0 22px 52px rgba(0,0,0,.42)` que define `.card`. Es una
   interpretación de otro compañero para una sección distinta (Convocatoria), no la
   referencia que pide esta tarea — el plan dice explícitamente "hover consistente con el
   resto del sitio (`.card`)", nombrando la clase del prototipo, así que se mantuvo fidelidad
   a `.card` y no se copió el patrón de `convocatoria/`.
2. **Verificación de los 4 `href` contra `Header.tsx`.** Se confirmó por código
   (`grep` de `Header.tsx`) que las cuatro rutas (`/conocenos`, `/areas`, `/proyectos`,
   `/eventos`) son exactamente las mismas que ya usa la navegación principal, en el mismo
   orden — no rutas inventadas para esta sección.

#### Verificación

- `npm run lint` — sin errores.
- `npx tsc --noEmit` — sin errores.
- Verificación visual con Playwright headless: se extrajeron los 4 `href` del DOM
  (`["/conocenos","/areas","/proyectos","/eventos"]`, coinciden con `Header.tsx`) y se probó
  el hover sobre la última card ("Eventos") para confirmar que el comportamiento (borde rojo,
  elevación) es igual de consistente en las cuatro, no solo en la primera. Sin errores de
  consola.

### Tarea 3 — Verificar `aria-current="page"` y el resaltado de navegación con el router de Next.js

**Estado: completada.** Esta tarea es sobre `Header.tsx` (la navegación principal del sitio,
no un archivo propio de la Home), porque es ahí donde vive el resaltado de navegación que
`initNav()` resolvía en el prototipo.

#### Hallazgo

Al revisar `Header.tsx` contra `initNav()` (`site.js`, líneas 349–362 del prototipo) encontré
que el resaltado visual (texto en rojo) sí funcionaba vía `usePathname()`, pero **el atributo
`aria-current="page"` que pide explícitamente esta tarea no se estaba escribiendo en el DOM en
ningún lado** — solo había una clase CSS condicional. Es una diferencia real con el prototipo:
`initNav()` hace exactamente `a.setAttribute('aria-current', 'page')`, no solo cambia el color
por CSS. Sin ese atributo, un lector de pantalla no tiene forma de saber cuál es la página
activa dentro del `<nav>`.

#### Archivos modificados

- `frontend/src/components/Header.tsx`:
  - Se agregó `isLinkActive(href)`, un helper que reemplaza el cálculo de `isActive` que
    estaba duplicado (con el mismo código) en el nav de escritorio y en el drawer mobile.
  - La condición se generalizó: antes solo Convocatoria tenía el caso especial
    `pathname.startsWith("/convocatoria")` para que sus páginas internas resalten el link
    padre; ahora **todas** las rutas usan `pathname === href || pathname.startsWith(href + "/")`
    (excepto `/`, que solo matchea exacto). Esto replica el mapeo de "familias" de
    `initNav()` en el prototipo (`area.html` → `areas.html`, `proyecto.html` →
    `proyectos.html`, `evento.html` → `eventos.html`): cuando existan páginas de detalle como
    `/areas/operaciones` o `/eventos/supply-summit-2026`, el nav ya las va a reconocer como
    parte de "Áreas"/"Eventos" sin tener que tocar `Header.tsx` de nuevo.
  - Se agregó `aria-current={isActive ? "page" : undefined}` al `<Link>` en ambos bloques
    (desktop y mobile) — el atributo que faltaba.

#### Decisiones técnicas

1. **`undefined` en vez de `"false"` cuando no está activo.** `aria-current="false"` es un
   valor ARIA válido pero semánticamente distinto de "el atributo no está presente" — algunos
   lectores de pantalla tratan la ausencia del atributo de forma más predecible que un valor
   `"false"` explícito. Se usó `undefined` para que React no renderice el atributo en absoluto
   cuando el link no está activo, en vez de escribir el string `"false"`.
2. **Un solo helper en vez de duplicar la lógica.** El código ya estaba repetido
   (desktop/mobile) con el caso especial de Convocatoria copiado y pegado. Extraerlo evita
   que ambos bloques se desincronicen si alguien ajusta la regla de "activo" en un solo lugar
   a futuro.
3. **No se tocó el resto de `Header.tsx`** (estructura del menú mobile, `Logo`, botón
   "ÚNETE"): el alcance de esta tarea es específicamente el resaltado de navegación.

#### Verificación

- `npm run lint` — sin errores.
- `npx tsc --noEmit` — sin errores.
- Verificación con Playwright headless: en `/` el único link con `aria-current="page"` es
  "INICIO"; en `/convocatoria` es "CONVOCATORIA" (un solo link marcado en cada caso, no cero
  ni más de uno). Captura del `<header>` en `/convocatoria` confirma que el resaltado visual
  (texto rojo) coincide con el link que lleva el atributo. `/conocenos`, `/areas`,
  `/proyectos` y `/eventos` todavía no existen como páginas en `frontend/src/app`, así que no
  se pudieron probar en el navegador — la lógica de `isLinkActive` ya las cubre por código
  (mismo patrón verificado en Home y Convocatoria), pero queda pendiente una verificación
  visual en cuanto esas páginas existan.

---

## Iteración post-plan — Especializaciones como carrusel orbital + smooth scrolling

**Estado: completada.** Pedido directo del equipo (fuera del plan original): rehacer la
sección de Especializaciones (RF-05) con las 6 áreas orbitando como planetas, con avance
automático cada 10 segundos de izquierda a derecha, sin necesidad de interacción; el área al
frente resaltada con nombre + descripción, las 2 laterales atenuadas mostrando solo el ícono,
y las 3 traseras ocultas apareciendo durante las transiciones. Además, smooth scrolling en
toda la Home.

### Referencia de diseño

El carrusel no se inventó desde cero: porta la **rueda orbital de `areas.html`**
(`.wheel` / `.wheel-track` / `.wheel-core` / `.node` en `site.css` + el script de la página),
que es exactamente esta metáfora en el prototipo — nodos sobre una elipse donde la
profundidad (el seno del ángulo) controla escala, opacidad y orden de apilado, con el
isotipo al centro y el nodo del frente en blanco con halo (`.node.is-active`). Se adaptó de
"rueda arrastrable con 6 nodos siempre visibles" (Áreas) a "órbita autónoma con 3 visibles"
(Home), que es lo que pidió el encargo.

### Archivos modificados

- `frontend/src/lib/data/specializations.ts` — se agregó el campo `icon` al tipo
  `Specialization`: los mismos paths SVG (formato `d1|d2|...`, viewBox 24×24) que usa
  `SM.areas[].icon` en `data.js` del prototipo, copiados 1:1 para las 6 áreas.
- `frontend/src/components/home/SpecializationsBlock.tsx` — reescrito como carrusel orbital:
  - **Geometría:** cada nodo se posiciona en la elipse con
    `θ = 90° + k·60°`, donde `k ∈ [-2, 3]` es el offset firmado respecto del área al frente
    (`k = ((i − index + 2) mod 6) − 2`). El frente está abajo (θ = 90°), igual que en la
    rueda del prototipo. `depth = (sin θ + 1) / 2` deriva todo lo demás:
    `opacity = max(0, (depth − .5) · 2)` (frente 1, laterales 0.5, traseras 0 — exactamente
    3 visibles), `scale = .45 + depth · .6`, `zIndex = depth · 100`.
  - **Dirección izquierda → derecha:** al avanzar el índice, θ del frente decrece
    (90° → 30°, sale por la derecha) y el nuevo frente entra desde 150° (izquierda).
  - **Animación por transiciones CSS** (`left`, `top`, `opacity`, `transform`; 900ms, el
    `cubic-bezier(.22,.61,.36,1)` de `--ease` en site.css), no rAF: React actualiza las
    posiciones objetivo y el navegador interpola. El nodo que "envuelve" (k: −2 → 3) cruza
    por detrás de la elipse donde su opacidad es 0 en ambos extremos, así que el salto es
    invisible.
  - **Auto-avance cada 10s** (`AUTO_ADVANCE_MS = 10000`, antes 5s), reutilizando la
    maquinaria `restartTimer`/`goTo`/`indexRef` de las tareas anteriores; el texto del
    frente conserva el fade `is-out`/`is-in` (320ms / swap a 200ms) de la tarea 2.
  - **Accesibilidad conservada de la tarea 3:** con `prefers-reduced-motion` no hay órbita
    animada ni fade (posiciones y contenido cambian directo); el escenario es un `role="group"`
    enfocable que responde a las flechas; los nodos siguen siendo `<button>` reales
    (clic trae esa área al frente y reinicia el temporizador), con `aria-label` del área y
    `aria-current` en el frente; el panel de texto es `aria-live="polite"`.
  - `reduced` pasó de `ref` a estado (`useState`), porque ahora también decide clases y
    duraciones en el render (no solo lógica interna del efecto).
  - Layout centrado según el boceto del encargo: eyebrow con doble filete
    (`.eyebrow.is-centered` del prototipo), órbita, y nombre + descripción centrados debajo
    del nodo frontal. El isotipo (`cubo.png`) quedó al centro de la elipse como el
    `.wheel-core` del prototipo.
- `frontend/src/app/globals.css` — el smooth scrolling **ya existía** global
  (`html { scroll-behavior: smooth }`, aplicaba a toda la Home desde antes); lo que faltaba
  respecto del prototipo era el guard de movimiento reducido, y se agregó:
  `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto } }`, igual que
  `site.css`.

### Verificación

- `npm run lint` / `npx tsc --noEmit` — sin errores.
- Verificación visual con Playwright headless (desktop 1440×900 y mobile 390×844):
  - Estado inicial: frente blanco con halo + nombre/descripción, 2 laterales atenuadas solo
    ícono, 3 traseras invisibles, aro orbital e isotipo al centro.
  - Captura a ~450ms de una transición: se ve el nuevo frente entrando desde la izquierda
    (a medio camino, parcialmente resaltado), el frente saliente moviéndose a la derecha, la
    trasera siguiente apareciendo en el lateral izquierdo y la lateral derecha
    desvaneciéndose — el flujo izquierda → derecha pedido.
  - Auto-avance sin interacción: al cargar el frente es "Operaciones & Logística" y tras
    10.8s sin tocar nada es "Marketing & Contenidos" (verificado leyendo `aria-current` del
    DOM).
  - Sin errores de consola en ningún caso.

### Ajuste de dirección de arte (feedback del equipo sobre la primera versión)

Tras revisar la primera versión del carrusel, el equipo pidió dos correcciones, aplicadas
sobre `SpecializationsBlock.tsx`:

1. **Encabezado a la izquierda.** El eyebrow "Especializaciones" y el título "Seis ramas, un
   mismo centro" dejaron de estar centrados: vuelven al alineado izquierdo estándar del
   resto de la Home (filete solo a la izquierda, sin `is-centered`). El panel de texto del
   área frontal sí sigue centrado bajo la órbita, como en el boceto original del encargo.
2. **Estética 3D tipo "agujero negro" y fuera el cubo.** Se retiró el isotipo (`cubo.png`)
   del centro y se reemplazó por un núcleo construido en CSS puro, adaptando el referente
   visual que pasó el equipo (agujero negro con disco de acreción) a la paleta de marca:
   - **Núcleo:** esfera oscura (`radial-gradient` rojo muy profundo → negro, con luz de
     borde ámbar arriba), anillo de luz ámbar alrededor
     (`border` + `box-shadow` con glow rojo), halo difuso (`radial-gradient` + `blur`) y el
     **disco de acreción**: una línea horizontal luminosa
     (`linear-gradient` transparente → rojo → ámbar → blanco cálido y de vuelta) que
     atraviesa el núcleo, con `blur` y glow.
   - **Nodos como planetas:** dejaron de ser discos planos (rojo plano / blanco del
     `.node.is-active` del prototipo) y ahora tienen sombreado esférico por
     `radial-gradient` descentrado (luz ámbar arriba-izquierda —del lado del núcleo—,
     terminador oscuro abajo-derecha, sombras internas). El del frente brilla encendido
     (ámbar → rojo con doble glow externo); los laterales usan la misma esfera en versión
     apagada.
   - **Órbita más achatada y con arco frontal:** RY bajó de 30 a 20 (más perspectiva de
     disco visto en ángulo) y el aro ahora son dos elipses: la trasera tenue
     (`border` rojo al 20%) y un **arco frontal ámbar brillante** logrado con
     `mask-image: linear-gradient(to top, ...)` sobre una segunda elipse — el tramo de
     órbita que pasa por delante se ve iluminado, el de atrás se pierde, reforzando el 3D.
   - Los planetas por detrás del núcleo se apilan bajo él (`zIndex` del núcleo = 50, entre
     los `depth·100` de traseros y frontales).
   - Ningún cambio en la mecánica (geometría, tiempos, accesibilidad, reduced-motion): solo
     dirección de arte.

Verificado en navegador (desktop): estado inicial y captura a mitad de transición confirman
el núcleo con anillo/disco, los planetas esféricos y el flujo izquierda → derecha intactos.
Lint y `tsc` sin errores, sin errores de consola.

### Segunda dirección de arte: escena WebGL con Three.js (feedback con referentes)

La versión en CSS tampoco convenció; el equipo pasó tres referentes (growon.kr,
lastdanceforglory.world, sharplink.com — sitios con escenas WebGL cinemáticas: orbe central
grande y luminoso, partículas, movimiento lento) y pidió rehacer la sección con Three.js
manteniendo la misma idea. `SpecializationsBlock.tsx` se reescribió por completo:

- **Escena Three.js real** (misma dependencia `three` que ya usa `Cube3D` del Hero, sin
  paquetes nuevos), en un escenario a gran escala (`h-[62vh]`, ancho completo):
  - **Núcleo:** esfera oscura (`MeshStandardMaterial` rojo muy profundo) con glow aditivo
    (sprite con textura radial generada en canvas: blanco cálido → rojo) que pulsa
    lentamente.
  - **Disco de acreción:** ~1100 partículas (`THREE.Points`, blending aditivo) en un anillo
    alrededor del núcleo, con color interpolado ámbar (interior) → rojo profundo (exterior),
    girando lento; más un aro fino nítido (`TorusGeometry` ámbar aditivo). Las partículas
    pasan por delante y por detrás del núcleo — profundidad real, no simulada.
  - **Planetas:** las 6 áreas como esferas 3D (`SphereGeometry`) con material emisivo rojo y
    un sprite de glow cada una, orbitando en el plano del disco. La perspectiva la da la
    cámara (elevada y mirando al centro): el planeta del frente queda abajo, más cerca y más
    grande de forma natural. Profundidad (`sin θ`) → opacidad (frente 1, laterales .55,
    traseros 0) e intensidad emisiva (el del frente brilla encendido).
  - **Campo de estrellas** (~420 puntos, mezcla blanco/rojo) con deriva lentísima.
  - **Leve alabeo diagonal** de todo el sistema (`rotation.z = -0.08`), como el disco visto
    en ángulo del referente.
- **Íconos como HTML proyectado:** los íconos SVG de cada área son botones HTML reales
  superpuestos al canvas, reposicionados en cada frame proyectando la posición 3D del
  planeta a coordenadas de pantalla (`Vector3.project(camera)`). Así siguen siendo nítidos,
  clicables y accesibles (`aria-label`, `aria-current`), y su opacidad/escala/z-index van
  sincronizados con el planeta que acompañan.
- **Movimiento cinemático:** el ángulo de la órbita persigue su objetivo con easing
  exponencial lento (~1.5s en asentarse, normalizado por `dt` para 60/120Hz), el mismo
  patrón perseguidor de la rueda de `areas.html` y de `cube.js`. Avance automático cada 10s
  izquierda → derecha y navegación por clic/flechas intactas (misma maquinaria
  `goTo`/`restartTimer` de las tareas anteriores).
- **Cámara responsive:** en encuadres angostos (aspect < 1.2, mobile) la cámara retrocede
  (z: 9.2 → 14) para que los planetas laterales sigan asomando por los costados — verificado
  a 390×844.
- **`prefers-reduced-motion`:** no hay bucle de animación; se renderiza un frame estático y
  cada cambio de área re-renderiza directo (`snapRef`), sin easing ni fade. **Fallback:** si
  `WebGLRenderer` lanza al crearse, la escena queda vacía y el panel de texto sigue rotando
  solo.
- **Limpieza:** `cancelAnimationFrame`, `ResizeObserver.disconnect`, listener de
  `visibilitychange` (pausa con pestaña oculta), `dispose()` recursivo de geometrías,
  materiales y texturas, y `renderer.dispose()` al desmontar.

Verificado en navegador: desktop (inicial, a mitad del easing y asentado — el planeta
entrante se desliza por la órbita pasando frente al anillo de partículas) y mobile tras el
ajuste de cámara. Lint y `tsc` sin errores, sin errores de consola.

---

## Iteración post-plan — Smooth scrolling inercial + reveals al scroll en toda la Home

**Estado: completada.** Pedido del equipo: dar a toda la Home el efecto de smooth scrolling y,
como en la sección de Convocatoria, que los elementos aparezcan animados al ir scrolleando.

### Smooth scrolling (Lenis)

El `scroll-behavior: smooth` de CSS que ya existía solo suaviza los saltos por ancla, **no** el
scroll con rueda/trackpad —que es lo que da la sensación fluida de los referentes de diseño—.
Para eso se integró **Lenis** (`lenis@^1.3.25`), la librería estándar para scroll inercial (la
misma familia de efecto que usan los sitios de inspiración).

- `frontend/src/components/home/SmoothScroll.tsx` — Client Component que inicializa Lenis en un
  `useEffect` con su bucle de `requestAnimationFrame`, y lo destruye al desmontar. Config:
  `duration: 1.1`, easing ease-out cúbico (el mismo `1 - (1-t)³` que usa `--ease` en el sitio).
  Devuelve `null`.
- Se monta en `frontend/src/app/page.tsx` (la Home), **no en el layout**, para acotar el efecto
  a esta ruta y no alterar el resto del sitio (ej. Convocatoria).
- **Coexistencia:** Lenis conduce el scroll nativo por rAF (no usa un wrapper transformado), así
  que `position: sticky` (Header), los canvas `fixed` (NetworkBackground) y todos los
  `IntersectionObserver` (contadores, reveals, órbita 3D) siguen funcionando sin cambios.
- `frontend/src/app/globals.css` — se añadieron los estilos recomendados por Lenis
  (`html.lenis`, `.lenis-smooth`, `[data-lenis-prevent]`, `.lenis-stopped`) y, dentro de
  `.lenis-smooth`, se fuerza `scroll-behavior: auto` para que el smooth de CSS no pelee con la
  inercia de Lenis.
- **`prefers-reduced-motion`:** si el usuario lo prefiere, `SmoothScroll` no inicializa Lenis y
  queda el scroll nativo del sistema; el guard `@media (prefers-reduced-motion: reduce)` en
  `globals.css` ya dejaba `scroll-behavior: auto` para esos usuarios.

### Reveals al scroll (reutilizando `RevealOnScroll` de Convocatoria)

Se reutilizó el componente `RevealOnScroll` (`frontend/src/components/ui/RevealOnScroll.tsx`) que
Camila ya usa en Convocatoria (fade + desplazamiento vertical vía `IntersectionObserver`), en vez
de crear un mecanismo nuevo — "como en la convocatoria", literalmente el mismo componente.

- **Mejora de accesibilidad en el componente compartido:** se le agregó un guard de
  `prefers-reduced-motion` (si el usuario lo prefiere, el contenido se muestra directo, sin
  animar). Antes siempre animaba. Es una mejora estricta y de bajo riesgo que también beneficia a
  las secciones de Convocatoria que ya lo usan. El `setState` se difiere con `queueMicrotask`
  para no disparar el warning `react-hooks/set-state-in-effect` (mismo patrón que en el resto del
  proyecto).
- **Dónde se aplicó** (el Hero no lleva reveal: está sobre el pliegue, ya visible al cargar):
  - `MetricsSection.tsx` — cada una de las 4 métricas envuelta en `RevealOnScroll` con stagger
    (`delayMs = i * 90`), igual al patrón escalonado de `AreasGrid`/`BenefitsGrid` en Convocatoria.
  - `ExploreSection.tsx` — la cabecera (eyebrow + título) y cada una de las 4 cards con stagger.
    Se añadió `h-full` a la card para que el reveal wrapper no altere la altura uniforme del grid.
  - `SpecializationsBlock.tsx` — solo el bloque de cabecera (eyebrow + título); el canvas 3D y su
    panel de texto conservan sus propias animaciones (órbita y fade `is-out`/`is-in`).

### Verificación

- `npm run lint` / `npx tsc --noEmit` — sin errores (los 4 warnings restantes son preexistentes,
  de `ApplicationForm.tsx` de Convocatoria).
- `npm run build` — build de producción exitoso.
- Verificación en navegador (Playwright):
  - Lenis activo: `<html>` recibe la clase `lenis`.
  - Reveal por DOM (con `reducedMotion: "no-preference"`): la card "Conócenos" de Explora empieza
    en `opacity: 0` estando fuera de vista y pasa a `1` tras scrollear hasta ella — anima, no
    aparece de golpe.
  - Con `prefers-reduced-motion: reduce` (el default de Playwright headless) la misma card está en
    `opacity: 1` desde el inicio: el guard de accesibilidad funciona.
  - Header sticky y NetworkBackground fijo se mantienen correctos durante el scroll. Sin errores
    de consola.

---

## Iteración post-plan — Smooth scrolling también en Convocatoria

**Estado: completada.** Pedido del equipo: llevar el mismo efecto de scroll inercial de la Home
a la sección de Convocatoria.

### Cambios

- El componente `SmoothScroll` se movió de `frontend/src/components/home/SmoothScroll.tsx` a
  `frontend/src/components/ui/SmoothScroll.tsx`: ahora lo comparten dos rutas, así que vive en
  `ui/` (compartido) en vez de bajo `home/`. El comentario del componente se actualizó ("se monta
  por ruta: Home y Convocatoria"). La lógica (Lenis, config, guard de `prefers-reduced-motion`,
  limpieza) no cambió.
- `frontend/src/app/page.tsx` — import actualizado a `@/components/ui/SmoothScroll`.
- `frontend/src/app/convocatoria/page.tsx` — se importa y monta `<SmoothScroll />` como primer
  hijo del contenedor raíz, igual que en la Home.

### Decisión

Se montó por ruta (en cada `page.tsx`) en vez de subirlo al layout global. Aunque ahora está en
las dos únicas rutas con contenido, mantenerlo por ruta deja explícito dónde aplica y evita
activarlo en rutas futuras (ej. páginas de detalle) sin decisión previa. Convocatoria ya usaba
`RevealOnScroll` en sus secciones (`AreasGrid`, `BenefitsGrid`), así que el scroll inercial se
suma a reveals que ya existían ahí.

### Verificación

- `npm run lint` / `npx tsc --noEmit` — sin errores.
- Verificación en navegador (Playwright, `reducedMotion: "no-preference"`): en `/convocatoria`
  `<html>` recibe la clase `lenis` y el scroll es inercial (tras un `wheel`, `scrollY` sigue
  avanzando 767 → 1200 mientras la inercia se asienta). Sin errores de consola.

---
