export interface Director {
  name: string;
  role: string;
  desc: string;
  img: string;
  linkedinUrl: string;
}

export interface Area {
  id: string;
  name: string;
  short: string;
  desc: string;
  realizamos: string[];
  buscamos: string[];
  directores: Director[];
  iconPaths: string[];
  img: string;
}

export const areasData: Area[] = [
  {
    id: 'operaciones',
    name: 'Operaciones & Logística',
    short: 'Operaciones',
    desc: 'El corazón técnico del centro: planificamos, optimizamos y ejecutamos la logística de cada iniciativa, aplicando herramientas reales de gestión de operaciones.',
    realizamos: [
      'Planificación logística de eventos y proyectos del centro.',
      'Estudios de casos y simulaciones de cadenas de suministro reales.',
      'Optimización de procesos internos con metodologías Lean.'
    ],
    buscamos: [
      'Pensamiento analítico y gusto por resolver problemas.',
      'Interés en logística, operaciones y mejora continua.',
      'Compromiso y capacidad de trabajo en equipo.'
    ],
    iconPaths: ['M21 8l-9-5-9 5v8l9 5 9-5V8z', 'M3 8l9 5 9-5', 'M12 13v8'],
    directores: [
      { name: 'Director/a del área', role: 'DIRECTOR', desc: 'Lidera la estrategia y los proyectos del área.', img: 'https://picsum.photos/seed/sm-dir0a/600/600', linkedinUrl: '#' },
      { name: 'Co-director/a del área', role: 'CO-DIRECTOR', desc: 'Acompaña la gestión y el desarrollo del equipo.', img: 'https://picsum.photos/seed/sm-dir0b/600/600', linkedinUrl: '#' }
    ],
    img: 'https://picsum.photos/seed/sm-area-operaciones/1800/900'
  },
  {
    id: 'marketing',
    name: 'Marketing & Contenidos',
    short: 'Marketing',
    desc: 'Damos voz e imagen a SupplyMentum: construimos la marca, creamos contenido y comunicamos todo lo que el centro hace dentro y fuera de la UNI.',
    realizamos: [
      'Gestión de redes sociales y campañas de difusión.',
      'Diseño gráfico, audiovisual y línea de marca.',
      'Cobertura y comunicación de eventos del centro.'
    ],
    buscamos: [
      'Creatividad y sensibilidad visual.',
      'Manejo básico de herramientas de diseño o edición.',
      'Ganas de contar historias y construir comunidad.'
    ],
    iconPaths: ['M3 11l18-7-4 16-6-3-3 4-1-6-4-4z'],
    directores: [
      { name: 'Director/a del área', role: 'DIRECTOR', desc: 'Lidera la estrategia y los proyectos del área.', img: 'https://picsum.photos/seed/sm-dir1a/600/600', linkedinUrl: '#' },
      { name: 'Co-director/a del área', role: 'CO-DIRECTOR', desc: 'Acompaña la gestión y el desarrollo del equipo.', img: 'https://picsum.photos/seed/sm-dir1b/600/600', linkedinUrl: '#' }
    ],
    img: 'https://picsum.photos/seed/sm-area-marketing/1800/900'
  },
  {
    id: 'talento',
    name: 'Gestión del Talento',
    short: 'Talento',
    desc: 'Cuidamos a las personas que hacen SupplyMentum: reclutamos, integramos y desarrollamos al equipo, manteniendo viva la cultura del centro.',
    realizamos: [
      'Procesos de convocatoria, selección e inducción.',
      'Actividades de integración y clima organizacional.',
      'Planes de desarrollo y reconocimiento de miembros.'
    ],
    buscamos: [
      'Empatía y habilidades de comunicación.',
      'Organización y seguimiento de procesos.',
      'Vocación por el desarrollo de personas.'
    ],
    iconPaths: ['M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2', 'M17 3.5a4 4 0 0 1 0 7', 'M19.5 14.5a5 5 0 0 1 2.5 4.5v2'],
    directores: [
      { name: 'Director/a del área', role: 'DIRECTOR', desc: 'Lidera la estrategia y los proyectos del área.', img: 'https://picsum.photos/seed/sm-dir2a/600/600', linkedinUrl: '#' },
      { name: 'Co-director/a del área', role: 'CO-DIRECTOR', desc: 'Acompaña la gestión y el desarrollo del equipo.', img: 'https://picsum.photos/seed/sm-dir2b/600/600', linkedinUrl: '#' }
    ],
    img: 'https://picsum.photos/seed/sm-area-talento/1800/900'
  },
  {
    id: 'corporativas',
    name: 'Relaciones Corporativas',
    short: 'Corporativas',
    desc: 'Conectamos al centro con el mundo empresarial: gestionamos alianzas, auspicios y vínculos con profesionales líderes del Supply Chain en el Perú.',
    realizamos: [
      'Gestión de alianzas con empresas e instituciones.',
      'Búsqueda de auspicios y convenios para eventos.',
      'Networking con profesionales y egresados.'
    ],
    buscamos: [
      'Soltura para comunicarse con externos.',
      'Perseverancia y orientación a resultados.',
      'Interés por el mundo corporativo y las ventas.'
    ],
    iconPaths: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M2 12h20', 'M12 2c3 3.3 3 16.7 0 20', 'M12 2c-3 3.3-3 16.7 0 20'],
    directores: [
      { name: 'Director/a del área', role: 'DIRECTOR', desc: 'Lidera la estrategia y los proyectos del área.', img: 'https://picsum.photos/seed/sm-dir3a/600/600', linkedinUrl: '#' },
      { name: 'Co-director/a del área', role: 'CO-DIRECTOR', desc: 'Acompaña la gestión y el desarrollo del equipo.', img: 'https://picsum.photos/seed/sm-dir3b/600/600', linkedinUrl: '#' }
    ],
    img: 'https://picsum.photos/seed/sm-area-corporativas/1800/900'
  },
  {
    id: 'proyectos',
    name: 'Proyectos & Consultoría',
    short: 'Proyectos',
    desc: 'Llevamos el conocimiento a la práctica: diseñamos y ejecutamos proyectos y consultorías reales que generan impacto en organizaciones.',
    realizamos: [
      'Consultorías y diagnósticos para mypes y organizaciones.',
      'Gestión de proyectos internos del centro.',
      'Investigación aplicada en Supply Chain.'
    ],
    buscamos: [
      'Rigor metodológico y curiosidad.',
      'Conocimientos básicos de gestión de proyectos.',
      'Iniciativa para proponer y ejecutar.'
    ],
    iconPaths: ['M3 8h18v12H3V8z', 'M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M3 13h18'],
    directores: [
      { name: 'Director/a del área', role: 'DIRECTOR', desc: 'Lidera la estrategia y los proyectos del área.', img: 'https://picsum.photos/seed/sm-dir4a/600/600', linkedinUrl: '#' },
      { name: 'Co-director/a del área', role: 'CO-DIRECTOR', desc: 'Acompaña la gestión y el desarrollo del equipo.', img: 'https://picsum.photos/seed/sm-dir4b/600/600', linkedinUrl: '#' }
    ],
    img: 'https://picsum.photos/seed/sm-area-proyectos/1800/900'
  },
  {
    id: 'tecnologia',
    name: 'Innovación & Tecnología',
    short: 'Tecnología',
    desc: 'Exploramos las herramientas que están transformando la cadena de suministro: datos, automatización y tecnología aplicada a la logística.',
    realizamos: [
      'Desarrollo de herramientas digitales para el centro.',
      'Talleres de analítica de datos y automatización.',
      'Vigilancia tecnológica en Supply Chain 4.0.'
    ],
    buscamos: [
      'Interés en datos, programación o nuevas tecnologías.',
      'Autoaprendizaje constante.',
      'Pensamiento innovador orientado a soluciones.'
    ],
    iconPaths: ['M5 5h14v14H5V5z', 'M9 9h6v6H9V9z', 'M12 2v3', 'M12 19v3', 'M2 12h3', 'M19 12h3'],
    directores: [
      { name: 'Director/a del área', role: 'DIRECTOR', desc: 'Lidera la estrategia y los proyectos del área.', img: 'https://picsum.photos/seed/sm-dir5a/600/600', linkedinUrl: '#' },
      { name: 'Co-director/a del área', role: 'CO-DIRECTOR', desc: 'Acompaña la gestión y el desarrollo del equipo.', img: 'https://picsum.photos/seed/sm-dir5b/600/600', linkedinUrl: '#' }
    ],
    img: 'https://picsum.photos/seed/sm-area-tecnologia/1800/900'
  }
];
