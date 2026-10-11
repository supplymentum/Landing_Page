"use client";

import { FormEvent, useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

import ImageUploader from "@/components/cms/media/ImageUploader";

import {
    AREA_ICON_OPTIONS,
} from "@/lib/data/areaIcons";

import {
    type Area,
    type CreateAreaPayload,
    createArea,
    updateArea,
} from "@/lib/api/areas";

interface AreaFormProps {
    mode: "create" | "edit";
    initialData?: Area;
}

interface AreaFormState {
    name: string;
    short_name: string;
    description: string;
    image_path: string;
    icon_key: string;

    activities: string;
    requirements: string;

    is_active: boolean;
    sort_order: string;
}

export default function AreaForm({
    mode,
    initialData,
}: AreaFormProps) {
    const router = useRouter();

    const [form, setForm] = useState<AreaFormState>({
        name: initialData?.name ?? "",
        short_name: initialData?.short_name ?? "",
        description: initialData?.description ?? "",
        image_path: initialData?.image_path ?? "",
        icon_key: initialData?.icon_key ?? "",

        activities:
            initialData?.activities?.join("\n") ?? "",

        requirements:
            initialData?.requirements?.join("\n") ?? "",

        is_active: initialData?.is_active ?? true,
        sort_order: String(initialData?.sort_order ?? 0),
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function updateField<K extends keyof AreaFormState>(
        field: K,
        value: AreaFormState[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function linesToArray(value: string): string[] {
        return value
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    function validateForm(): string | null {
        const name = form.name.trim();

        if (!name) {
            return "El nombre del área es obligatorio.";
        }

        if (name.length > 150) {
            return "El nombre no puede superar los 150 caracteres.";
        }

        if (form.short_name.trim().length > 50) {
            return "La abreviatura no puede superar los 50 caracteres.";
        }

        const sortOrder = Number(form.sort_order);

        if (!Number.isInteger(sortOrder) || sortOrder < 0) {
            return "El orden debe ser un número entero mayor o igual a 0.";
        }

        return null;
    }

    function buildPayload(): CreateAreaPayload {
        return {
            name: form.name.trim(),

            short_name:
                form.short_name.trim() || null,

            description:
                form.description.trim() || null,

            image_path:
                form.image_path.trim() || null,

            icon_key:
                form.icon_key.trim() || null,

            activities:
                linesToArray(form.activities),

            requirements:
                linesToArray(form.requirements),

            is_active:
                form.is_active,

            sort_order:
                Number(form.sort_order),
        };
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
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
                await createArea(payload);
            } else {
                if (!initialData) {
                    throw new Error(
                        "No se encontró la información del área a editar.",
                    );
                }

                await updateArea(
                    initialData.area_id,
                    payload,
                );
            }

            router.push("/admin/areas");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error al guardar el área.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
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
                        Información general
                    </p>

                    <h2 className="mt-1 text-base font-semibold text-zinc-200">
                        Datos del área
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 lg:grid-cols-2">
                    <div className="lg:col-span-2">
                        <label
                            htmlFor="name"
                            className="cms-label"
                        >
                            Nombre del área *
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={form.name}
                            onChange={(event) =>
                                updateField(
                                    "name",
                                    event.target.value,
                                )
                            }
                            maxLength={150}
                            className="cms-input"
                            placeholder="Ej. Capital Humano y Excelencia"
                            disabled={submitting}
                        />

                        <p className="mt-2 text-[11px] text-zinc-700">
                            Máximo 150 caracteres.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="short_name"
                            className="cms-label"
                        >
                            Nombre corto
                        </label>

                        <input
                            id="short_name"
                            type="text"
                            value={form.short_name}
                            onChange={(event) =>
                                updateField(
                                    "short_name",
                                    event.target.value,
                                )
                            }
                            maxLength={50}
                            className="cms-input"
                            placeholder="Ej. CHE"
                            disabled={submitting}
                        />

                        <p className="mt-2 text-[11px] text-zinc-700">
                            Abreviatura o sigla del área.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="icon_key"
                            className="cms-label"
                        >
                            Icono del área
                        </label>

                        <select
                            id="icon_key"
                            value={form.icon_key}
                            onChange={(event) =>
                                updateField(
                                    "icon_key",
                                    event.target.value,
                                )
                            }
                            className="cms-input"
                            disabled={submitting}
                        >
                            <option value="">
                                Sin icono
                            </option>

                            {AREA_ICON_OPTIONS.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <p className="mt-2 text-[11px] text-zinc-700">
                            Selecciona el icono que se mostrará en la rueda de áreas.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="sort_order"
                            className="cms-label"
                        >
                            Orden de visualización
                        </label>

                        <input
                            id="sort_order"
                            type="number"
                            min={0}
                            step={1}
                            value={form.sort_order}
                            onChange={(event) =>
                                updateField(
                                    "sort_order",
                                    event.target.value,
                                )
                            }
                            className="cms-input"
                            disabled={submitting}
                        />

                        <p className="mt-2 text-[11px] text-zinc-700">
                            Los números menores se muestran primero.
                        </p>
                    </div>

                    <div className="lg:col-span-2">
                        <label
                            htmlFor="description"
                            className="cms-label"
                        >
                            Descripción
                        </label>

                        <textarea
                            id="description"
                            value={form.description}
                            onChange={(event) =>
                                updateField(
                                    "description",
                                    event.target.value,
                                )
                            }
                            rows={6}
                            className="cms-input min-h-[150px] resize-y py-3"
                            placeholder="Describe las funciones o propósito del área..."
                            disabled={submitting}
                        />
                    </div>
                </div>
            </section>

            <section className="border border-[#22222A] bg-[#111115]">
                <div className="border-b border-[#22222A] px-5 py-4 sm:px-6">
                    <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                        Contenido
                    </p>

                    <h2 className="mt-1 text-base font-semibold text-zinc-200">
                        Información pública
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 lg:grid-cols-2">
                    <div>
                        <label
                            htmlFor="activities"
                            className="cms-label"
                        >
                            Qué realizamos
                        </label>

                        <textarea
                            id="activities"
                            value={form.activities}
                            onChange={(event) =>
                                updateField(
                                    "activities",
                                    event.target.value,
                                )
                            }
                            rows={8}
                            className="cms-input min-h-[190px] resize-y py-3"
                            placeholder={`Organización de eventos
Desarrollo de proyectos
Capacitaciones`}
                            disabled={submitting}
                        />

                        <p className="mt-2 text-[11px] leading-5 text-zinc-700">
                            Escribe una actividad por línea.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="requirements"
                            className="cms-label"
                        >
                            Qué buscamos
                        </label>

                        <textarea
                            id="requirements"
                            value={form.requirements}
                            onChange={(event) =>
                                updateField(
                                    "requirements",
                                    event.target.value,
                                )
                            }
                            rows={8}
                            className="cms-input min-h-[190px] resize-y py-3"
                            placeholder={`Trabajo en equipo
Responsabilidad
Interés por supply chain`}
                            disabled={submitting}
                        />

                        <p className="mt-2 text-[11px] leading-5 text-zinc-700">
                            Escribe una característica o requisito por línea.
                        </p>
                    </div>
                </div>
            </section>

            <section className="border border-[#22222A] bg-[#111115]">
                <div className="border-b border-[#22222A] px-5 py-4 sm:px-6">
                    <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                        Multimedia
                    </p>

                    <h2 className="mt-1 text-base font-semibold text-zinc-200">
                        Imagen del área
                    </h2>
                </div>

                <div className="p-5 sm:p-6">
                    <ImageUploader
                        resource="areas"
                        value={
                            form.image_path || null
                        }
                        onChange={(imagePath) =>
                            updateField(
                                "image_path",
                                imagePath ?? "",
                            )
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
                        Estado del área
                    </h2>
                </div>

                <div className="p-5 sm:p-6">
                    <label className="flex cursor-pointer items-start gap-4">
                        <input
                            type="checkbox"
                            checked={form.is_active}
                            onChange={(event) =>
                                updateField(
                                    "is_active",
                                    event.target.checked,
                                )
                            }
                            disabled={submitting}
                            className="mt-1 h-4 w-4 accent-[#ED1C24]"
                        />

                        <div>
                            <p className="text-sm font-semibold text-zinc-300">
                                Área activa
                            </p>

                            <p className="mt-1 text-xs leading-5 text-zinc-600">
                                Las áreas activas pueden mostrarse en la página pública.
                                Las áreas inactivas permanecen almacenadas en el CMS.
                            </p>
                        </div>
                    </label>
                </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-[#22222A] pt-6 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/admin/areas",
                        )
                    }
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
                            <Loader2
                                size={15}
                                className="animate-spin"
                            />
                            Guardando
                        </>
                    ) : (
                        <>
                            <Save size={15} />

                            {mode === "create"
                                ? "Crear área"
                                : "Guardar cambios"}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}