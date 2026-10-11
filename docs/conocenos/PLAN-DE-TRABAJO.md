# Plan de Trabajo - Sección Conócenos (Alejandro)

Este documento detalla las fases y tareas necesarias para el diseño, implementación y verificación de la sección **Conócenos** de la Landing Page de SupplyMentum UNI, de acuerdo con los requerimientos **RF-10** y **RF-11** y la estructura de archivos solicitada.

---

## Fase 1: Planificación y Configuración Inicial
- [x] Crear rama de trabajo `feature/conocenos-alejandro` a partir de `main`.
- [x] Crear estructura de carpetas en `docs/conocenos/` y `docs/conocenos/assets/`.
- [x] Elaborar el Plan de Trabajo inicial (`PLAN-DE-TRABAJO.md`).
- [ ] Inicializar el archivo de control de avances (`IMPLEMENTATIONS-conocenos.md`).

## Fase 2: Investigación de Estilos y Generación de Assets
- [ ] Extraer e investigar la paleta cromática, fuentes tipográficas y estilos de la web de referencia.
- [ ] Generar imagen representativa del centro para el fondo de la Hero Section (RF-10).
- [ ] Generar 8 retratos profesionales de alta calidad (mediante IA) para los miembros de la Junta Directiva (RF-11).
- [ ] Organizar y almacenar los assets generados en la carpeta `docs/conocenos/assets/` y copiarlos a la carpeta pública del frontend (`frontend/public/images/conocenos/`).

## Fase 3: Implementación del Layout Principal y Hero Section (RF-10)
- [ ] Crear el componente de React `Conocenos` en el frontend.
- [ ] Crear la página de pruebas independiente en `src/app/conocenos/page.tsx` para visualización autónoma.
- [ ] Implementar la **Hero Section** de "Conócenos":
  - Imagen de fondo representativa con filtro gris, brillo atenuado y contraste.
  - Overlay con degradado lineal desde rojo oscuro (`#920207`) a negro (`#0B0B0C`).
  - Tagline destacado en `h1`: *"Inspiramos a los futuros profesionales a transformar el mundo empresarial"* con énfasis en color rojo primario (`#ED1C24`).
- [ ] Implementar la sección de **Misión y Visión**:
  - Cuadrícula responsiva de 2 columnas.
  - Tarjeta de Misión: Fondo oscuro (`#131316`), borde de acento rojo, texto de la misión.
  - Tarjeta de Visión: Fondo rojo institucional (`#ED1C24`), texto de la visión.

## Fase 4: Implementación de la Junta Directiva en Disposición Circular (RF-11)
- [ ] Estructurar los datos de los 8 miembros de la Junta Directiva en un arreglo (Nombre, Cargo, Bio, Perfil de LinkedIn, Foto).
- [ ] Diseñar el contenedor circular para los miembros:
  - Cálculo matemático de las coordenadas (X, Y) de cada miembro alrededor de un círculo para garantizar simetría responsiva.
  - Implementación de círculos clickables con la foto del miembro encerrada.
  - Efectos hover: zoom suave del retrato, resplandor dorado (`#FFBD59`) o rojo (`#ED1C24`) al seleccionar.
  - Enlaces clickables directos o mediante tarjeta interactiva que abran los perfiles de LinkedIn en una nueva pestaña.
- [ ] Implementar la **Tarjeta de Detalles del Miembro**:
  - Ubicada al costado del círculo (o en el centro/abajo según dispositivo).
  - Muestra Nombre, Rol en letras rojas, descripción/bio corta y botón con enlace a su LinkedIn.
  - Sincronización del estado de React para actualizar la información de la tarjeta al hacer clic o pasar el cursor sobre los círculos de la junta.

## Fase 5: Optimización Responsiva y Animaciones Premium
- [ ] Añadir micro-animaciones (transiciones suaves al cambiar de miembro seleccionado, efecto de órbita giratoria sutil, etc.).
- [ ] Optimizar la visualización para móviles (adaptar la disposición circular a una cuadrícula simétrica o rueda táctil deslizable cuando el ancho de pantalla sea reducido).
- [ ] Garantizar el cumplimiento estricto de la paleta de colores oficial:
  - Rojo Primario: `#ED1C24`
  - Rojo Oscuro: `#920207`
  - Dorado/Ámbar: `#FFBD59`
  - Fondos Oscuros: `#0B0B0C`, `#131316`

## Fase 6: Verificación y Documentación de Cierre
- [ ] Realizar pruebas visuales y de enlaces en múltiples tamaños de pantalla.
- [ ] Validar la compilación correcta del frontend (`npm run build`).
- [ ] Documentar el avance final en `IMPLEMENTATIONS-conocenos.md`.
- [ ] Presentar el walkthrough y esperar confirmación del usuario para proceder al merge.
