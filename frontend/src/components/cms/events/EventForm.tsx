"use client";

import { FormEvent, useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

import ImageUploader from "@/components/cms/media/ImageUploader";

import {
    type EventPayload,
    type EventRecord,
    createEvent,
    updateEvent,
} from "@/lib/api/events";

interface EventFormProps {
    mode: "create" | "edit";
    initialData?: EventRecord;
}

interface EventFormState {
    title: string;
    description: string;
    location: string;
    image_path: string;
    registration_link: string;
    summary_link: string;
    start_date_time: string;
    is_active: boolean;
    starred: boolean;
}

/**
 * Convierte un ISO 8601 en el valor local que espera
 * un input datetime-local ("YYYY-MM-DDTHH:mm").
 */
function toDatetimeLocalValue(iso: string): string {
    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const pad = (value: number) => String(value).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EventForm({
    mode,
    initialData,
}: EventFormProps) {
    const router = useRouter();

    const [form, setForm] = useState<EventFormState>({
        title: initialData?.title ?? "",
        description: initialData?.description ?? "",
        location: initialData?.location ?? "",
        image_path: initialData?.image_path ?? "",
        registration_link: initialData?.registration_link ?? "",
        summary_link: initialData?.summary_link ?? "",
        start_date_time: initialData
            ? toDatetimeLocalValue(initialData.start_date_time)
            : "",
        is_active: initialData?.is_active ?? false,
        starred: initialData?.starred ?? false,
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function updateField<K extends keyof EventFormState>(
        field: K,
        value: EventFormState[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function validateForm(): string | null {
        if (!form.title.trim()) {
            return "El título del evento es obligatorio.";
        }

        if (!form.description.trim()) {
            return "La descripción del evento es obligatoria.";
        }

        if (!form.location.trim()) {
            return "El lugar del evento es obligatorio.";
        }

        if (!form.start_date_time) {
            return "La fecha y hora de inicio son obligatorias.";
        }

        if (form.is_active && !form.registration_link.trim()) {
            return "El enlace de inscripción es obligatorio cuando las inscripciones están abiertas.";
        }

        return null;
    }

    function buildPayload(): EventPayload {
        return {
            title: form.title.trim(),
            description: form.description.trim(),
            location: form.location.trim(),
            image_path: form.image_path.trim() || null,
            registration_link: form.registration_link.trim() || null,
            summary_link: form.summary_link.trim() || null,
            start_date_time: new Date(form.start_date_time).toISOString(),
            is_active: form.is_active,
            starred: form.starred,
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
                await createEvent(payload);
            } else {
                if (!initialData) {
                    throw new Error(
                        "No se encontró la información del evento a editar.",
                    );
                }

                await updateEvent(initialData.event_id, payload);
            }

            router.push("/admin/events");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error al guardar el evento.",
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
                        Datos del evento
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 lg:grid-cols-2">
                    <div className="lg:col-span-2">
                        <label htmlFor="title" className="cms-label">
                            Título del evento *
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={form.title}
                            onChange={(event) =>
                                updateField("title", event.target.value)
                            }
                            maxLength={200}
                            className="cms-input"
                            placeholder="Ej. Supply Chain Challenge 2026"
                            disabled={submitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="cms-label">
                            Lugar *
                        </label>

                        <input
                            id="location"
                            type="text"
                            value={form.location}
                            onChange={(event) =>
                                updateField("location", event.target.value)
                            }
                            maxLength={250}
                            className="cms-input"
                            placeholder="Ej. Auditorio CEPS - UNI"
                            disabled={submitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="start_date_time" className="cms-label">
                            Fecha y hora de inicio *
                        </label>

                        <input
                            id="start_date_time"
                            type="datetime-local"
                            value={form.start_date_time}
                            onChange={(event) =>
                                updateField(
                                    "start_date_time",
                                    event.target.value,
                                )
                            }
                            className="cms-input"
                            disabled={submitting}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <label htmlFor="description" className="cms-label">
                            Descripción *
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
                            rows={5}
                            className="cms-input min-h-[130px] resize-y py-3"
                            placeholder="Describe de qué trata el evento..."
                            disabled={submitting}
                        />
                    </div>
                </div>
            </section>

            <section className="border border-[#22222A] bg-[#111115]">
                <div className="border-b border-[#22222A] px-5 py-4 sm:px-6">
                    <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                        Enlaces
                    </p>

                    <h2 className="mt-1 text-base font-semibold text-zinc-200">
                        Inscripción y resumen
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 lg:grid-cols-2">
                    <div>
                        <label
                            htmlFor="registration_link"
                            className="cms-label"
                        >
                            Enlace de inscripción
                            {form.is_active ? " *" : ""}
                        </label>

                        <input
                            id="registration_link"
                            type="url"
                            value={form.registration_link}
                            onChange={(event) =>
                                updateField(
                                    "registration_link",
                                    event.target.value,
                                )
                            }
                            className="cms-input"
                            placeholder="https://forms.example.com/evento"
                            disabled={submitting}
                        />

                        <p className="mt-2 text-[11px] text-zinc-700">
                            Obligatorio cuando las inscripciones están abiertas.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="summary_link" className="cms-label">
                            Enlace de resumen
                        </label>

                        <input
                            id="summary_link"
                            type="url"
                            value={form.summary_link}
                            onChange={(event) =>
                                updateField(
                                    "summary_link",
                                    event.target.value,
                                )
                            }
                            className="cms-input"
                            placeholder="https://example.com/eventos/resumen"
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
                        Imagen del evento
                    </h2>
                </div>

                <div className="p-5 sm:p-6">
                    <ImageUploader
                        resource="events"
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
                        Estado del evento
                    </h2>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
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
                                Inscripciones abiertas
                            </p>

                            <p className="mt-1 text-xs leading-5 text-zinc-600">
                                Requiere un enlace de inscripción válido.
                            </p>
                        </div>
                    </label>

                    <label className="flex cursor-pointer items-start gap-4">
                        <input
                            type="checkbox"
                            checked={form.starred}
                            onChange={(event) =>
                                updateField(
                                    "starred",
                                    event.target.checked,
                                )
                            }
                            disabled={submitting}
                            className="mt-1 h-4 w-4 accent-[#ED1C24]"
                        />

                        <div>
                            <p className="text-sm font-semibold text-zinc-300">
                                Evento destacado
                            </p>

                            <p className="mt-1 text-xs leading-5 text-zinc-600">
                                Se muestra primero en la página pública de eventos.
                            </p>
                        </div>
                    </label>
                </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-[#22222A] pt-6 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={() => router.push("/admin/events")}
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
                                ? "Crear evento"
                                : "Guardar cambios"}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
