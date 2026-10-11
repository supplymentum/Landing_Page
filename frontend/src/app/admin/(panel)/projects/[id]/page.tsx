"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, Trash2 } from "lucide-react";

import ProjectForm from "@/components/cms/projects/ProjectForm";
import PageHeader from "@/components/cms/PageHeader";
import {
    type Project,
    getProject,
    removeProject,
} from "@/lib/api/projects";

export default function EditProjectPage() {
    const params = useParams();
    const router = useRouter();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deleting, setDeleting] = useState(false);

    const projectId = Number(params.id);

    useEffect(() => {
        if (!Number.isInteger(projectId) || projectId <= 0) {
            setError("El ID del proyecto no es válido.");
            setLoading(false);
            return;
        }

        async function loadProject() {
            try {
                setLoading(true);
                setError(null);

                const data = await getProject(projectId);

                setProject(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "No se pudo obtener el proyecto.",
                );
            } finally {
                setLoading(false);
            }
        }

        void loadProject();
    }, [projectId]);

    async function handleDelete() {
        if (!project) {
            return;
        }

        const confirmed = window.confirm(
            `¿Deseas eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);

            await removeProject(project.project_id);

            router.push("/admin/projects");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo eliminar el proyecto.",
            );
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return <LoadingState />;
    }

    if (error || !project) {
        return (
            <ErrorState
                message={error ?? "No se encontró el proyecto solicitado."}
            />
        );
    }

    return (
        <>
            <div className="mb-5">
                <Link
                    href="/admin/projects"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 transition-colors hover:text-white"
                >
                    <ArrowLeft size={14} />
                    Volver a proyectos
                </Link>
            </div>

            <PageHeader
                eyebrow="Proyectos"
                title="Editar proyecto"
                description={`Modifica la información de ${project.name}.`}
                action={
                    <button
                        type="button"
                        onClick={() => void handleDelete()}
                        disabled={deleting}
                        className="inline-flex min-h-[42px] items-center justify-center gap-2 border border-red-900/50 bg-red-950/10 px-4 font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.12em] text-red-400 transition-colors hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {deleting ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <Trash2 size={15} />
                        )}
                        Eliminar
                    </button>
                }
            />

            {error && (
                <div className="mb-5 border border-red-900/50 bg-red-950/20 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            <div className="mx-auto max-w-5xl">
                <ProjectForm mode="edit" initialData={project} />
            </div>
        </>
    );
}

function LoadingState() {
    return (
        <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
            <Loader2 size={28} className="animate-spin text-[#ED1C24]" />

            <p className="mt-4 text-sm font-semibold text-zinc-400">
                Cargando proyecto...
            </p>
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="flex min-h-[450px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-red-900/40 bg-red-950/20">
                <AlertCircle size={21} className="text-red-500" />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-300">
                No se pudo cargar el proyecto
            </p>

            <p className="mt-2 max-w-md text-xs leading-5 text-zinc-600">
                {message}
            </p>

            <Link href="/admin/projects" className="cms-button-secondary mt-5">
                <ArrowLeft size={14} />
                Volver a proyectos
            </Link>
        </div>
    );
}
