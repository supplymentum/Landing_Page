export interface ConvocatoriaSettings {
  is_active: boolean;
  deadline: string;
  title: string;
  description: string;
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
    let message = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        message = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message;
      }
    } catch {}
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function getConvocatoriaSettings(): Promise<ConvocatoriaSettings> {
  // Configurado para NO cachear y mostrar los últimos cambios
  return apiRequest<ConvocatoriaSettings>("/settings/convocatoria", {
    cache: "no-store",
  });
}

export async function updateConvocatoriaSettings(
  payload: Partial<ConvocatoriaSettings>,
): Promise<ConvocatoriaSettings> {
  return apiRequest<ConvocatoriaSettings>("/settings/convocatoria", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
