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

import EventForm from "@/components/cms/events/EventForm";
import PageHeader from "@/components/cms/PageHeader";
import {
    type EventRecord,
    getEvent,
    removeEvent,
} from "@/lib/api/events";

export default function EditEventPage() {
    const params = useParams();
    const router = useRouter();

    const [event, setEvent] = useState<EventRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deleting, setDeleting] = useState(false);

    const eventId = Number(params.id);

    useEffect(() => {
        if (!Number.isInteger(eventId) || eventId <= 0) {
            setError("El ID del evento no es válido.");
            setLoading(false);
            return;
        }

        async function loadEvent() {
            try {
                setLoading(true);
                setError(null);

                const data = await getEvent(eventId);

                setEvent(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "No se pudo obtener el evento.",
                );
            } finally {
                setLoading(false);
            }
        }

        void loadEvent();
    }, [eventId]);

    async function handleDelete() {
        if (!event) {
            return;
        }

        const confirmed = window.confirm(
            `¿Deseas eliminar el evento "${event.title}"? Esta acción no se puede deshacer.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);

            await removeEvent(event.event_id);

            router.push("/admin/events");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo eliminar el evento.",
            );
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return <LoadingState />;
    }

    if (error || !event) {
        return (
            <ErrorState
                message={error ?? "No se encontró el evento solicitado."}
            />
        );
    }

    return (
        <>
            <div className="mb-5">
                <Link
                    href="/admin/events"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 transition-colors hover:text-white"
                >
                    <ArrowLeft size={14} />
                    Volver a eventos
                </Link>
            </div>

            <PageHeader
                eyebrow="Eventos"
                title="Editar evento"
                description={`Modifica la información de ${event.title}.`}
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
                <EventForm mode="edit" initialData={event} />
            </div>
        </>
    );
}

function LoadingState() {
    return (
        <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
            <Loader2 size={28} className="animate-spin text-[#ED1C24]" />

            <p className="mt-4 text-sm font-semibold text-zinc-400">
                Cargando evento...
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
                No se pudo cargar el evento
            </p>

            <p className="mt-2 max-w-md text-xs leading-5 text-zinc-600">
                {message}
            </p>

            <Link href="/admin/events" className="cms-button-secondary mt-5">
                <ArrowLeft size={14} />
                Volver a eventos
            </Link>
        </div>
    );
}
