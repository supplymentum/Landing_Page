# Plan de Trabajo - Sección Áreas

## Fase 1: Preparación y Estructura de Datos
- [x] Inicializar la estructura de documentación en docs/areas/.
- [x] Extraer el contenido del HTML en crudo (nombres, descripciones, requisitos y perfiles de LinkedIn de directores) y estructurarlo en un archivo areasData.ts para renderizado dinámico.

## Fase 2: Desarrollo de la Vista Principal (Corona Circular)
- [x] Crear el componente contenedor AreasSection.
- [x] Implementar la lógica geométrica/CSS para distribuir los componentes de cada área en forma de corona circular.
- [x] Añadir animaciones optimizadas que no degraden el rendimiento en dispositivos de gama media.
- [x] Enlazar cada elemento de la corona circular con su ruta dinámica individual.

## Fase 3: Desarrollo de la Vista Dinámica Individual (/areas/[id])
- [x] Configurar la ruta dinámica en Next.js para renderizar la información de cada área.
- [x] Maquetar la Hero Section (Logo y Tagline del área).
- [x] Maquetar la sección informativa de Requisitos y Perfil Buscado.
- [x] Construir la sección para los directores con los enlaces correspondientes a LinkedIn.

## Fase 4: Lógica del Componente CTA y Estado de Convocatoria
- [x] Desarrollar el componente CTA ("¿Te interesa?").
- [x] Integrar el botón "Postula aquí" asegurando que valide condicionalmente si el estado de la convocatoria general está habilitado.

## Fase 5: Identidad Visual y Revisión
- [x] Aplicar estrictamente la paleta de colores de la marca (#ED1C24, #920207, #FFBD59).
- [x] Aplicar las tipografías oficiales (Archivo Black para títulos, Open Sans para cuerpo).
- [x] Garantizar diseño responsive.
- [x] Actualizar IMPLEMENTATIONS-areas.md y preparar el Pull Request hacia main.
