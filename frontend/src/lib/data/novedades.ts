export interface Novedad {
  tag: string;
  date: string;
  title: string;
  desc: string;
  href: string;
  img: string;
}

/**
 * Mock de las novedades del centro (equivalente a `SM.novedades` del
 * prototipo). Cuando exista una fuente real (API/CMS), `getNovedades` es el
 * único lugar que hay que tocar — `NovedadesSection` no cambia.
 *
 * Las imágenes son marcadores de posición de picsum (misma semilla → misma
 * foto). Al tener las fotos reales, basta con reemplazar `img` por su ruta
 * en `public/`.
 */
const MOCK_NOVEDADES: Novedad[] = [
  {
    tag: "Convocatoria",
    date: "15 jul 2026",
    title: "Abrimos la convocatoria 2026-II",
    desc: "Postula a cualquiera de nuestras seis áreas hasta el 15 de agosto.",
    href: "/convocatoria",
    img: "https://picsum.photos/seed/sm-nov-1/900/560",
  },
  {
    tag: "Evento",
    date: "10 jul 2026",
    title: "Supply Summit UNI confirma keynotes",
    desc: "Líderes de la industria confirmados para el congreso anual.",
    href: "/eventos",
    img: "https://picsum.photos/seed/sm-nov-2/900/560",
  },
  {
    tag: "Alianza",
    date: "02 jul 2026",
    title: "Nueva alianza con LogistiPerú",
    desc: "Convenio que abre prácticas y visitas técnicas para miembros.",
    href: "/proyectos",
    img: "https://picsum.photos/seed/sm-nov-3/900/560",
  },
  {
    tag: "Podcast",
    date: "18 jun 2026",
    title: "Estrenamos el podcast Cadena Abierta",
    desc: "Un episodio quincenal con profesionales del Supply Chain peruano.",
    href: "/proyectos",
    img: "https://picsum.photos/seed/sm-nov-4/900/560",
  },
];

export async function getNovedades(): Promise<Novedad[]> {
  return MOCK_NOVEDADES;
}
