export interface ExecutiveRole {
  role_id: number;
  name: string;
  sort_order: number;
  is_active: boolean;
}

export interface ExecutiveArea {
  area_id: number;
  name: string;
  short_name: string | null;
}

export interface Executive {
  executive_id: number;
  full_name: string;
  role_id: number;
  area_id: number | null;
  description: string | null;
  image_path: string | null;
  linkedin_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  role?: ExecutiveRole | null;
  area?: ExecutiveArea | null;
}

export interface PublicExecutive {
  executive_id: number;
  full_name: string;
  role_id: number;
  area_id: number | null;
  description: string | null;
  image_path: string | null;
  image_url: string | null;
  linkedin_url: string | null;
  sort_order: number;
  role?: ExecutiveRole | null;
  area?: ExecutiveArea | null;
}

export interface CreateExecutivePayload {
  full_name: string;
  role_id: number;
  area_id?: number | null;
  description?: string | null;
  image_path?: string | null;
  linkedin_url?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export type UpdateExecutivePayload = Partial<CreateExecutivePayload>;

export interface RemoveExecutiveResponse {
  message: string;
  executive: Executive;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

/**
 * Ejecuta una petición al backend del CMS.
 *
 * credentials: "include" permite enviar la cookie
 * de autenticación utilizada por los endpoints administrativos.
 */
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
      // La respuesta del servidor no contiene JSON válido.
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
 * Obtiene los directivos visibles en la landing pública.
 */
export async function getPublicExecutives(): Promise<PublicExecutive[]> {
  return apiRequest<PublicExecutive[]>("/executives");
}

/**
 * Obtiene un directivo visible específico.
 */
export async function getPublicExecutive(
  executiveId: number,
): Promise<PublicExecutive> {
  return apiRequest<PublicExecutive>(`/executives/${executiveId}`);
}

/**
 * Obtiene todos los directivos para el panel administrativo,
 * incluyendo los que se encuentran desactivados.
 */
export async function getExecutives(): Promise<Executive[]> {
  return apiRequest<Executive[]>("/admin/executives");
}

/**
 * Obtiene un directivo específico mediante su ID.
 */
export async function getExecutive(executiveId: number): Promise<Executive> {
  return apiRequest<Executive>(`/admin/executives/${executiveId}`);
}

/**
 * Crea un nuevo directivo.
 */
export async function createExecutive(
  payload: CreateExecutivePayload,
): Promise<Executive> {
  return apiRequest<Executive>("/admin/executives", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Actualiza parcialmente un directivo existente.
 */
export async function updateExecutive(
  executiveId: number,
  payload: UpdateExecutivePayload,
): Promise<Executive> {
  return apiRequest<Executive>(`/admin/executives/${executiveId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Desactiva un directivo.
 *
 * El backend realiza un soft delete estableciendo
 * is_active = false; no elimina el registro físicamente.
 */
export async function removeExecutive(
  executiveId: number,
): Promise<RemoveExecutiveResponse> {
  return apiRequest<RemoveExecutiveResponse>(
    `/admin/executives/${executiveId}`,
    {
      method: "DELETE",
    },
  );
}
