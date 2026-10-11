import { getAccessToken } from "@/lib/supabase";

export type ApplicantStatus = "pendiente" | "aceptado" | "rechazado";

export interface ApplicationArea {
  area_id: number;
  name: string;
}

export interface ApplicationPayload {
  first_name: string;
  last_name: string;
  phone: string;
  career: string;
  codigo_uni: string;
  university_semester: string;
  application_reason: string;
  first_choice_area_id: number;
  second_choice_area_id?: number;
}

export interface Applicant extends ApplicationPayload {
  applicant_id?: string;
  /** Lo define la sesión de Google, no el formulario. */
  email: string;
  status: ApplicantStatus;
  created_at?: string;
}

export interface MyApplicationResponse {
  has_applied: boolean;
  application: {
    applicant_id: string;
    first_name: string;
    last_name: string;
    email: string;
    status: ApplicantStatus;
    created_at: string;
  } | null;
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
 * Igual que apiRequest, pero adjunta el token de la sesión de Google
 * del postulante.
 */
async function authedRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Debes iniciar sesión con Google para continuar.");
  }

  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Áreas disponibles para elegir en el formulario de postulación.
 */
export async function getApplicationAreas(): Promise<ApplicationArea[]> {
  return apiRequest<ApplicationArea[]>("/application/areas");
}

/**
 * Consulta si la cuenta autenticada ya envió una postulación.
 */
export async function getMyApplication(): Promise<MyApplicationResponse> {
  return authedRequest<MyApplicationResponse>("/application/me");
}

/**
 * Envía una postulación a la convocatoria. Requiere sesión de Google
 * y solo se permite una por cuenta.
 */
export async function sendApplication(
  payload: ApplicationPayload,
): Promise<Applicant> {
  return authedRequest<Applicant>("/application", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Lista los postulantes registrados. Requiere sesión de admin.
 */
export async function getApplicants(): Promise<Applicant[]> {
  return apiRequest<Applicant[]>("/admin/applicants");
}

/**
 * Cambia el estado de revisión de una postulación.
 */
export async function updateApplicantStatus(
  applicantId: string,
  status: ApplicantStatus,
): Promise<Applicant> {
  return apiRequest<Applicant>(`/admin/applicants/${applicantId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/**
 * Elimina definitivamente una postulación.
 */
export async function removeApplicant(
  applicantId: string,
): Promise<{ message: string; applicant_id: string }> {
  return apiRequest<{ message: string; applicant_id: string }>(
    `/admin/applicants/${applicantId}`,
    { method: "DELETE" },
  );
}
