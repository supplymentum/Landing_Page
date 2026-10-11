"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    Link as LinkIcon,
    Loader2,
    Save,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import ImageUploader from "@/components/cms/media/ImageUploader";

import {
    type Executive,
    type CreateExecutivePayload,
    type UpdateExecutivePayload,
    createExecutive,
    updateExecutive,
} from "@/lib/api/executives";

import {
    type Area,
    getAreas,
} from "@/lib/api/areas";

import {
    type Role,
    getRoles,
} from "@/lib/api/roles";

interface ExecutiveFormProps {
    mode: "create" | "edit";
    initialData?: Executive;
}

interface ExecutiveFormState {
    full_name: string;
    role_id: string;
    area_id: string;
    description: string;
    image_path: string;
    linkedin_url: string;
    is_active: boolean;
    sort_order: string;
}

export default function ExecutiveForm({
    mode,
    initialData,
}: ExecutiveFormProps) {
    const router = useRouter();

    const [form, setForm] = useState<ExecutiveFormState>({
        full_name: initialData?.full_name ?? "",
        role_id:
            initialData?.role_id !== undefined
                ? String(initialData.role_id)
                : "",
        area_id:
            initialData?.area_id !== null &&
                initialData?.area_id !== undefined
                ? String(initialData.area_id)
                : "",
        description: initialData?.description ?? "",
        image_path: initialData?.image_path ?? "",
        linkedin_url: initialData?.linkedin_url ?? "",
        is_active: initialData?.is_active ?? true,
        sort_order: String(initialData?.sort_order ?? 0),
    });

    const [roles, setRoles] = useState<Role[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);

    const [optionsLoading, setOptionsLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [optionsError, setOptionsError] =
        useState<string | null>(null);

    useEffect(() => {
        async function loadOptions() {
            try {
                setOptionsLoading(true);
                setOptionsError(null);

                const [rolesData, areasData] = await Promise.all([
                    getRoles(),
                    getAreas(),
                ]);

                setRoles(rolesData);
                setAreas(areasData);
            } catch (err) {
                setOptionsError(
                    err instanceof Error
                        ? err.message
                        : "No se pudieron cargar los cargos y áreas.",
                );
            } finally {
                setOptionsLoading(false);
            }
        }

        void loadOptions();
    }, []);

    function updateField<K extends keyof ExecutiveFormState>(
        field: K,
        value: ExecutiveFormState[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    /**
     * Para creación solo se permiten roles activos.
     *
     * Durante edición conservamos visible el rol actual aunque haya sido
     * desactivado posteriormente, para no perder la referencia existente.
     */
    const availableRoles = useMemo(() => {
        return roles.filter((role) => {
            if (role.is_active) {
                return true;
            }

            return (
                mode === "edit" &&
                initialData?.role_id === role.role_id
            );
        });
    }, [roles, mode, initialData]);

    /**
     * La misma regla se aplica a las áreas:
     * mostramos áreas activas y, durante edición, conservamos disponible
     * el área actualmente asociada.
     */
    const availableAreas = useMemo(() => {
        return areas.filter((area) => {
            if (area.is_active) {
                return true;
            }

            return (
                mode === "edit" &&
                initialData?.area_id === area.area_id
            );
        });
    }, [areas, mode, initialData]);

    function validateForm(): string | null {
        const fullName = form.full_name.trim();

        if (!fullName) {
            return "El nombre completo del directivo es obligatorio.";
        }

        if (fullName.length > 200) {
            return "El nombre completo no puede superar los 200 caracteres.";
        }

        const roleId = Number(form.role_id);

        if (
            !form.role_id ||
            !Number.isInteger(roleId) ||
            roleId <= 0
        ) {
            return "Debes seleccionar un cargo válido.";
        }

        if (form.area_id) {
            const areaId = Number(form.area_id);

            if (
                !Number.isInteger(areaId) ||
                areaId <= 0
            ) {
                return "El área seleccionada no es válida.";
            }
        }

        const sortOrder = Number(form.sort_order);

        if (
            !Number.isInteger(sortOrder) ||
            sortOrder < 0
        ) {
            return "El orden debe ser un número entero mayor o igual a 0.";
        }

        const linkedIn = form.linkedin_url.trim();

        if (
            linkedIn &&
            !isValidUrl(linkedIn)
        ) {
            return "La URL de LinkedIn no es válida.";
        }

        return null;
    }

    function buildCreatePayload(): CreateExecutivePayload {
        return {
            full_name: form.full_name.trim(),
            role_id: Number(form.role_id),
            area_id: form.area_id
                ? Number(form.area_id)
                : null,
            description: form.description.trim() || null,
            image_path: form.image_path.trim() || null,
            linkedin_url: form.linkedin_url.trim() || null,
            is_active: form.is_active,
            sort_order: Number(form.sort_order),
        };
    }

    /**
     * El PATCH contiene únicamente los valores modificados.
     *
     * Esto es especialmente importante para role_id y area_id,
     * porque el backend vuelve a validar que estén activos cuando
     * esos campos son enviados.
     */
    function buildUpdatePayload(
        current: Executive,
    ): UpdateExecutivePayload {
        const payload: UpdateExecutivePayload = {};

        const fullName = form.full_name.trim();
        const roleId = Number(form.role_id);

        const areaId = form.area_id
            ? Number(form.area_id)
            : null;

        const description =
            form.description.trim() || null;

        const imagePath =
            form.image_path.trim() || null;

        const linkedinUrl =
            form.linkedin_url.trim() || null;

        const sortOrder = Number(form.sort_order);

        if (fullName !== current.full_name) {
            payload.full_name = fullName;
        }

        if (roleId !== current.role_id) {
            payload.role_id = roleId;
        }

        if (areaId !== current.area_id) {
            payload.area_id = areaId;
        }

        if (description !== current.description) {
            payload.description = description;
        }

        if (imagePath !== current.image_path) {
            payload.image_path = imagePath;
        }

        if (linkedinUrl !== current.linkedin_url) {
            payload.linkedin_url = linkedinUrl;
        }

        if (form.is_active !== current.is_active) {
            payload.is_active = form.is_active;
        }

        if (sortOrder !== current.sort_order) {
            payload.sort_order = sortOrder;
        }

        return payload;
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

            if (mode === "create") {
                await createExecutive(
                    buildCreatePayload(),
                );
            } else {
                if (!initialData) {
                    throw new Error(
                        "No se encontró la información del directivo a editar.",
                    );
                }

                const payload =
                    buildUpdatePayload(initialData);

                if (Object.keys(payload).length === 0) {
                    router.push("/admin/executives");
                    return;
                }

                await updateExecutive(
                    initialData.executive_id,
                    payload,
                );
            }

            router.push("/admin/executives");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error al guardar el directivo.",
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
                <ErrorBanner message={error} />
            )}

            {optionsError && (
                <ErrorBanner
                    message={`No se pudieron cargar las opciones del formulario: ${optionsError}`}
                />
            )}

            {/* Información principal */}
            <section className="border border-[#22222A] bg-[#111115]">
                <SectionHeader
                    eyebrow="Información general"
                    title="Datos del directivo"
                />

                <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 lg:grid-cols-2">
                    <div className="lg:col-span-2">
                        <label
                            htmlFor="full_name"
                            className="cms-label"
                        >
                            Nombre completo *
                        </label>

                        <input
                            id="full_name"
                            type="text"
                            value={form.full_name}
                            onChange={(event) =>
                                updateField(
                                    "full_name",
                                    event.target.value,
                                )
                            }
                            maxLength={200}
                            placeholder="Ej. Johan Osores"
                            className="cms-input"
                            disabled={submitting}
                        />

                        <p className="mt-2 text-[11px] text-zinc-700">
                            Máximo 200 caracteres.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="role_id"
                            className="cms-label"
                        >
                            Cargo *
                        </label>

                        <select
                            id="role_id"
                            value={form.role_id}
                            onChange={(event) =>
                                updateField(
                                    "role_id",
                                    event.target.value,
                                )
                            }
                            className="cms-input cursor-pointer"
                            disabled={
                                submitting ||
                                optionsLoading ||
                                Boolean(optionsError)
                            }
                        >
                            <option value="">
                                {optionsLoading
                                    ? "Cargando cargos..."
                                    : "Selecciona un cargo"}
                            </option>

                            {availableRoles.map((role) => (
                                <option
                                    key={role.role_id}
                                    value={role.role_id}
                                >
                                    {role.name}
                                    {!role.is_active
                                        ? " (inactivo)"
                                        : ""}
                                </option>
                            ))}
                        </select>

                        <p className="mt-2 text-[11px] leading-5 text-zinc-700">
                            Define la posición del directivo dentro de la
                            organización.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="area_id"
                            className="cms-label"
                        >
                            Área
                        </label>

                        <select
                            id="area_id"
                            value={form.area_id}
                            onChange={(event) =>
                                updateField(
                                    "area_id",
                                    event.target.value,
                                )
                            }
                            className="cms-input cursor-pointer"
                            disabled={
                                submitting ||
                                optionsLoading ||
                                Boolean(optionsError)
                            }
                        >
                            <option value="">
                                Sin área asignada
                            </option>

                            {availableAreas.map((area) => (
                                <option
                                    key={area.area_id}
                                    value={area.area_id}
                                >
                                    {area.name}
                                    {area.short_name
                                        ? ` (${area.short_name})`
                                        : ""}
                                    {!area.is_active
                                        ? " — Inactiva"
                                        : ""}
                                </option>
                            ))}
                        </select>

                        <p className="mt-2 text-[11px] leading-5 text-zinc-700">
                            Este campo es opcional. Un directivo puede no
                            pertenecer a un área específica.
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

                        <p className="mt-2 text-[11px] leading-5 text-zinc-700">
                            Dentro del mismo nivel jerárquico, los números
                            menores se muestran primero.
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
                            placeholder="Breve presentación del directivo..."
                            className="cms-input min-h-[150px] resize-y py-3"
                            disabled={submitting}
                        />
                    </div>
                </div>
            </section>

            {/* Presencia digital */}
            <section className="border border-[#22222A] bg-[#111115]">
                <SectionHeader
                    eyebrow="Presencia digital"
                    title="Perfil e imagen"
                />

                <div className="grid grid-cols-1 gap-5 p-5 sm:p-6">
                    <div>
                        <label
                            htmlFor="linkedin_url"
                            className="cms-label"
                        >
                            LinkedIn
                        </label>

                        <div className="relative">
                            <LinkIcon
                                size={16}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                            />

                            <input
                                id="linkedin_url"
                                type="url"
                                value={form.linkedin_url}
                                onChange={(event) =>
                                    updateField(
                                        "linkedin_url",
                                        event.target.value,
                                    )
                                }
                                placeholder="https://www.linkedin.com/in/usuario"
                                className="cms-input pl-11"
                                disabled={submitting}
                            />
                        </div>

                        <p className="mt-2 text-[11px] leading-5 text-zinc-700">
                            URL completa del perfil profesional.
                        </p>
                    </div>

                    <div className="border-t border-[#22222A] pt-5">
                        <label className="cms-label">
                            Imagen del directivo
                        </label>

                        <ImageUploader
                            resource="executives"
                            value={form.image_path || null}
                            onChange={(imagePath) =>
                                updateField(
                                    "image_path",
                                    imagePath ?? "",
                                )
                            }
                            disabled={submitting}
                        />
                    </div>
                </div>
            </section>

            {/* Publicación */}
            <section className="border border-[#22222A] bg-[#111115]">
                <SectionHeader
                    eyebrow="Publicación"
                    title="Visibilidad"
                />

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
                                Mostrar directivo públicamente
                            </p>

                            <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-600">
                                Solo los directivos activos y cuyo cargo se
                                encuentre activo son devueltos por la API pública
                                de SupplyMentum.
                            </p>
                        </div>
                    </label>
                </div>
            </section>

            {/* Acciones */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#22222A] pt-6 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={() =>
                        router.push("/admin/executives")
                    }
                    disabled={submitting}
                    className="cms-button-secondary"
                >
                    <X size={15} />
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={
                        submitting ||
                        optionsLoading ||
                        Boolean(optionsError)
                    }
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
                                ? "Crear directivo"
                                : "Guardar cambios"}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

interface SectionHeaderProps {
    eyebrow: string;
    title: string;
}

function SectionHeader({
    eyebrow,
    title,
}: SectionHeaderProps) {
    return (
        <div className="border-b border-[#22222A] px-5 py-4 sm:px-6">
            <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                {eyebrow}
            </p>

            <h2 className="mt-1 text-base font-semibold text-zinc-200">
                {title}
            </h2>
        </div>
    );
}

function ErrorBanner({
    message,
}: {
    message: string;
}) {
    return (
        <div className="flex gap-3 border border-red-900/50 bg-red-950/20 px-4 py-3">
            <AlertCircle
                size={17}
                className="mt-0.5 shrink-0 text-red-500"
            />

            <p className="text-sm leading-5 text-red-400">
                {message}
            </p>
        </div>
    );
}

function isValidUrl(value: string): boolean {
    try {
        const url = new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );
    } catch {
        return false;
    }
}