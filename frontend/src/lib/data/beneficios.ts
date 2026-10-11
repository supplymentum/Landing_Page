export interface Beneficio {
  title: string;
  desc: string;
}

/**
 * Mock de los motivos para unirse (equivalente a `SM.beneficios` del
 * prototipo). Igual que el resto de `lib/data`: si mañana vienen de una API,
 * sólo cambia `getBeneficios`.
 */
const MOCK_BENEFICIOS: Beneficio[] = [
  {
    title: "Formación aplicada",
    desc: "Talleres, casos y visitas técnicas que no encontrarás en clase.",
  },
  {
    title: "Red de contactos",
    desc: "Conecta con profesionales, egresados y empresas del sector.",
  },
  {
    title: "Experiencia real",
    desc: "Lidera proyectos y consultorías con impacto medible.",
  },
  {
    title: "Desarrollo personal",
    desc: "Mentorías y feedback constante para crecer más rápido.",
  },
  {
    title: "Comunidad",
    desc: "Un equipo que aprende, celebra y crece contigo.",
  },
  {
    title: "Marca personal",
    desc: "Visibilidad ante reclutadores y líderes del Supply Chain.",
  },
];

export async function getBeneficios(): Promise<Beneficio[]> {
  return MOCK_BENEFICIOS;
}
