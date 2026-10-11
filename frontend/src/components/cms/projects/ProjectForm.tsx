"use client";

import { FormEvent, useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

import ImageUploader from "@/components/cms/media/ImageUploader";

import {
    type CreateProjectPayload,
    type Project,
    createProject,
    updateProject,
} from "@/lib/api/projects";

interface ProjectFormProps {
    mode: "create" | "edit";
    initialData?: Project;
}

interface ProjectFormState {
    name: string;
    slug: string;
    area: string;
    year: string;
    description: string;
    image_path: string;
    starred: boolean;
    is_active: boolean;
    sort_order: string;
}

/**
 * Genera un slug a partir del nombre: minúsculas, sin tildes
 * y con guiones en lugar de espacios.
 */
function slugify(value: string): string {
    return value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function ProjectForm({
    mode,
    initialData,
}: ProjectFormProps) {
    const router = useRouter();

    const [form, setForm] = useState<ProjectFormState>({
        name: initialData?.name ?? "",
        slug: initialData?.slug ?? "",
        area: initialData?.area ?? "",
        year: String(initialData?.year ?? new Date().getFullYear()),
        description: initialData?.description ?? "",
        image_path: initialData?.image_path ?? "",
        starred: initialData?.starred ?? false,
        is_active: initialData?.is_active ?? true,
        sort_order: String(initialData?.sort_order ?? 0),
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function updateField<K extends keyof ProjectFormState>(
        field: K,
        value: ProjectFormState[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    /* Al escribir el nombre en modo creación, autocompletamos el slug */
    function handleNameChange(value: string) {
        setForm((current) => ({
            ...current,
            name: value,
            slug: mode === "create" ? slugify(value) : current.slug,
        }));
    }

    function validateForm(): string | null {
        if (!form.name.trim()) {
            return "El nombre del proyecto es obligatorio.";
        }

        if (!form.slug.trim()) {
            return "El slug es obligatorio.";
        }

        if (!/^[a-z0-9-]+$/.test(form.slug.trim())) {
            return "El slug solo puede contener minúsculas, números y guiones.";
        }

        if (!form.area.trim()) {
            return "La categoría es obligatoria.";
        }

        const year = Number(form.year);

        if (!Number.isInteger(year) || year < 2000) {
            return "El año debe ser un número válido a partir del 2000.";
        }

        const sortOrder = Number(form.sort_order);

        if (!Number.isInteger(sortOrder) || sortOrder < 0) {
            return "El orden debe ser un número entero mayor o igual a 0.";
        }

        return null;
    }

    function buildPayload(): CreateProjectPayload {
        return {
            name: form.name.trim(),
            slug: form.slug.trim(),
            area: form.area.trim(),
            year: Number(form.year),
            description: form.description.trim() || null,
            image_path: form.image_path.trim() || null,
            starred: form.starred,
            is_active: form.is_active,
            sort_order: Number(form.sort_order),
        };
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const payload = buildPayload();

            if (mode === "create") {
                await createProject(payload);
            } else {
                if (!initialData) {
                    throw new Error(
                        "No se encontró la información del proyecto a editar.",
                    );
                }

                await updateProject(initialData.project_id, payload);
            }

            router.push("/admin/projects");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error al guardar el proyecto.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="border border-red-900/50 bg-red-950/20 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            <section className="border border-[#22222A] bg-[#111115]">
                <div className="border-b border-[#22222A] px-5 py-4 sm:px-6">
                    <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                        Información general
                    </p>

                    <h2 className="mt-1 text-base font-semibold text-zinc-200">
                        Datos del proyecto
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 lg:grid-cols-2">
                    <div className="lg:col-span-2">
                        <label htmlFor="name" className="cms-label">
                            Nombre del proyecto *
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={form.name}
                            onChange={(event) =>
                                handleNameChange(event.target.value)
                            }
                            maxLength={200}
                            className="cms-input"
                            placeholder="Ej. Diagnóstico logístico a mypes de Lima Norte"
                            disabled={submitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="slug" className="cms-label">
                            Slug *
                        </label>

                        <input
                            id="slug"
                            type="text"
                            value={form.slug}
                            onChange={(event) =>
                                updateField("slug", event.target.value)
                            }
                            maxLength={120}
                            className="cms-input"
                            placeholder="diagnostico-mypes"
                            disabled={submitting}
                        />

                        <p className="mt-2 text-[11px] text-zinc-700">
                            Identificador para la URL. Solo minúsculas, números y
                            guiones.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="area" className="cms-label">
                            Categoría *
                        </label>

                        <input
                            id="area"
                            type="text"
                            value={form.area}
                            onChange={(event) =>
                                updateField("area", event.target.value)
                            }
                            maxLength={100}
                            className="cms-input"
                            placeholder="Ej. Consultoría"
                            disabled={submitting}
                        />

                        <p className="mt-2 text-[11px] text-zinc-700">
                            Se usa como filtro en el catálogo público.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="year" className="cms-label">
                            Año *
                        </label>

                        <input
                            id="year"
                            type="number"
                            min={2000}
                            step={1}
                            value={form.year}
                            onChange={(event) =>
                                updateField("year", event.target.value)
                            }
                            className="cms-input"
                            disabled={submitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="sort_order" className="cms-label">
                            Orden de visualización
                        </label>

                        <input
                            id="sort_order"
                            type="number"
                            min={0}
                            step={1}
                            value={form.sort_order}
                            onChange={(event) =>
                                updateField("sort_order", event.target.value)
                            }
                            className="cms-input"
                            disabled={submitting}
                        />

                        <p className="mt-2 text-[11px] text-zinc-700">
                            Los números menores se muestran primero.
                        </p>
                    </div>

                    <div className="lg:col-span-2">
                        <label htmlFor="description" className="cms-label">
                            Descripción
                        </label>

                        <textarea
                            id="description"
                            value={form.description}
                            onChange={(event) =>
                                updateField("description", event.target.value)
                            }
                            rows={5}
                            className="cms-input min-h-[130px] resize-y py-3"
                            placeholder="Describe brevemente en qué consistió el proyecto..."
                            disabled={submitting}
                        />
                    </div>
                </div>
            </section>

            <section className="border border-[#22222A] bg-[#111115]">
                <div className="border-b border-[#22222A] px-5 py-4 sm:px-6">
                    <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                        Multimedia
                    </p>

                    <h2 className="mt-1 text-base font-semibold text-zinc-200">
                        Imagen del proyecto
                    </h2>
                </div>

                <div className="p-5 sm:p-6">
                    <ImageUploader
                        resource="projects"
                        value={form.image_path || null}
                        onChange={(imagePath) =>
                            updateField("image_path", imagePath ?? "")
                        }
                        disabled={submitting}
                    />
                </div>
            </section>

            <section className="border border-[#22222A] bg-[#111115]">
                <div className="border-b border-[#22222A] px-5 py-4 sm:px-6">
                    <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                        Publicación
                    </p>

                    <h2 className="mt-1 text-base font-semibold text-zinc-200">
                        Estado del proyecto
                    </h2>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                    <label className="flex cursor-pointer items-start gap-4">
                        <input
                            type="checkbox"
                            checked={form.is_active}
                            onChange={(event) =>
                                updateField("is_active", event.target.checked)
                            }
                            disabled={submitting}
                            className="mt-1 h-4 w-4 accent-[#ED1C24]"
                        />

                        <div>
                            <p className="text-sm font-semibold text-zinc-300">
                                Proyecto activo
                            </p>

                            <p className="mt-1 text-xs leading-5 text-zinc-600">
                                Los proyectos activos aparecen en el catálogo
                                público.
                            </p>
                        </div>
                    </label>

                    <label className="flex cursor-pointer items-start gap-4">
                        <input
                            type="checkbox"
                            checked={form.starred}
                            onChange={(event) =>
                                updateField("starred", event.target.checked)
                            }
                            disabled={submitting}
                            className="mt-1 h-4 w-4 accent-[#ED1C24]"
                        />

                        <div>
                            <p className="text-sm font-semibold text-zinc-300">
                                Proyecto destacado
                            </p>

                            <p className="mt-1 text-xs leading-5 text-zinc-600">
                                Aparece en la banda transportadora de la página de
                                proyectos.
                            </p>
                        </div>
                    </label>
                </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-[#22222A] pt-6 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={() => router.push("/admin/projects")}
                    disabled={submitting}
                    className="cms-button-secondary"
                >
                    <X size={15} />
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={submitting}
                    className="cms-button-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? (
                        <>
                            <Loader2 size={15} className="animate-spin" />
                            Guardando
                        </>
                    ) : (
                        <>
                            <Save size={15} />
                            {mode === "create"
                                ? "Crear proyecto"
                                : "Guardar cambios"}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
