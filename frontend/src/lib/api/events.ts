import type { Event as DisplayEvent } from "@/types/event";

export interface EventRecord {
  event_id: number;
  title: string;
  description: string;
  location: string;
  image_path: string | null;
  image_url: string | null;
  registration_link: string | null;
  summary_link: string | null;
  start_date_time: string;
  is_active: boolean;
  starred: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EventPayload {
  title: string;
  description: string;
  location: string;
  image_path?: string | null;
  registration_link?: string | null;
  summary_link?: string | null;
  start_date_time: string;
  is_active?: boolean;
  starred?: boolean;
}

export type UpdateEventPayload = Partial<EventPayload>;

export interface RemoveEventResponse {
  message: string;
  event_id: number;
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
 * Obtiene los eventos públicos, ordenados por destacado,
 * inscripciones abiertas y fecha.
 */
export async function getPublicEvents(): Promise<EventRecord[]> {
  return apiRequest<EventRecord[]>("/events");
}

/**
 * Obtiene un evento público por ID.
 */
export async function getPublicEvent(eventId: number): Promise<EventRecord> {
  return apiRequest<EventRecord>(`/events/${eventId}`);
}

/**
 * Obtiene todos los eventos para el CMS.
 */
export async function getEvents(): Promise<EventRecord[]> {
  return apiRequest<EventRecord[]>("/admin/events");
}

/**
 * Obtiene un evento específico mediante su ID.
 */
export async function getEvent(eventId: number): Promise<EventRecord> {
  return apiRequest<EventRecord>(`/admin/events/${eventId}`);
}

/**
 * Crea un nuevo evento.
 */
export async function createEvent(
  payload: EventPayload,
): Promise<EventRecord> {
  return apiRequest<EventRecord>("/admin/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Actualiza parcialmente un evento existente.
 */
export async function updateEvent(
  eventId: number,
  payload: UpdateEventPayload,
): Promise<EventRecord> {
  return apiRequest<EventRecord>(`/admin/events/${eventId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Elimina un evento.
 */
export async function removeEvent(
  eventId: number,
): Promise<RemoveEventResponse> {
  return apiRequest<RemoveEventResponse>(`/admin/events/${eventId}`, {
    method: "DELETE",
  });
}

/**
 * Imagen de respaldo mientras un evento no tenga una propia subida
 * al CMS. Evita pasar src="" al navegador.
 */
export const FALLBACK_EVENT_IMAGE = "/images/warehouse.png";

const DATE_FORMATTER = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "America/Lima",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("es-PE", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/Lima",
});

/**
 * Convierte un evento del backend al formato que consumen
 * los componentes visuales (EventCard, FeaturedEvent).
 *
 * El estado PRÓXIMO/PASADO se deriva de la fecha de inicio,
 * no de `is_active` (que indica si las inscripciones están
 * abiertas).
 */
export function toDisplayEvent(event: EventRecord): DisplayEvent {
  const startDate = new Date(event.start_date_time);
  const isUpcoming = startDate.getTime() >= Date.now();

  return {
    id: String(event.event_id),
    title: event.title,
    description: event.description,
    date: DATE_FORMATTER.format(startDate).replace(".", "").toUpperCase(),
    time: TIME_FORMATTER.format(startDate),
    location: event.location,
    status: isUpcoming ? "PRÓXIMO" : "PASADO",
    imageUrl: event.image_url ?? FALLBACK_EVENT_IMAGE,
    registrationLink: event.registration_link ?? undefined,
  };
}
