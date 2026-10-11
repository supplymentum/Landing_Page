export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface AdminSessionResponse {
  message: string;
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
 * Inicia sesión como administrador.
 *
 * El backend almacena el JWT en una cookie httpOnly llamada admin_token.
 */
export async function loginAdmin(
  payload: LoginPayload,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Cierra la sesión administrativa y elimina admin_token.
 */
export async function logoutAdmin(): Promise<LogoutResponse> {
  return apiRequest<LogoutResponse>("/admin/logout", {
    method: "POST",
  });
}

/**
 * Comprueba si existe una sesión administrativa válida.
 *
 * /admin/dashboard está protegido con JwtAuthGuard,
 * por lo que un 200 implica que admin_token es válido.
 */
export async function checkAdminSession(): Promise<boolean> {
  try {
    await apiRequest<AdminSessionResponse>("/admin/dashboard");

    return true;
  } catch {
    return false;
  }
}
