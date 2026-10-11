"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    ChevronRight,
    CirclePlus,
    Edit3,
    RefreshCw,
    Search,
    Users,
} from "lucide-react";

import PageHeader from "@/components/cms/PageHeader";
import {
    type Executive,
    getExecutives,
} from "@/lib/api/executives";

type StatusFilter = "all" | "active" | "inactive";

export default function ExecutivesPage() {
    const [executives, setExecutives] = useState<Executive[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

    async function loadExecutives() {
        try {
            setLoading(true);
            setError(null);

            const data = await getExecutives();

            setExecutives(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudieron obtener los directivos.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadExecutives();
    }, []);

    const filteredExecutives = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLocaleLowerCase("es");

        return executives.filter((executive) => {
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && executive.is_active) ||
                (statusFilter === "inactive" && !executive.is_active);

            if (!matchesStatus) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const searchableValues = [
                executive.full_name,
                executive.role?.name,
                executive.area?.name,
                executive.area?.short_name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLocaleLowerCase("es");

            return searchableValues.includes(normalizedSearch);
        });
    }, [executives, search, statusFilter]);

    const activeCount = useMemo(
        () =>
            executives.filter(
                (executive) => executive.is_active,
            ).length,
        [executives],
    );

    const inactiveCount = executives.length - activeCount;

    return (
        <>
            <PageHeader
                eyebrow="Contenido"
                title="Directivos"
                description="Administra los directivos de SupplyMentum, sus cargos, áreas, orden de visualización y visibilidad en la página pública."
                action={
                    <Link
                        href="/admin/executives/new"
                        className="cms-button-primary"
                    >
                        <CirclePlus size={16} />
                        Nuevo directivo
                    </Link>
                }
            />

            <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SummaryCard
                    label="Total"
                    value={executives.length}
                />

                <SummaryCard
                    label="Activos"
                    value={activeCount}
                />

                <SummaryCard
                    label="Inactivos"
                    value={inactiveCount}
                />
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
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Buscar por nombre, cargo o área..."
                            className="cms-input pl-11"
                        />
                    </div>

                    <div className="flex w-full gap-2 sm:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value as StatusFilter,
                                )
                            }
                            className="cms-input min-w-[170px] cursor-pointer"
                            aria-label="Filtrar por estado"
                        >
                            <option value="all">
                                Todos los estados
                            </option>

                            <option value="active">
                                Activos
                            </option>

                            <option value="inactive">
                                Inactivos
                            </option>
                        </select>

                        <button
                            type="button"
                            onClick={() => void loadExecutives()}
                            disabled={loading}
                            title="Actualizar listado"
                            className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#2A2A31] bg-[#0D0D10] text-zinc-500 transition-colors hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    loading ? "animate-spin" : undefined
                                }
                            />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <LoadingState />
                ) : error ? (
                    <ErrorState
                        message={error}
                        onRetry={() => void loadExecutives()}
                    />
                ) : filteredExecutives.length === 0 ? (
                    <EmptyState
                        hasExecutives={executives.length > 0}
                    />
                ) : (
                    <ExecutivesTable
                        executives={filteredExecutives}
                    />
                )}

                {!loading && !error && executives.length > 0 && (
                    <div className="flex flex-col gap-1 border-t border-[#22222A] px-5 py-4 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            Mostrando {filteredExecutives.length} de{" "}
                            {executives.length} directivos
                        </span>

                        <span>
                            Ordenados según la jerarquía configurada
                        </span>
                    </div>
                )}
            </section>
        </>
    );
}

interface ExecutivesTableProps {
    executives: Executive[];
}

function ExecutivesTable({
    executives,
}: ExecutivesTableProps) {
    return (
        <div className="cms-scrollbar overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="bg-[#0C0C0F]">
                    <tr className="border-b border-[#22222A]">
                        <TableHeader>Directivo</TableHeader>
                        <TableHeader>Cargo</TableHeader>
                        <TableHeader>Área</TableHeader>
                        <TableHeader>Estado</TableHeader>
                        <TableHeader>Orden</TableHeader>

                        <th className="w-[120px] px-5 py-4 text-right font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {executives.map((executive) => (
                        <ExecutiveRow
                            key={executive.executive_id}
                            executive={executive}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

interface ExecutiveRowProps {
    executive: Executive;
}

function ExecutiveRow({
    executive,
}: ExecutiveRowProps) {
    return (
        <tr className="group border-b border-[#1D1D23] transition-colors last:border-b-0 hover:bg-white/[0.018]">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <ExecutiveAvatar
                        name={executive.full_name}
                    />

                    <div className="min-w-0">
                        <p className="max-w-[260px] truncate text-sm font-semibold text-zinc-200">
                            {executive.full_name}
                        </p>

                        <p className="mt-1 text-[11px] text-zinc-700">
                            ID #{executive.executive_id}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-5 py-4">
                {executive.role ? (
                    <div>
                        <p className="text-sm text-zinc-400">
                            {executive.role.name}
                        </p>

                        {!executive.role.is_active && (
                            <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-amber-500/70">
                                Cargo inactivo
                            </p>
                        )}
                    </div>
                ) : (
                    <MutedValue />
                )}
            </td>

            <td className="px-5 py-4">
                {executive.area ? (
                    <div>
                        <p className="max-w-[220px] truncate text-sm text-zinc-400">
                            {executive.area.name}
                        </p>

                        {executive.area.short_name && (
                            <p className="mt-1 text-[11px] text-zinc-700">
                                {executive.area.short_name}
                            </p>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-zinc-700">
                        Sin área asignada
                    </span>
                )}
            </td>

            <td className="px-5 py-4">
                <StatusBadge
                    active={executive.is_active}
                />
            </td>

            <td className="px-5 py-4">
                <span className="inline-flex min-w-8 items-center justify-center border border-[#292930] bg-[#0D0D10] px-2 py-1 text-xs font-semibold tabular-nums text-zinc-500">
                    {executive.sort_order}
                </span>
            </td>

            <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                    <Link
                        href={`/admin/executives/${executive.executive_id}`}
                        title="Editar directivo"
                        aria-label={`Editar ${executive.full_name}`}
                        className="flex h-9 w-9 items-center justify-center border border-[#292930] text-zinc-600 transition-colors hover:border-zinc-500 hover:text-white"
                    >
                        <Edit3 size={15} />
                    </Link>

                    <Link
                        href={`/admin/executives/${executive.executive_id}`}
                        title="Ver directivo"
                        aria-label={`Ver ${executive.full_name}`}
                        className="flex h-9 w-9 items-center justify-center border border-[#292930] text-zinc-600 transition-colors hover:border-[#ED1C24]/60 hover:text-[#ED1C24]"
                    >
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </td>
        </tr>
    );
}

interface TableHeaderProps {
    children: React.ReactNode;
}

function TableHeader({
    children,
}: TableHeaderProps) {
    return (
        <th className="px-5 py-4 font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
            {children}
        </th>
    );
}

interface StatusBadgeProps {
    active: boolean;
}

function StatusBadge({
    active,
}: StatusBadgeProps) {
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
                className={`h-1.5 w-1.5 ${active
                        ? "bg-emerald-500"
                        : "bg-zinc-600"
                    }`}
            />

            {active ? "Activo" : "Inactivo"}
        </span>
    );
}

interface SummaryCardProps {
    label: string;
    value: number;
}

function SummaryCard({
    label,
    value,
}: SummaryCardProps) {
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

            <Users
                size={18}
                strokeWidth={1.5}
                className="text-zinc-700"
            />
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <RefreshCw
                size={25}
                className="animate-spin text-[#ED1C24]"
            />

            <p className="mt-4 text-sm font-semibold text-zinc-400">
                Cargando directivos...
            </p>

            <p className="mt-1 text-xs text-zinc-700">
                Consultando información del CMS.
            </p>
        </div>
    );
}

interface ErrorStateProps {
    message: string;
    onRetry: () => void;
}

function ErrorState({
    message,
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-red-900/40 bg-red-950/20">
                <AlertCircle
                    size={21}
                    className="text-red-500"
                />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-300">
                No se pudieron cargar los directivos
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
    hasExecutives: boolean;
}

function EmptyState({
    hasExecutives,
}: EmptyStateProps) {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-[#292930] bg-[#0D0D10]">
                <Users
                    size={21}
                    className="text-zinc-600"
                />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-300">
                {hasExecutives
                    ? "No se encontraron resultados"
                    : "Todavía no hay directivos"}
            </p>

            <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                {hasExecutives
                    ? "Prueba modificando la búsqueda o el filtro de estado."
                    : "Registra al primer directivo para comenzar a gestionar esta sección."}
            </p>

            {!hasExecutives && (
                <Link
                    href="/admin/executives/new"
                    className="cms-button-primary mt-5"
                >
                    <CirclePlus size={15} />
                    Nuevo directivo
                </Link>
            )}
        </div>
    );
}

function ExecutiveAvatar({
    name,
}: {
    name: string;
}) {
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();

    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#292930] bg-[#17171C] font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-400">
            {initials || "—"}
        </div>
    );
}

function MutedValue() {
    return (
        <span className="text-xs text-zinc-700">
            No asignado
        </span>
    );
}