"use client";

import { useEffect, useState } from "react";
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    CirclePlus,
    HelpCircle,
    Loader2,
    Pencil,
    RefreshCw,
    Trash2,
    X,
} from "lucide-react";

import PageHeader from "@/components/cms/PageHeader";
import {
    type Faq,
    createFaq,
    getFaqs,
    removeFaq,
    reorderFaqs,
    updateFaq,
} from "@/lib/api/faq";

export default function FaqPage() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [reordering, setReordering] = useState<number | null>(null);

    async function loadFaqs() {
        try {
            setLoading(true);
            setError(null);

            const data = await getFaqs();
            setFaqs(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudieron obtener las preguntas frecuentes.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadFaqs();
    }, []);

    async function handleMove(index: number, direction: -1 | 1) {
        const targetIndex = index + direction;

        if (targetIndex < 0 || targetIndex >= faqs.length) {
            return;
        }

        const current = faqs[index];
        const target = faqs[targetIndex];

        setReordering(current.faq_id);

        try {
            await reorderFaqs([
                { faq_id: current.faq_id, orden: target.orden },
                { faq_id: target.faq_id, orden: current.orden },
            ]);

            await loadFaqs();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo actualizar el orden.",
            );
        } finally {
            setReordering(null);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("¿Eliminar esta pregunta frecuente?")) {
            return;
        }

        try {
            await removeFaq(id);
            await loadFaqs();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo eliminar la pregunta.",
            );
        }
    }

    return (
        <>
            <PageHeader
                eyebrow="Contenido"
                title="Preguntas Frecuentes"
                description="Administra las preguntas frecuentes que se muestran en la sección de eventos del sitio público."
                action={
                    !showCreateForm && (
                        <button
                            type="button"
                            onClick={() => setShowCreateForm(true)}
                            className="cms-button-primary"
                        >
                            <CirclePlus size={16} />
                            Nueva pregunta
                        </button>
                    )
                }
            />

            {showCreateForm && (
                <FaqForm
                    onCancel={() => setShowCreateForm(false)}
                    onSubmit={async (payload) => {
                        await createFaq(payload);
                        setShowCreateForm(false);
                        await loadFaqs();
                    }}
                />
            )}

            <section className="border border-[#22222A] bg-[#111115]">
                <div className="flex items-center justify-between border-b border-[#22222A] p-4 sm:p-5">
                    <p className="text-xs text-zinc-600">
                        {faqs.length} pregunta{faqs.length === 1 ? "" : "s"} registrada
                        {faqs.length === 1 ? "" : "s"}
                    </p>

                    <button
                        type="button"
                        onClick={() => void loadFaqs()}
                        disabled={loading}
                        title="Actualizar listado"
                        className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#2A2A31] bg-[#0D0D10] text-zinc-500 transition-colors hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={15}
                            className={loading ? "animate-spin" : undefined}
                        />
                    </button>
                </div>

                {loading ? (
                    <LoadingState />
                ) : error ? (
                    <ErrorState message={error} onRetry={() => void loadFaqs()} />
                ) : faqs.length === 0 ? (
                    <EmptyState onCreate={() => setShowCreateForm(true)} />
                ) : (
                    <ul className="divide-y divide-[#1D1D23]">
                        {faqs.map((faq, index) =>
                            editingId === faq.faq_id ? (
                                <li key={faq.faq_id} className="p-4 sm:p-5">
                                    <FaqForm
                                        initialValues={faq}
                                        onCancel={() => setEditingId(null)}
                                        onSubmit={async (payload) => {
                                            await updateFaq(faq.faq_id, payload);
                                            setEditingId(null);
                                            await loadFaqs();
                                        }}
                                    />
                                </li>
                            ) : (
                                <li
                                    key={faq.faq_id}
                                    className="flex items-start gap-4 p-4 sm:p-5"
                                >
                                    <div className="flex flex-col gap-1 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => void handleMove(index, -1)}
                                            disabled={index === 0 || reordering !== null}
                                            title="Subir"
                                            className="flex h-6 w-6 items-center justify-center border border-[#292930] text-zinc-600 transition-colors hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            <ArrowUp size={13} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => void handleMove(index, 1)}
                                            disabled={
                                                index === faqs.length - 1 ||
                                                reordering !== null
                                            }
                                            title="Bajar"
                                            className="flex h-6 w-6 items-center justify-center border border-[#292930] text-zinc-600 transition-colors hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            <ArrowDown size={13} />
                                        </button>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-zinc-200">
                                            {faq.pregunta}
                                        </p>

                                        <p className="mt-1 text-sm leading-5 text-zinc-500">
                                            {faq.respuesta}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingId(faq.faq_id)}
                                            title="Editar pregunta"
                                            aria-label={`Editar ${faq.pregunta}`}
                                            className="flex h-9 w-9 items-center justify-center border border-[#292930] text-zinc-600 transition-colors hover:border-zinc-500 hover:text-white"
                                        >
                                            <Pencil size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => void handleDelete(faq.faq_id)}
                                            title="Eliminar pregunta"
                                            aria-label={`Eliminar ${faq.pregunta}`}
                                            className="flex h-9 w-9 items-center justify-center border border-[#292930] text-zinc-600 transition-colors hover:border-red-900/60 hover:text-red-500"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </li>
                            ),
                        )}
                    </ul>
                )}
            </section>
        </>
    );
}

interface FaqFormValues {
    pregunta: string;
    respuesta: string;
}

interface FaqFormProps {
    initialValues?: FaqFormValues;
    onCancel: () => void;
    onSubmit: (payload: FaqFormValues) => Promise<void>;
}

function FaqForm({ initialValues, onCancel, onSubmit }: FaqFormProps) {
    const [pregunta, setPregunta] = useState(initialValues?.pregunta ?? "");
    const [respuesta, setRespuesta] = useState(initialValues?.respuesta ?? "");
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!pregunta.trim() || !respuesta.trim()) {
            setFormError("La pregunta y la respuesta son obligatorias.");
            return;
        }

        try {
            setSubmitting(true);
            setFormError(null);

            await onSubmit({
                pregunta: pregunta.trim(),
                respuesta: respuesta.trim(),
            });
        } catch (err) {
            setFormError(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar la pregunta frecuente.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={(event) => void handleSubmit(event)}
            className="mb-5 border border-[#22222A] bg-[#0D0D10] p-4 sm:p-5"
        >
            <div className="mb-4 flex items-center justify-between">
                <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                    {initialValues ? "Editar pregunta" : "Nueva pregunta"}
                </p>

                <button
                    type="button"
                    onClick={onCancel}
                    className="text-zinc-600 transition-colors hover:text-white"
                    aria-label="Cancelar"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="grid gap-3">
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                        Pregunta
                    </label>
                    <input
                        type="text"
                        value={pregunta}
                        onChange={(event) => setPregunta(event.target.value)}
                        placeholder="¿Cómo puedo postular a SupplyMentum?"
                        className="cms-input"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                        Respuesta
                    </label>
                    <textarea
                        value={respuesta}
                        onChange={(event) => setRespuesta(event.target.value)}
                        placeholder="A través del formulario de convocatoria publicado en la web."
                        rows={3}
                        className="cms-input resize-none"
                    />
                </div>
            </div>

            {formError && (
                <p className="mt-3 text-xs text-red-400">{formError}</p>
            )}

            <div className="mt-4 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="cms-button-secondary"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={submitting}
                    className="cms-button-primary"
                >
                    {submitting ? (
                        <Loader2 size={15} className="animate-spin" />
                    ) : (
                        <CirclePlus size={15} />
                    )}
                    Guardar
                </button>
            </div>
        </form>
    );
}

function LoadingState() {
    return (
        <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
            <RefreshCw size={25} className="animate-spin text-[#ED1C24]" />

            <p className="mt-4 text-sm font-semibold text-zinc-400">
                Cargando preguntas frecuentes...
            </p>
        </div>
    );
}

interface ErrorStateProps {
    message: string;
    onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-red-900/40 bg-red-950/20">
                <AlertCircle size={21} className="text-red-500" />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-300">
                No se pudieron cargar las preguntas frecuentes
            </p>

            <p className="mt-2 max-w-md text-xs leading-5 text-zinc-600">
                {message}
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="cms-button-secondary mt-5"
            >
                <RefreshCw size={14} />
                Reintentar
            </button>
        </div>
    );
}

interface EmptyStateProps {
    onCreate: () => void;
}

function EmptyState({ onCreate }: EmptyStateProps) {
    return (
        <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-[#292930] bg-[#0D0D10]">
                <HelpCircle size={21} className="text-zinc-600" />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-300">
                Todavía no hay preguntas frecuentes
            </p>

            <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                Crea la primera pregunta para comenzar a completar esta sección.
            </p>

            <button
                type="button"
                onClick={onCreate}
                className="cms-button-primary mt-5"
            >
                <CirclePlus size={15} />
                Nueva pregunta
            </button>
        </div>
    );
}
