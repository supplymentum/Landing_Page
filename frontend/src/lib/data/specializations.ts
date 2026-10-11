export interface Specialization {
  slug: string;
  short: string;
  name: string;
  desc: string;
  /** Paths SVG (viewBox 24×24) separados por `|` — mismo formato que `SM.areas[].icon` en data.js del prototipo. */
  icon: string;
}

/**
 * Mock de las especializaciones/ramas del centro. Misma idea que
 * `lib/data/metrics.ts`: cuando exista una fuente real, solo se reemplaza
 * el cuerpo de `getSpecializations`.
 *
 * Contenido alineado a las seis áreas de `SM.areas` en el prototipo
 * (`assets/js/data.js`), resumido para esta sección de la Home (RF-05),
 * que no existe todavía en el prototipo estático.
 */
const MOCK_SPECIALIZATIONS: Specialization[] = [
  {
    slug: "operaciones",
    short: "Operaciones",
    name: "Operaciones & Logística",
    desc: "El corazón técnico del centro: planificamos, optimizamos y ejecutamos la logística de cada iniciativa, aplicando herramientas reales de gestión de operaciones.",
    icon: "M21 8l-9-5-9 5v8l9 5 9-5V8z|M3 8l9 5 9-5|M12 13v8",
  },
  {
    slug: "marketing",
    short: "Marketing",
    name: "Marketing & Contenidos",
    desc: "Damos voz e imagen a SupplyMentum: construimos la marca, creamos contenido y comunicamos todo lo que el centro hace dentro y fuera de la UNI.",
    icon: "M3 11l18-7-4 16-6-3-3 4-1-6-4-4z",
  },
  {
    slug: "talento",
    short: "Talento",
    name: "Gestión del Talento",
    desc: "Cuidamos a las personas que hacen SupplyMentum: reclutamos, integramos y desarrollamos al equipo, manteniendo viva la cultura del centro.",
    icon: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2|M17 3.5a4 4 0 0 1 0 7",
  },
  {
    slug: "corporativas",
    short: "Corporativas",
    name: "Relaciones Corporativas",
    desc: "Conectamos al centro con el mundo empresarial: gestionamos alianzas, auspicios y vínculos con profesionales líderes del Supply Chain en el Perú.",
    icon: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M2 12h20|M12 2c3 3.3 3 16.7 0 20|M12 2c-3 3.3-3 16.7 0 20",
  },
  {
    slug: "proyectos",
    short: "Proyectos",
    name: "Proyectos & Consultoría",
    desc: "Llevamos el conocimiento a la práctica: diseñamos y ejecutamos proyectos y consultorías reales que generan impacto en organizaciones.",
    icon: "M3 8h18v12H3V8z|M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2|M3 13h18",
  },
  {
    slug: "tecnologia",
    short: "Tecnología",
    name: "Innovación & Tecnología",
    desc: "Exploramos las herramientas que están transformando la cadena de suministro: datos, automatización y tecnología aplicada a la logística.",
    icon: "M5 5h14v14H5V5z|M9 9h6v6H9V9z|M12 2v3|M12 19v3|M2 12h3|M19 12h3",
  },
];

export async function getSpecializations(): Promise<Specialization[]> {
  return MOCK_SPECIALIZATIONS;
}
