export interface Role {
  role_id: number;
  name: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRolePayload {
  name: string;
  sort_order?: number;
  is_active?: boolean;
}

export type UpdateRolePayload = Partial<CreateRolePayload>;

export interface RemoveRoleResponse {
  message: string;
  role: Role;
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
 * Obtiene todos los roles disponibles en el CMS,
 * incluyendo roles activos e inactivos.
 */
export async function getRoles(): Promise<Role[]> {
  return apiRequest<Role[]>("/admin/roles");
}

/**
 * Obtiene un rol específico mediante su ID.
 */
export async function getRole(roleId: number): Promise<Role> {
  return apiRequest<Role>(`/admin/roles/${roleId}`);
}

/**
 * Crea un nuevo rol.
 */
export async function createRole(payload: CreateRolePayload): Promise<Role> {
  return apiRequest<Role>("/admin/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Actualiza parcialmente un rol existente.
 */
export async function updateRole(
  roleId: number,
  payload: UpdateRolePayload,
): Promise<Role> {
  return apiRequest<Role>(`/admin/roles/${roleId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Desactiva un rol.
 *
 * El backend realiza un soft delete estableciendo
 * is_active = false.
 */
export async function removeRole(roleId: number): Promise<RemoveRoleResponse> {
  return apiRequest<RemoveRoleResponse>(`/admin/roles/${roleId}`, {
    method: "DELETE",
  });
}
