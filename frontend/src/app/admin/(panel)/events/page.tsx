"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    ChevronRight,
    CirclePlus,
    Edit3,
    RefreshCw,
    Search,
    Star,
} from "lucide-react";

import PageHeader from "@/components/cms/PageHeader";
import {
    type EventRecord,
    getEvents,
} from "@/lib/api/events";

type StatusFilter = "all" | "open" | "closed";

const LIST_DATE_FORMATTER = new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Lima",
});

export default function EventsPage() {
    const [events, setEvents] = useState<EventRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    async function loadEvents() {
        try {
            setLoading(true);
            setError(null);

            const data = await getEvents();

            setEvents(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudieron obtener los eventos.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadEvents();
    }, []);

    const filteredEvents = useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase("es");

        return events.filter((event) => {
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "open" && event.is_active) ||
                (statusFilter === "closed" && !event.is_active);

            if (!matchesStatus) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const searchableValues = [event.title, event.location]
                .filter(Boolean)
                .join(" ")
                .toLocaleLowerCase("es");

            return searchableValues.includes(normalizedSearch);
        });
    }, [events, search, statusFilter]);

    const openCount = useMemo(
        () => events.filter((event) => event.is_active).length,
        [events],
    );

    const closedCount = events.length - openCount;

    return (
        <>
            <PageHeader
                eyebrow="Contenido"
                title="Eventos"
                description="Administra los eventos de SupplyMentum: fecha, lugar, inscripciones y contenido destacado."
                action={
                    <Link href="/admin/events/new" className="cms-button-primary">
                        <CirclePlus size={16} />
                        Nuevo evento
                    </Link>
                }
            />

            <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SummaryCard label="Total" value={events.length} />
                <SummaryCard label="Inscripciones abiertas" value={openCount} />
                <SummaryCard label="Cerrados" value={closedCount} />
            </section>

            <section className="border border-[#22222A] bg-[#111115]">
                <div className="flex flex-col gap-4 border-b border-[#22222A] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="relative w-full sm:max-w-md">
                        <Search
                            size={16}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar por título o lugar..."
                            className="cms-input pl-11"
                        />
                    </div>

                    <div className="flex w-full gap-2 sm:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value as StatusFilter)
                            }
                            className="cms-input min-w-[190px] cursor-pointer"
                            aria-label="Filtrar eventos por inscripciones"
                        >
                            <option value="all">Todas las inscripciones</option>
                            <option value="open">Inscripciones abiertas</option>
                            <option value="closed">Inscripciones cerradas</option>
                        </select>

                        <button
                            type="button"
                            onClick={() => void loadEvents()}
                            disabled={loading}
                            title="Actualizar listado"
                            className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#2A2A31] bg-[#0D0D10] text-zinc-500 transition-colors hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={loading ? "animate-spin" : undefined}
                            />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <LoadingState />
                ) : error ? (
                    <ErrorState message={error} onRetry={() => void loadEvents()} />
                ) : filteredEvents.length === 0 ? (
                    <EmptyState hasEvents={events.length > 0} />
                ) : (
                    <EventsTable events={filteredEvents} />
                )}

                {!loading && !error && events.length > 0 && (
                    <div className="flex flex-col gap-1 border-t border-[#22222A] px-5 py-4 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            Mostrando {filteredEvents.length} de {events.length}{" "}
                            eventos
                        </span>
                    </div>
                )}
            </section>
        </>
    );
}

function EventsTable({ events }: { events: EventRecord[] }) {
    return (
        <div className="cms-scrollbar overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="bg-[#0C0C0F]">
                    <tr className="border-b border-[#22222A]">
                        <TableHeader>Evento</TableHeader>
                        <TableHeader>Fecha y hora</TableHeader>
                        <TableHeader>Lugar</TableHeader>
                        <TableHeader>Inscripciones</TableHeader>

                        <th className="w-[120px] px-5 py-4 text-right font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {events.map((event) => (
                        <EventRow key={event.event_id} event={event} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function EventRow({ event }: { event: EventRecord }) {
    return (
        <tr className="group border-b border-[#1D1D23] transition-colors last:border-b-0 hover:bg-white/[0.018]">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#292930] bg-[#17171C] text-zinc-400">
                        {event.starred ? (
                            <Star size={16} className="text-[#ED1C24]" fill="currentColor" />
                        ) : (
                            <CalendarDays size={16} />
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="max-w-[280px] truncate text-sm font-semibold text-zinc-200">
                            {event.title}
                        </p>

                        <span className="text-[11px] text-zinc-700">
                            ID #{event.event_id}
                        </span>
                    </div>
                </div>
            </td>

            <td className="px-5 py-4">
                <p className="text-sm text-zinc-500">
                    {LIST_DATE_FORMATTER.format(new Date(event.start_date_time))}
                </p>
            </td>

            <td className="px-5 py-4">
                <p className="max-w-[220px] truncate text-sm text-zinc-500">
                    {event.location}
                </p>
            </td>

            <td className="px-5 py-4">
                <StatusBadge active={event.is_active} />
            </td>

            <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                    <Link
                        href={`/admin/events/${event.event_id}`}
                        title="Editar evento"
                        aria-label={`Editar ${event.title}`}
                        className="flex h-9 w-9 items-center justify-center border border-[#292930] text-zinc-600 transition-colors hover:border-zinc-500 hover:text-white"
                    >
                        <Edit3 size={15} />
                    </Link>

                    <Link
                        href={`/admin/events/${event.event_id}`}
                        title="Ver evento"
                        aria-label={`Ver ${event.title}`}
                        className="flex h-9 w-9 items-center justify-center border border-[#292930] text-zinc-600 transition-colors hover:border-[#ED1C24]/60 hover:text-[#ED1C24]"
                    >
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </td>
        </tr>
    );
}

function TableHeader({ children }: { children: React.ReactNode }) {
    return (
        <th className="px-5 py-4 font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
            {children}
        </th>
    );
}

function StatusBadge({ active }: { active: boolean }) {
    return (
        <span
            className={`
        inline-flex items-center gap-2 border px-2.5 py-1.5
        font-[family-name:var(--font-archivo)]
        text-[9px] font-bold uppercase tracking-[0.13em]
        ${active
                    ? "border-emerald-900/40 bg-emerald-950/20 text-emerald-500"
                    : "border-[#303037] bg-[#151519] text-zinc-600"
                }
      `}
        >
            <span
                className={`h-1.5 w-1.5 ${active ? "bg-emerald-500" : "bg-zinc-600"}`}
            />
            {active ? "Abiertas" : "Cerradas"}
        </span>
    );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between border border-[#22222A] bg-[#0D0D10] px-5 py-4">
            <div>
                <p className="font-[family-name:var(--font-archivo)] text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                    {label}
                </p>

                <p className="mt-1 font-[family-name:var(--font-archivo-black)] text-2xl text-white">
                    {value}
                </p>
            </div>

            <CalendarDays size={18} strokeWidth={1.5} className="text-zinc-700" />
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <RefreshCw size={25} className="animate-spin text-[#ED1C24]" />

            <p className="mt-4 text-sm font-semibold text-zinc-400">
                Cargando eventos...
            </p>
        </div>
    );
}

function ErrorState({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-red-900/40 bg-red-950/20">
                <AlertCircle size={21} className="text-red-500" />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-300">
                No se pudieron cargar los eventos
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

function EmptyState({ hasEvents }: { hasEvents: boolean }) {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-[#292930] bg-[#0D0D10]">
                <CalendarDays size={21} className="text-zinc-600" />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-300">
                {hasEvents ? "No se encontraron resultados" : "Todavía no hay eventos"}
            </p>

            <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                {hasEvents
                    ? "Prueba modificando la búsqueda o el filtro de inscripciones."
                    : "Crea el primer evento para comenzar a gestionar esta sección."}
            </p>

            {!hasEvents && (
                <Link href="/admin/events/new" className="cms-button-primary mt-5">
                    <CirclePlus size={15} />
                    Nuevo evento
                </Link>
            )}
        </div>
    );
}
