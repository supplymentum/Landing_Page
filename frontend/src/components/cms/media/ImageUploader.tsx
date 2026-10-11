"use client";

import {
    ChangeEvent,
    useEffect,
    useState,
} from "react";
import {
    AlertCircle,
    ImageIcon,
    Loader2,
    Trash2,
    Upload,
} from "lucide-react";

import {
    type MediaResource,
    deleteMedia,
    getMediaUrl,
    uploadMedia,
} from "@/lib/api/media";

interface ImageUploaderProps {
    resource: MediaResource;
    value: string | null;
    onChange: (imagePath: string | null) => void;
    disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export default function ImageUploader({
    resource,
    value,
    onChange,
    disabled = false,
}: ImageUploaderProps) {
    const [uploading, setUploading] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [previewUrl, setPreviewUrl] =
        useState<string | null>(null);

    const busy = uploading || deleting || disabled;

    const [storedImageUrl, setStoredImageUrl] =
        useState<string | null>(null);

    const [loadingPreview, setLoadingPreview] =
        useState(false);

    useEffect(() => {
        if (!value) {
            setStoredImageUrl(null);
            setPreviewUrl(null);
            setLoadingPreview(false);
            return;
        }

        let cancelled = false;
        const imagePath = value;

        async function loadStoredImage() {
            try {
                setLoadingPreview(true);

                const media = await getMediaUrl(imagePath);

                if (!cancelled) {
                    setStoredImageUrl(media.image_url);
                }
            } catch {
                if (!cancelled) {
                    setStoredImageUrl(null);
                }
            } finally {
                if (!cancelled) {
                    setLoadingPreview(false);
                }
            }
        }

        void loadStoredImage();

        return () => {
            cancelled = true;
        };
    }, [value]);

    const displayedImage =
        previewUrl ?? storedImageUrl;

    async function handleFileChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file =
            event.target.files?.[0];

        event.target.value = "";

        if (!file) {
            return;
        }

        setError(null);

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError(
                "Solo se permiten imágenes JPG, PNG o WEBP.",
            );
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError(
                "La imagen no puede superar los 5 MB.",
            );
            return;
        }

        const localPreview =
            URL.createObjectURL(file);

        setPreviewUrl(localPreview);

        try {
            setUploading(true);

            const uploaded =
                await uploadMedia(file, resource);

            onChange(uploaded.image_path);

            URL.revokeObjectURL(localPreview);

            setStoredImageUrl(uploaded.image_url);
            setPreviewUrl(uploaded.image_url);
        } catch (err) {
            URL.revokeObjectURL(localPreview);
            setPreviewUrl(null);

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo subir la imagen.",
            );
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete() {
        if (!value) {
            setPreviewUrl(null);
            return;
        }

        const confirmed = window.confirm(
            "¿Deseas eliminar esta imagen del almacenamiento?",
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);

            await deleteMedia(value);

            setPreviewUrl(null);
            setStoredImageUrl(null);
            onChange(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo eliminar la imagen.",
            );
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="flex gap-3 border border-red-900/50 bg-red-950/20 px-4 py-3">
                    <AlertCircle
                        size={17}
                        className="mt-0.5 shrink-0 text-red-500"
                    />

                    <p className="text-sm leading-5 text-red-400">
                        {error}
                    </p>
                </div>
            )}

            <div className="border border-[#292930] bg-[#0D0D10]">
                {displayedImage ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={displayedImage}
                            alt="Vista previa"
                            className="h-full w-full object-cover"
                        />

                        {loadingPreview && !previewUrl && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                <Loader2
                                    size={22}
                                    className="animate-spin text-[#ED1C24]"
                                />
                            </div>
                        )}

                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                <div className="text-center">
                                    <Loader2
                                        size={24}
                                        className="mx-auto animate-spin text-[#ED1C24]"
                                    />

                                    <p className="mt-3 text-xs font-semibold text-zinc-300">
                                        Subiendo imagen...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : loadingPreview ? (
                    <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
                        <Loader2
                            size={24}
                            className="animate-spin text-[#ED1C24]"
                        />

                        <p className="mt-3 text-xs font-semibold text-zinc-400">
                            Cargando imagen...
                        </p>
                    </div>
                ) : (
                    <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
                        <div className="flex h-12 w-12 items-center justify-center border border-[#292930] bg-[#141418]">
                            <ImageIcon
                                size={21}
                                className="text-zinc-600"
                            />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-zinc-400">
                            Sin imagen
                        </p>

                        <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-700">
                            Sube una imagen JPG, PNG o WEBP de hasta 5 MB.
                        </p>
                    </div>
                )}
            </div>

            {value && (
                <div className="border border-[#22222A] bg-[#0D0D10] px-4 py-3">
                    <p className="font-[family-name:var(--font-archivo)] text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-700">
                        Ruta almacenada
                    </p>

                    <p className="mt-1 break-all font-mono text-[11px] leading-5 text-zinc-500">
                        {value}
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
                <label
                    className={`
            cms-button-secondary cursor-pointer
            ${busy
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
          `}
                >
                    {uploading ? (
                        <Loader2
                            size={15}
                            className="animate-spin"
                        />
                    ) : (
                        <Upload size={15} />
                    )}

                    {value
                        ? "Reemplazar imagen"
                        : "Subir imagen"}

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) =>
                            void handleFileChange(event)
                        }
                        disabled={busy}
                        className="hidden"
                    />
                </label>

                {value && (
                    <button
                        type="button"
                        onClick={() =>
                            void handleDelete()
                        }
                        disabled={busy}
                        className="inline-flex min-h-[42px] items-center justify-center gap-2 border border-red-900/50 bg-red-950/10 px-4 font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.12em] text-red-400 transition-colors hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deleting ? (
                            <Loader2
                                size={15}
                                className="animate-spin"
                            />
                        ) : (
                            <Trash2 size={15} />
                        )}

                        Eliminar imagen
                    </button>
                )}
            </div>

            <p className="text-[11px] leading-5 text-zinc-700">
                Formatos permitidos: JPG, PNG y WEBP. Tamaño máximo: 5 MB.
            </p>
        </div>
    );
}