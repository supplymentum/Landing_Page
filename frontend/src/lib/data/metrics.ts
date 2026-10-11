export interface Metric {
  value: number;
  prefix: string;
  label: string;
}

/**
 * Mock de las cifras del centro. Cuando exista una fuente real (API/CMS),
 * `getMetrics` es el único lugar que hay que tocar — los componentes que la
 * consumen (`MetricsSection`) no cambian.
 */
const MOCK_METRICS: Metric[] = [
  { value: 120, prefix: "+", label: "Miembros activos" },
  { value: 40, prefix: "+", label: "Eventos realizados" },
  { value: 15, prefix: "+", label: "Proyectos ejecutados" },
  { value: 20, prefix: "+", label: "Empresas aliadas" },
];

export async function getMetrics(): Promise<Metric[]> {
  return MOCK_METRICS;
}
