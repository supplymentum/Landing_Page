export const MEDIA_RESOURCES = [
  "areas",
  "events",
  "executives",
  "projects",
] as const;

export type MediaResource = (typeof MEDIA_RESOURCES)[number];

export interface UploadedMedia {
  image_path: string;
  image_url: string;
}

export interface ListedMedia {
  name: string;
  image_path: string;
  image_url: string;
  resource: MediaResource;
  created_at: string | null;
  updated_at: string | null;
  size: number | null;
  mime_type: string | null;
}

export interface DeleteMediaResponse {
  message: string;
  image_path: string;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

/**
 * Extrae un mensaje legible de una respuesta HTTP fallida.
 */
async function getErrorMessage(response: Response): Promise<string> {
  let errorData: ApiErrorResponse | null = null;

  try {
    errorData = (await response.json()) as ApiErrorResponse;
  } catch {
    // La respuesta no contiene JSON válido.
  }

  if (errorData?.message) {
    return Array.isArray(errorData.message)
      ? errorData.message.join(", ")
      : errorData.message;
  }

  return `Error ${response.status}: ${response.statusText}`;
}

/**
 * Lista las imágenes disponibles en el CMS.
 *
 * Si se proporciona resource, filtra por esa categoría.
 */
export async function getMedia(
  resource?: MediaResource,
): Promise<ListedMedia[]> {
  const params = new URLSearchParams();

  if (resource) {
    params.set("resource", resource);
  }

  const query = params.toString();

  const response = await fetch(
    `${API_URL}/admin/media${query ? `?${query}` : ""}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as ListedMedia[];
}

/**
 * Sube una imagen al bucket cms-media mediante el backend.
 *
 * No debe establecerse Content-Type manualmente porque el navegador
 * necesita agregar automáticamente el boundary de multipart/form-data.
 */
export async function uploadMedia(
  file: File,
  resource: MediaResource,
): Promise<UploadedMedia> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("resource", resource);

  const response = await fetch(`${API_URL}/admin/media`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as UploadedMedia;
}

/**
 * Elimina una imagen del bucket cms-media.
 */
export async function deleteMedia(
  imagePath: string,
): Promise<DeleteMediaResponse> {
  const response = await fetch(`${API_URL}/admin/media`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_path: imagePath,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as DeleteMediaResponse;
}

/**
 * Obtiene la URL pública de una imagen almacenada.
 */
export async function getMediaUrl(imagePath: string): Promise<UploadedMedia> {
  const params = new URLSearchParams({
    image_path: imagePath,
  });

  const response = await fetch(
    `${API_URL}/admin/media/url?${params.toString()}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as UploadedMedia;
}
