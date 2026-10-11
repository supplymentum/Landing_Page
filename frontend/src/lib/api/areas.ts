export interface Area {
  area_id: number;
  name: string;
  short_name: string | null;
  description: string | null;
  image_path: string | null;

  icon_key: string | null;

  activities: string[];
  requirements: string[];

  is_active: boolean;
  sort_order: number;

  created_at?: string;
  updated_at?: string;
}

export interface CreateAreaPayload {
  name: string;
  short_name?: string | null;
  description?: string | null;
  image_path?: string | null;

  icon_key?: string | null;

  activities?: string[];
  requirements?: string[];

  is_active?: boolean;
  sort_order?: number;
}

export type UpdateAreaPayload = Partial<CreateAreaPayload>;

export interface RemoveAreaResponse {
  message?: string;
  area?: Area;
}

export interface PublicArea {
  area_id: number;
  name: string;
  short_name: string | null;
  description: string | null;
  image_path: string | null;
  image_url: string | null;

  icon_key: string | null;

  activities: string[];
  requirements: string[];

  sort_order: number;
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
 * Obtiene las áreas activas para la landing pública.
 */
export async function getPublicAreas(): Promise<PublicArea[]> {
  return apiRequest<PublicArea[]>("/areas");
}

/**
 * Obtiene un área activa específica por ID.
 */
export async function getPublicArea(areaId: number): Promise<PublicArea> {
  return apiRequest<PublicArea>(`/areas/${areaId}`);
}

/**
 * Obtiene todas las áreas para el CMS,
 * incluyendo las desactivadas.
 */
export async function getAreas(): Promise<Area[]> {
  return apiRequest<Area[]>("/admin/areas");
}

/**
 * Obtiene un área específica mediante su ID.
 */
export async function getArea(areaId: number): Promise<Area> {
  return apiRequest<Area>(`/admin/areas/${areaId}`);
}

/**
 * Crea una nueva área.
 */
export async function createArea(payload: CreateAreaPayload): Promise<Area> {
  return apiRequest<Area>("/admin/areas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Actualiza parcialmente un área existente.
 */
export async function updateArea(
  areaId: number,
  payload: UpdateAreaPayload,
): Promise<Area> {
  return apiRequest<Area>(`/admin/areas/${areaId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Desactiva un área.
 */
export async function removeArea(areaId: number): Promise<RemoveAreaResponse> {
  return apiRequest<RemoveAreaResponse>(`/admin/areas/${areaId}`, {
    method: "DELETE",
  });
}
