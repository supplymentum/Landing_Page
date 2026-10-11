export const AREA_ICON_PATHS = {
  operaciones: ["M21 8l-9-5-9 5v8l9 5 9-5V8z", "M3 8l9 5 9-5", "M12 13v8"],

  marketing: ["M3 11l18-7-4 16-6-3-3 4-1-6-4-4z"],

  talento: [
    "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    "M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2",
    "M17 3.5a4 4 0 0 1 0 7",
    "M19.5 14.5a5 5 0 0 1 2.5 4.5v2",
  ],

  corporativas: [
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
    "M2 12h20",
    "M12 2c3 3.3 3 16.7 0 20",
    "M12 2c-3 3.3-3 16.7 0 20",
  ],

  proyectos: [
    "M3 8h18v12H3V8z",
    "M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    "M3 13h18",
  ],

  tecnologia: [
    "M5 5h14v14H5V5z",
    "M9 9h6v6H9V9z",
    "M12 2v3",
    "M12 19v3",
    "M2 12h3",
    "M19 12h3",
  ],
} as const;

export type AreaIconKey = keyof typeof AREA_ICON_PATHS;

export const AREA_ICON_OPTIONS: Array<{
  value: AreaIconKey;
  label: string;
}> = [
  {
    value: "operaciones",
    label: "Operaciones & Logística",
  },
  {
    value: "marketing",
    label: "Marketing & Contenidos",
  },
  {
    value: "talento",
    label: "Gestión del Talento",
  },
  {
    value: "corporativas",
    label: "Relaciones Corporativas",
  },
  {
    value: "proyectos",
    label: "Proyectos & Consultoría",
  },
  {
    value: "tecnologia",
    label: "Innovación & Tecnología",
  },
];
