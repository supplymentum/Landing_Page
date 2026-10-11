export interface Project {
  project_id: number;
  name: string;
  slug: string;
  area: string;
  year: number;
  description: string | null;
  image_path: string | null;
  image_url: string | null;
  starred: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProjectPayload {
  name: string;
  slug: string;
  area: string;
  year: number;
  description?: string | null;
  image_path?: string | null;
  starred?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

export interface RemoveProjectResponse {
  message: string;
  project_id: number;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;

    try {
      errorData = (await response.json()) as ApiErrorResponse;
    } catch {
      // La respuesta no contiene JSON válido.
    }

    let message = `Error ${response.status}: ${response.statusText}`;

    if (errorData?.message) {
      message = Array.isArray(errorData.message)
        ? errorData.message.join(", ")
        : errorData.message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/**
 * Imágenes de respaldo por categoría, usadas mientras un proyecto
 * no tenga una imagen propia subida al CMS.
 */
const FALLBACK_IMAGES: Record<string, string> = {
  Consultoría: "/images/warehouse.png",
  Operaciones: "/images/warehouse.png",
  Tecnología: "/images/iot.png",
  Marketing: "/images/marketing.png",
  Corporativas: "/images/marketing.png",
  Talento: "/images/talent.png",
};

/**
 * Devuelve la imagen a mostrar para un proyecto: la subida al CMS
 * si existe, o la de respaldo según su categoría.
 */
export function getProjectImage(project: Project): string {
  return (
    project.image_url ??
    FALLBACK_IMAGES[project.area] ??
    "/images/warehouse.png"
  );
}

/**
 * Obtiene los proyectos activos para la landing.
 */
export async function getPublicProjects(): Promise<Project[]> {
  return apiRequest<Project[]>("/projects");
}

/**
 * Obtiene un proyecto activo por su slug.
 */
export async function getPublicProject(slug: string): Promise<Project> {
  return apiRequest<Project>(`/projects/${slug}`);
}

/**
 * Obtiene todos los proyectos para el CMS.
 */
export async function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>("/admin/projects");
}

/**
 * Obtiene un proyecto específico mediante su ID.
 */
export async function getProject(projectId: number): Promise<Project> {
  return apiRequest<Project>(`/admin/projects/${projectId}`);
}

/**
 * Crea un nuevo proyecto.
 */
export async function createProject(
  payload: CreateProjectPayload,
): Promise<Project> {
  return apiRequest<Project>("/admin/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Actualiza parcialmente un proyecto existente.
 */
export async function updateProject(
  projectId: number,
  payload: UpdateProjectPayload,
): Promise<Project> {
  return apiRequest<Project>(`/admin/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Elimina un proyecto.
 */
export async function removeProject(
  projectId: number,
): Promise<RemoveProjectResponse> {
  return apiRequest<RemoveProjectResponse>(`/admin/projects/${projectId}`, {
    method: "DELETE",
  });
}
