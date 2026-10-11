"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Image as ImageIcon,
    Loader2,
    RefreshCw,
    Trash2,
} from "lucide-react";

import PageHeader from "@/components/cms/PageHeader";

import {
    MEDIA_RESOURCES,
    type ListedMedia,
    type MediaResource,
    deleteMedia,
    getMedia,
} from "@/lib/api/media";

type ResourceFilter = "all" | MediaResource;

const RESOURCE_LABELS: Record<MediaResource, string> = {
    areas: "Áreas",
    events: "Eventos",
    executives: "Directivos",
    projects: "Proyectos",
};

function formatBytes(bytes: number | null) {
    if (bytes === null) {
        return "—";
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string | null) {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat("es-PE", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function MediaPage() {
    const [media, setMedia] = useState<ListedMedia[]>([]);
    const [filter, setFilter] =
        useState<ResourceFilter>("all");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [deletingPath, setDeletingPath] =
        useState<string | null>(null);

    const [error, setError] =
        useState<string | null>(null);

    const loadMedia = useCallback(
        async (showRefreshing = false) => {
            try {
                if (showRefreshing) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError(null);

                const resource =
                    filter === "all"
                        ? undefined
                        : filter;

                const data =
                    await getMedia(resource);

                setMedia(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "No se pudo cargar el contenido multimedia.",
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [filter],
    );

    useEffect(() => {
        void loadMedia();
    }, [loadMedia]);

    const totals = useMemo(() => {
        const result: Record<
            MediaResource,
            number
        > = {
            areas: 0,
            events: 0,
            executives: 0,
            projects: 0,
        };

        media.forEach((item) => {
            result[item.resource] += 1;
        });

        return result;
    }, [media]);

    async function handleDelete(
        item: ListedMedia,
    ) {
        const confirmed =
            window.confirm(
                `¿Seguro que deseas eliminar esta imagen?\n\n${item.image_path}`,
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingPath(item.image_path);
            setError(null);

            await deleteMedia(
                item.image_path,
            );

            setMedia((current) =>
                current.filter(
                    (mediaItem) =>
                        mediaItem.image_path !==
                        item.image_path,
                ),
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo eliminar la imagen.",
            );
        } finally {
            setDeletingPath(null);
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Contenido"
                title="Multimedia"
                description="Administra las imágenes almacenadas en el CMS."
                action={
                    <button
                        type="button"
                        onClick={() =>
                            void loadMedia(true)
                        }
                        disabled={
                            refreshing ||
                            loading
                        }
                        className="cms-button-secondary"
                    >
                        {refreshing ? (
                            <Loader2
                                size={15}
                                className="animate-spin"
                            />
                        ) : (
                            <RefreshCw
                                size={15}
                            />
                        )}

                        Actualizar
                    </button>
                }
            />

            {error && (
                <div className="border border-red-900/50 bg-red-950/20 px-4 py-3">
                    <p className="text-sm text-red-400">
                        {error}
                    </p>
                </div>
            )}

            <section className="border border-[#22222A] bg-[#111115]">
                <div className="border-b border-[#22222A] px-5 py-4 sm:px-6">
                    <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                        Biblioteca
                    </p>

                    <h2 className="mt-1 text-base font-semibold text-zinc-200">
                        Archivos multimedia
                    </h2>
                </div>

                <div className="flex flex-wrap gap-2 border-b border-[#22222A] p-5 sm:p-6">
                    <button
                        type="button"
                        onClick={() =>
                            setFilter("all")
                        }
                        className={`border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${filter === "all"
                                ? "border-[#ED1C24] bg-[#ED1C24]/10 text-[#ED1C24]"
                                : "border-[#292930] bg-[#121216] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                            }`}
                    >
                        Todos
                    </button>

                    {MEDIA_RESOURCES.map(
                        (resource) => (
                            <button
                                key={resource}
                                type="button"
                                onClick={() =>
                                    setFilter(
                                        resource,
                                    )
                                }
                                className={`border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${filter === resource
                                        ? "border-[#ED1C24] bg-[#ED1C24]/10 text-[#ED1C24]"
                                        : "border-[#292930] bg-[#121216] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                                    }`}
                            >
                                {
                                    RESOURCE_LABELS[
                                    resource
                                    ]
                                }

                                {filter === "all" && (
                                    <span className="ml-2 text-[10px] text-zinc-700">
                                        {
                                            totals[
                                            resource
                                            ]
                                        }
                                    </span>
                                )}
                            </button>
                        ),
                    )}
                </div>

                {loading ? (
                    <div className="flex min-h-[320px] items-center justify-center">
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                            <Loader2
                                size={18}
                                className="animate-spin"
                            />

                            Cargando multimedia...
                        </div>
                    </div>
                ) : media.length === 0 ? (
                    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center border border-[#292930] bg-[#121216]">
                            <ImageIcon
                                size={20}
                                className="text-zinc-600"
                            />
                        </div>

                        <h3 className="text-sm font-semibold text-zinc-300">
                            No hay imágenes
                        </h3>

                        <p className="mt-2 max-w-md text-xs leading-5 text-zinc-600">
                            Las imágenes que subas desde áreas, eventos,
                            directivos o proyectos aparecerán aquí.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-px bg-[#22222A] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {media.map(
                            (item) => (
                                <article
                                    key={
                                        item.image_path
                                    }
                                    className="group bg-[#111115]"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-[#09090B]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={
                                                item.image_url
                                            }
                                            alt={
                                                item.name
                                            }
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                        />

                                        <div className="absolute left-3 top-3 border border-[#292930] bg-[#09090B]/90 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-400 backdrop-blur-sm">
                                            {
                                                RESOURCE_LABELS[
                                                item.resource
                                                ]
                                            }
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                void handleDelete(
                                                    item,
                                                )
                                            }
                                            disabled={
                                                deletingPath ===
                                                item.image_path
                                            }
                                            title="Eliminar imagen"
                                            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-red-900/50 bg-[#09090B]/90 text-red-500 opacity-100 transition-all hover:border-red-700 hover:bg-red-950/60 disabled:cursor-not-allowed disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                                        >
                                            {deletingPath ===
                                                item.image_path ? (
                                                <Loader2
                                                    size={15}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Trash2
                                                    size={15}
                                                />
                                            )}
                                        </button>
                                    </div>

                                    <div className="space-y-3 p-4">
                                        <div>
                                            <p
                                                className="truncate text-sm font-medium text-zinc-300"
                                                title={
                                                    item.name
                                                }
                                            >
                                                {
                                                    item.name
                                                }
                                            </p>

                                            <p
                                                className="mt-1 truncate font-mono text-[10px] text-zinc-700"
                                                title={
                                                    item.image_path
                                                }
                                            >
                                                {
                                                    item.image_path
                                                }
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 border-t border-[#22222A] pt-3">
                                            <span className="text-[10px] text-zinc-600">
                                                {formatBytes(
                                                    item.size,
                                                )}
                                            </span>

                                            <span className="text-right text-[10px] text-zinc-700">
                                                {formatDate(
                                                    item.created_at,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ),
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}