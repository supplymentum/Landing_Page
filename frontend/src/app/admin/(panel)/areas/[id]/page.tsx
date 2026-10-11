"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    AlertCircle,
    ArrowLeft,
    Loader2,
    Trash2,
} from "lucide-react";

import AreaForm from "@/components/cms/areas/AreaForm";
import PageHeader from "@/components/cms/PageHeader";
import {
    type Area,
    getArea,
    removeArea,
} from "@/lib/api/areas";

export default function EditAreaPage() {
    const params = useParams();
    const router = useRouter();

    const [area, setArea] = useState<Area | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deactivating, setDeactivating] =
        useState(false);

    const areaId = Number(params.id);

    useEffect(() => {
        if (
            !Number.isInteger(areaId) ||
            areaId <= 0
        ) {
            setError("El ID del área no es válido.");
            setLoading(false);
            return;
        }

        async function loadArea() {
            try {
                setLoading(true);
                setError(null);

                const data = await getArea(areaId);

                setArea(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "No se pudo obtener el área.",
                );
            } finally {
                setLoading(false);
            }
        }

        void loadArea();
    }, [areaId]);

    async function handleDeactivate() {
        if (!area || !area.is_active) {
            return;
        }

        const confirmed = window.confirm(
            `¿Deseas desactivar el área "${area.name}"?\n\nEl registro no será eliminado de la base de datos.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeactivating(true);
            setError(null);

            await removeArea(area.area_id);

            router.push("/admin/areas");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo desactivar el área.",
            );
        } finally {
            setDeactivating(false);
        }
    }

    if (loading) {
        return <LoadingState />;
    }

    if (error || !area) {
        return (
            <ErrorState
                message={
                    error ??
                    "No se encontró el área solicitada."
                }
            />
        );
    }

    return (
        <>
            <div className="mb-5">
                <Link
                    href="/admin/areas"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 transition-colors hover:text-white"
                >
                    <ArrowLeft size={14} />
                    Volver a áreas
                </Link>
            </div>

            <PageHeader
                eyebrow="Áreas"
                title="Editar área"
                description={`Modifica la información de ${area.name}.`}
                action={
                    area.is_active ? (
                        <button
                            type="button"
                            onClick={() =>
                                void handleDeactivate()
                            }
                            disabled={deactivating}
                            className="inline-flex min-h-[42px] items-center justify-center gap-2 border border-red-900/50 bg-red-950/10 px-4 font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.12em] text-red-400 transition-colors hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {deactivating ? (
                                <Loader2
                                    size={15}
                                    className="animate-spin"
                                />
                            ) : (
                                <Trash2 size={15} />
                            )}

                            Desactivar
                        </button>
                    ) : (
                        <span className="inline-flex min-h-[42px] items-center border border-[#303037] bg-[#151519] px-4 font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-600">
                            Área inactiva
                        </span>
                    )
                }
            />

            {error && (
                <div className="mb-5 border border-red-900/50 bg-red-950/20 px-4 py-3">
                    <p className="text-sm text-red-400">
                        {error}
                    </p>
                </div>
            )}

            <div className="mx-auto max-w-5xl">
                <AreaForm
                    mode="edit"
                    initialData={area}
                />
            </div>
        </>
    );
}

function LoadingState() {
    return (
        <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
            <Loader2
                size={28}
                className="animate-spin text-[#ED1C24]"
            />

            <p className="mt-4 text-sm font-semibold text-zinc-400">
                Cargando área...
            </p>

            <p className="mt-1 text-xs text-zinc-700">
                Consultando información del CMS.
            </p>
        </div>
    );
}

function ErrorState({
    message,
}: {
    message: string;
}) {
    return (
        <div className="flex min-h-[450px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-red-900/40 bg-red-950/20">
                <AlertCircle
                    size={21}
                    className="text-red-500"
                />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-300">
                No se pudo cargar el área
            </p>

            <p className="mt-2 max-w-md text-xs leading-5 text-zinc-600">
                {message}
            </p>

            <Link
                href="/admin/areas"
                className="cms-button-secondary mt-5"
            >
                <ArrowLeft size={14} />
                Volver a áreas
            </Link>
        </div>
    );
}