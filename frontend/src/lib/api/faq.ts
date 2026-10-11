export interface Faq {
  faq_id: number;
  pregunta: string;
  respuesta: string;
  orden: number;
}

export interface FaqPayload {
  pregunta: string;
  respuesta: string;
}

export interface ReorderFaqPayload {
  faq_id: number;
  orden: number;
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
 * Obtiene las preguntas frecuentes ordenadas para mostrarlas
 * públicamente.
 */
export async function getFaqs(): Promise<Faq[]> {
  return apiRequest<Faq[]>("/faq");
}

/**
 * Crea una nueva pregunta frecuente.
 */
export async function createFaq(payload: FaqPayload): Promise<Faq> {
  return apiRequest<Faq>("/admin/faq", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Actualiza una pregunta frecuente existente.
 */
export async function updateFaq(
  id: number,
  payload: FaqPayload,
): Promise<Faq> {
  return apiRequest<Faq>(`/admin/faq/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Elimina una pregunta frecuente.
 */
export async function removeFaq(id: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/admin/faq/${id}`, {
    method: "DELETE",
  });
}

/**
 * Actualiza el orden de despliegue de varias preguntas
 * frecuentes a la vez.
 */
export async function reorderFaqs(
  payload: ReorderFaqPayload[],
): Promise<Faq[]> {
  return apiRequest<Faq[]>("/admin/faq", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
