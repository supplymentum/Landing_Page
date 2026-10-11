/* ═══════════════════════════════════════════════════════════════
   SUPPLYMENTUM UNI · DATOS DEL SITIO
   ───────────────────────────────────────────────────────────────
   Un solo lugar para editar áreas, proyectos, eventos y equipo.
   Las páginas de listado y de detalle leen de aquí, así que
   agregar un proyecto o un evento es agregar un objeto a la lista.

   FOTOS: hoy apuntan a picsum.photos como marcador de posición.
   Para poner las reales, reemplaza el valor de `img` por la ruta
   del archivo, por ejemplo:  img: 'assets/img/proyectos/lean.jpg'
   ═══════════════════════════════════════════════════════════════ */

/* Marcador de posición determinista: la misma semilla da la misma foto. */
const ph = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const SM = {

  /* ─── ÁREAS ─────────────────────────────────────────────── */
  areas: [
    {
      slug: 'operaciones',
      short: 'Operaciones',
      name: 'Operaciones & Logística',
      desc: 'El corazón técnico del centro: planificamos, optimizamos y ejecutamos la logística de cada iniciativa, aplicando herramientas reales de gestión de operaciones.',
      icon: 'M21 8l-9-5-9 5v8l9 5 9-5V8z|M3 8l9 5 9-5|M12 13v8',
      img: ph('sm-area-operaciones', 1800, 900),
      do: [
        'Planificación logística de eventos y proyectos del centro.',
        'Estudios de casos y simulaciones de cadenas de suministro reales.',
        'Optimización de procesos internos con metodologías Lean.',
      ],
      seek: [
        'Pensamiento analítico y gusto por resolver problemas.',
        'Interés en logística, operaciones y mejora continua.',
        'Compromiso y capacidad de trabajo en equipo.',
      ],
      leads: [
        { name: 'Director/a del área', role: 'Director', desc: 'Lidera la estrategia y los proyectos del área.', img: ph('sm-lead-op-1', 600, 600) },
        { name: 'Co-director/a del área', role: 'Co-director', desc: 'Acompaña la gestión y el desarrollo del equipo.', img: ph('sm-lead-op-2', 600, 600) },
      ],
    },
    {
      slug: 'marketing',
      short: 'Marketing',
      name: 'Marketing & Contenidos',
      desc: 'Damos voz e imagen a SupplyMentum: construimos la marca, creamos contenido y comunicamos todo lo que el centro hace dentro y fuera de la UNI.',
      icon: 'M3 11l18-7-4 16-6-3-3 4-1-6-4-4z',
      img: ph('sm-area-marketing', 1800, 900),
      do: [
        'Gestión de redes sociales y campañas de difusión.',
        'Diseño gráfico, audiovisual y línea de marca.',
        'Cobertura y comunicación de eventos del centro.',
      ],
      seek: [
        'Creatividad y sensibilidad visual.',
        'Manejo básico de herramientas de diseño o edición.',
        'Ganas de contar historias y construir comunidad.',
      ],
      leads: [
        { name: 'Director/a del área', role: 'Director', desc: 'Lidera la estrategia y los proyectos del área.', img: ph('sm-lead-mk-1', 600, 600) },
        { name: 'Co-director/a del área', role: 'Co-director', desc: 'Acompaña la gestión y el desarrollo del equipo.', img: ph('sm-lead-mk-2', 600, 600) },
      ],
    },
    {
      slug: 'talento',
      short: 'Talento',
      name: 'Gestión del Talento',
      desc: 'Cuidamos a las personas que hacen SupplyMentum: reclutamos, integramos y desarrollamos al equipo, manteniendo viva la cultura del centro.',
      icon: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2|M17 3.5a4 4 0 0 1 0 7',
      img: ph('sm-area-talento', 1800, 900),
      do: [
        'Procesos de convocatoria, selección e inducción.',
        'Actividades de integración y clima organizacional.',
        'Planes de desarrollo y reconocimiento de miembros.',
      ],
      seek: [
        'Empatía y habilidades de comunicación.',
        'Organización y seguimiento de procesos.',
        'Vocación por el desarrollo de personas.',
      ],
      leads: [
        { name: 'Director/a del área', role: 'Director', desc: 'Lidera la estrategia y los proyectos del área.', img: ph('sm-lead-ta-1', 600, 600) },
        { name: 'Co-director/a del área', role: 'Co-director', desc: 'Acompaña la gestión y el desarrollo del equipo.', img: ph('sm-lead-ta-2', 600, 600) },
      ],
    },
    {
      slug: 'corporativas',
      short: 'Corporativas',
      name: 'Relaciones Corporativas',
      desc: 'Conectamos al centro con el mundo empresarial: gestionamos alianzas, auspicios y vínculos con profesionales líderes del Supply Chain en el Perú.',
      icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M2 12h20|M12 2c3 3.3 3 16.7 0 20|M12 2c-3 3.3-3 16.7 0 20',
      img: ph('sm-area-corporativas', 1800, 900),
      do: [
        'Gestión de alianzas con empresas e instituciones.',
        'Búsqueda de auspicios y convenios para eventos.',
        'Networking con profesionales y egresados.',
      ],
      seek: [
        'Soltura para comunicarse con externos.',
        'Perseverancia y orientación a resultados.',
        'Interés por el mundo corporativo y las ventas.',
      ],
      leads: [
        { name: 'Director/a del área', role: 'Director', desc: 'Lidera la estrategia y los proyectos del área.', img: ph('sm-lead-co-1', 600, 600) },
        { name: 'Co-director/a del área', role: 'Co-director', desc: 'Acompaña la gestión y el desarrollo del equipo.', img: ph('sm-lead-co-2', 600, 600) },
      ],
    },
    {
      slug: 'proyectos',
      short: 'Proyectos',
      name: 'Proyectos & Consultoría',
      desc: 'Llevamos el conocimiento a la práctica: diseñamos y ejecutamos proyectos y consultorías reales que generan impacto en organizaciones.',
      icon: 'M3 8h18v12H3V8z|M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2|M3 13h18',
      img: ph('sm-area-proyectos', 1800, 900),
      do: [
        'Consultorías y diagnósticos para mypes y organizaciones.',
        'Gestión de proyectos internos del centro.',
        'Investigación aplicada en Supply Chain.',
      ],
      seek: [
        'Rigor metodológico y curiosidad.',
        'Conocimientos básicos de gestión de proyectos.',
        'Iniciativa para proponer y ejecutar.',
      ],
      leads: [
        { name: 'Director/a del área', role: 'Director', desc: 'Lidera la estrategia y los proyectos del área.', img: ph('sm-lead-pr-1', 600, 600) },
        { name: 'Co-director/a del área', role: 'Co-director', desc: 'Acompaña la gestión y el desarrollo del equipo.', img: ph('sm-lead-pr-2', 600, 600) },
      ],
    },
    {
      slug: 'tecnologia',
      short: 'Tecnología',
      name: 'Innovación & Tecnología',
      desc: 'Exploramos las herramientas que están transformando la cadena de suministro: datos, automatización y tecnología aplicada a la logística.',
      icon: 'M5 5h14v14H5V5z|M9 9h6v6H9V9z|M12 2v3|M12 19v3|M2 12h3|M19 12h3',
      img: ph('sm-area-tecnologia', 1800, 900),
      do: [
        'Desarrollo de herramientas digitales para el centro.',
        'Talleres de analítica de datos y automatización.',
        'Vigilancia tecnológica en Supply Chain 4.0.',
      ],
      seek: [
        'Interés en datos, programación o nuevas tecnologías.',
        'Autoaprendizaje constante.',
        'Pensamiento innovador orientado a soluciones.',
      ],
      leads: [
        { name: 'Director/a del área', role: 'Director', desc: 'Lidera la estrategia y los proyectos del área.', img: ph('sm-lead-te-1', 600, 600) },
        { name: 'Co-director/a del área', role: 'Co-director', desc: 'Acompaña la gestión y el desarrollo del equipo.', img: ph('sm-lead-te-2', 600, 600) },
      ],
    },
  ],

  /* ─── PROYECTOS ─────────────────────────────────────────── */
  proyectos: [
    { slug:'diagnostico-mypes', name:'Diagnóstico logístico a mypes de Lima Norte', area:'Consultoría', year:'2026',
      desc:'Consultoría gratuita de procesos logísticos para pequeñas empresas.', img:ph('sm-proy-1',900,560), destacado:true },
    { slug:'supplydata', name:'SupplyData: tablero de indicadores', area:'Tecnología', year:'2026',
      desc:'Dashboard de KPIs logísticos para la gestión interna del centro.', img:ph('sm-proy-2',900,560), destacado:true },
    { slug:'semana-supply-chain', name:'Semana del Supply Chain UNI', area:'Operaciones', year:'2025',
      desc:'Cinco días de charlas, talleres y visitas técnicas con empresas aliadas.', img:ph('sm-proy-3',900,560), destacado:true },
    { slug:'ruta-contenedor', name:'Ruta del Contenedor', area:'Operaciones', year:'2025',
      desc:'Visita técnica al puerto del Callao y simulación de comercio exterior.', img:ph('sm-proy-4',900,560), destacado:true },
    { slug:'cadena-abierta', name:'Podcast: Cadena Abierta', area:'Marketing', year:'2026',
      desc:'Conversaciones con profesionales líderes del Supply Chain peruano.', img:ph('sm-proy-5',900,560), destacado:true },
    { slug:'mentoring', name:'Mentoring SupplyMentum', area:'Talento', year:'2025',
      desc:'Programa de mentoría entre egresados, seniors y nuevos miembros.', img:ph('sm-proy-6',900,560), destacado:true },
    { slug:'reto-lean', name:'Reto Lean UNI', area:'Consultoría', year:'2025',
      desc:'Competencia interuniversitaria de mejora de procesos con casos reales.', img:ph('sm-proy-7',900,560) },
    { slug:'alianza-logistiperu', name:'Alianza LogistiPerú', area:'Corporativas', year:'2026',
      desc:'Convenio marco con el gremio logístico para prácticas y visitas.', img:ph('sm-proy-8',900,560) },
    { slug:'bootcamp-excel', name:'Bootcamp de Excel y Power BI', area:'Tecnología', year:'2025',
      desc:'Formación intensiva en herramientas de análisis para la cadena.', img:ph('sm-proy-9',900,560) },
    { slug:'feria-areas', name:'Feria de Áreas 2026', area:'Talento', year:'2026',
      desc:'Espacio de captación donde cada área muestra lo que hace.', img:ph('sm-proy-10',900,560) },
    { slug:'ultima-milla', name:'Estudio de última milla en Lima', area:'Consultoría', year:'2024',
      desc:'Investigación aplicada sobre distribución urbana y e-commerce.', img:ph('sm-proy-11',900,560) },
    { slug:'rebranding', name:'Rebranding SupplyMentum 1.0', area:'Marketing', year:'2024',
      desc:'Construcción del brandbook y nueva identidad visual del centro.', img:ph('sm-proy-12',900,560) },
  ],

  /* Equipo que aparece en la ficha de cada proyecto */
  equipoProyecto: [
    { name:'Líder de proyecto', role:'Lead',        img:ph('sm-pt-1',600,600) },
    { name:'Analista 1',        role:'Operaciones', img:ph('sm-pt-2',600,600) },
    { name:'Analista 2',        role:'Consultoría', img:ph('sm-pt-3',600,600) },
    { name:'Analista 3',        role:'Marketing',   img:ph('sm-pt-4',600,600) },
  ],

  /* ─── EVENTOS ───────────────────────────────────────────── */
  eventos: [
    { slug:'supply-summit-2026', title:'Supply Summit UNI 2026', tag:'Congreso', status:'Próximo',
      date:'28 ago 2026', time:'9:00 a. m.', place:'Auditorio CEPS — UNI',
      desc:'El congreso anual de Supply Chain: keynotes, paneles y networking con líderes de la industria.',
      img:ph('sm-ev-1',900,560) },
    { slug:'taller-sop', title:'Taller: S&OP en la práctica', tag:'Taller', status:'Próximo',
      date:'07 ago 2026', time:'6:00 p. m.', place:'Virtual — Zoom',
      desc:'Aprende a construir un proceso de planeamiento de ventas y operaciones desde cero.',
      img:ph('sm-ev-2',900,560) },
    { slug:'visita-cd', title:'Visita técnica: centro de distribución', tag:'Visita', status:'Próximo',
      date:'14 ago 2026', time:'8:00 a. m.', place:'Lurín, Lima',
      desc:'Recorrido guiado por un CD de clase mundial junto a su equipo de operaciones.',
      img:ph('sm-ev-3',900,560) },
    { slug:'charla-carrera', title:'Charla: carrera en Supply Chain', tag:'Charla', status:'Pasado',
      date:'20 jun 2026', time:'7:00 p. m.', place:'Virtual — Meet',
      desc:'Egresados UNI cuentan cómo construyeron su carrera en logística y operaciones.',
      img:ph('sm-ev-4',900,560) },
    { slug:'workshop-excel', title:'Workshop de Excel logístico', tag:'Taller', status:'Pasado',
      date:'30 may 2026', time:'5:00 p. m.', place:'Lab. FIIS — UNI',
      desc:'Modelos de inventarios y transporte en Excel, con casos aplicados.',
      img:ph('sm-ev-5',900,560) },
    { slug:'integracion-2026', title:'Integración SupplyMentum 2026-I', tag:'Interno', status:'Pasado',
      date:'12 abr 2026', time:'10:00 a. m.', place:'Campus UNI',
      desc:'Jornada de bienvenida e integración para los nuevos miembros del centro.',
      img:ph('sm-ev-6',900,560) },
  ],

  /* ─── NOVEDADES (portada) ───────────────────────────────── */
  novedades: [
    { tag:'Convocatoria', date:'15 jul 2026', title:'Abrimos la convocatoria 2026-II',
      desc:'Postula a cualquiera de nuestras seis áreas hasta el 15 de agosto.',
      href:'convocatoria.html', img:ph('sm-nov-1',900,560) },
    { tag:'Evento', date:'10 jul 2026', title:'Supply Summit UNI confirma keynotes',
      desc:'Líderes de la industria confirmados para el congreso anual.',
      href:'evento.html?e=supply-summit-2026', img:ph('sm-nov-2',900,560) },
    { tag:'Alianza', date:'02 jul 2026', title:'Nueva alianza con LogistiPerú',
      desc:'Convenio que abre prácticas y visitas técnicas para miembros.',
      href:'proyecto.html?p=alianza-logistiperu', img:ph('sm-nov-3',900,560) },
    { tag:'Podcast', date:'18 jun 2026', title:'Estrenamos el podcast Cadena Abierta',
      desc:'Un episodio quincenal con profesionales del Supply Chain peruano.',
      href:'proyecto.html?p=cadena-abierta', img:ph('sm-nov-4',900,560) },
  ],

  /* ─── JUNTA DIRECTIVA ───────────────────────────────────── */
  equipo: [
    { name:'Maycol Bendezú', role:'Presidente',      desc:'Dirige el rumbo del centro y su visión estratégica.', img:ph('sm-team-0',600,600) },
    { name:'Diego Ramos',    role:'Vicepresidente',  desc:'Apasionado por operaciones y la formación de nuevos talentos.', img:ph('sm-team-1',600,600) },
    { name:'Lucía Fernández',role:'Dir. Operaciones',desc:'Especialista en logística de eventos y mejora de procesos.', img:ph('sm-team-2',600,600) },
    { name:'Jorge Castillo', role:'Dir. Marketing',  desc:'Construye la voz y la identidad visual de SupplyMentum.', img:ph('sm-team-3',600,600) },
    { name:'Andrea Torres',  role:'Dir. Talento',    desc:'Cuida la cultura y el crecimiento de cada miembro.', img:ph('sm-team-4',600,600) },
    { name:'Renato Vega',    role:'Dir. Corporativas',desc:'Conecta al centro con las empresas líderes del sector.', img:ph('sm-team-5',600,600) },
    { name:'Camila Ríos',    role:'Dir. Proyectos',  desc:'Convierte ideas en proyectos con impacto medible.', img:ph('sm-team-6',600,600) },
    { name:'Diego Salas',    role:'Dir. Tecnología', desc:'Explora datos y automatización aplicados a la logística.', img:ph('sm-team-7',600,600) },
  ],

  /* ─── BENEFICIOS ────────────────────────────────────────── */
  beneficios: [
    { title:'Formación aplicada', desc:'Talleres, casos y visitas técnicas que no encontrarás en clase.' },
    { title:'Red de contactos',   desc:'Conecta con profesionales, egresados y empresas del sector.' },
    { title:'Experiencia real',   desc:'Lidera proyectos y consultorías con impacto medible.' },
    { title:'Desarrollo personal',desc:'Mentorías y feedback constante para crecer más rápido.' },
    { title:'Comunidad',          desc:'Un equipo que aprende, celebra y crece contigo.' },
    { title:'Marca personal',     desc:'Visibilidad ante reclutadores y líderes del Supply Chain.' },
  ],

  /* ─── CONVOCATORIA ──────────────────────────────────────── */
  convocatoria: {
    activa: true,
    ciclo: 'Convocatoria 2026-II',
    cierre: '2026-08-15T23:59:59-05:00',        // hora de Perú
    cierreTexto: '15 de agosto de 2026 · 11:59 p. m.',
    formulario: '#',                             // ← pega aquí el enlace del formulario
    img: ph('sm-convocatoria', 1800, 1000),
  },
};

/* Búsquedas por slug, usadas por las páginas de detalle */
SM.buscarArea     = (slug) => SM.areas.find(a => a.slug === slug)     || SM.areas[0];
SM.buscarProyecto = (slug) => SM.proyectos.find(p => p.slug === slug) || SM.proyectos[0];
SM.buscarEvento   = (slug) => SM.eventos.find(e => e.slug === slug)   || SM.eventos[0];

/* Áreas usadas como filtro en el catálogo de proyectos */
SM.areasProyecto = ['Todos', ...new Set(SM.proyectos.map(p => p.area))];
