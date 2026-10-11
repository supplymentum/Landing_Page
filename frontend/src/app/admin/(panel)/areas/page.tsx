"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    ChevronRight,
    CirclePlus,
    Edit3,
    Layers3,
    RefreshCw,
    Search,
} from "lucide-react";

import PageHeader from "@/components/cms/PageHeader";
import {
    type Area,
    getAreas,
} from "@/lib/api/areas";

type StatusFilter = "all" | "active" | "inactive";

export default function AreasPage() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

    async function loadAreas() {
        try {
            setLoading(true);
            setError(null);

            const data = await getAreas();

            setAreas(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudieron obtener las áreas.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadAreas();
    }, []);

    const filteredAreas = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLocaleLowerCase("es");

        return areas.filter((area) => {
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && area.is_active) ||
                (statusFilter === "inactive" && !area.is_active);

            if (!matchesStatus) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const searchableValues = [
                area.name,
                area.short_name,
                area.description,
            ]
                .filter(Boolean)
                .join(" ")
                .toLocaleLowerCase("es");

            return searchableValues.includes(normalizedSearch);
        });
    }, [areas, search, statusFilter]);

    const activeCount = useMemo(
        () => areas.filter((area) => area.is_active).length,
        [areas],
    );

    const inactiveCount = areas.length - activeCount;

    return (
        <>
            <PageHeader
                eyebrow="Contenido"
                title="Áreas"
                description="Administra las áreas de SupplyMentum, su información pública, orden de visualización y estado dentro de la organización."
                action={
                    <Link
                        href="/admin/areas/new"
                        className="cms-button-primary"
                    >
                        <CirclePlus size={16} />
                        Nueva área
                    </Link>
                }
            />

            <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SummaryCard
                    label="Total"
                    value={areas.length}
                />

                <SummaryCard
                    label="Activas"
                    value={activeCount}
                />

                <SummaryCard
                    label="Inactivas"
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
                            placeholder="Buscar por nombre, sigla o descripción..."
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
                            aria-label="Filtrar áreas por estado"
                        >
                            <option value="all">
                                Todos los estados
                            </option>

                            <option value="active">
                                Activas
                            </option>

                            <option value="inactive">
                                Inactivas
                            </option>
                        </select>

                        <button
                            type="button"
                            onClick={() => void loadAreas()}
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
                        onRetry={() => void loadAreas()}
                    />
                ) : filteredAreas.length === 0 ? (
                    <EmptyState
                        hasAreas={areas.length > 0}
                    />
                ) : (
                    <AreasTable areas={filteredAreas} />
                )}

                {!loading && !error && areas.length > 0 && (
                    <div className="flex flex-col gap-1 border-t border-[#22222A] px-5 py-4 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            Mostrando {filteredAreas.length} de{" "}
                            {areas.length} áreas
                        </span>

                        <span>
                            Ordenadas según el orden de visualización
                        </span>
                    </div>
                )}
            </section>
        </>
    );
}

interface AreasTableProps {
    areas: Area[];
}

function AreasTable({
    areas,
}: AreasTableProps) {
    return (
        <div className="cms-scrollbar overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="bg-[#0C0C0F]">
                    <tr className="border-b border-[#22222A]">
                        <TableHeader>Área</TableHeader>
                        <TableHeader>Descripción</TableHeader>
                        <TableHeader>Estado</TableHeader>
                        <TableHeader>Orden</TableHeader>

                        <th className="w-[120px] px-5 py-4 text-right font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {areas.map((area) => (
                        <AreaRow
                            key={area.area_id}
                            area={area}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

interface AreaRowProps {
    area: Area;
}

function AreaRow({
    area,
}: AreaRowProps) {
    return (
        <tr className="group border-b border-[#1D1D23] transition-colors last:border-b-0 hover:bg-white/[0.018]">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <AreaIcon name={area.name} />

                    <div className="min-w-0">
                        <p className="max-w-[260px] truncate text-sm font-semibold text-zinc-200">
                            {area.name}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-[11px] text-zinc-700">
                                ID #{area.area_id}
                            </span>

                            {area.short_name && (
                                <>
                                    <span className="text-zinc-800">
                                        ·
                                    </span>

                                    <span className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.12em] text-[#ED1C24]/80">
                                        {area.short_name}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-5 py-4">
                {area.description ? (
                    <p className="max-w-[420px] truncate text-sm text-zinc-500">
                        {area.description}
                    </p>
                ) : (
                    <MutedValue>
                        Sin descripción
                    </MutedValue>
                )}
            </td>

            <td className="px-5 py-4">
                <StatusBadge
                    active={area.is_active}
                />
            </td>

            <td className="px-5 py-4">
                <span className="inline-flex min-w-8 items-center justify-center border border-[#292930] bg-[#0D0D10] px-2 py-1 text-xs font-semibold tabular-nums text-zinc-500">
                    {area.sort_order}
                </span>
            </td>

            <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                    <Link
                        href={`/admin/areas/${area.area_id}`}
                        title="Editar área"
                        aria-label={`Editar ${area.name}`}
                        className="flex h-9 w-9 items-center justify-center border border-[#292930] text-zinc-600 transition-colors hover:border-zinc-500 hover:text-white"
                    >
                        <Edit3 size={15} />
                    </Link>

                    <Link
                        href={`/admin/areas/${area.area_id}`}
                        title="Ver área"
                        aria-label={`Ver ${area.name}`}
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

            {active ? "Activa" : "Inactiva"}
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

            <Layers3
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
                Cargando áreas...
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
                No se pudieron cargar las áreas
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
    hasAreas: boolean;
}

function EmptyState({
    hasAreas,
}: EmptyStateProps) {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-[#292930] bg-[#0D0D10]">
                <Layers3
                    size={21}
                    className="text-zinc-600"
                />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-300">
                {hasAreas
                    ? "No se encontraron resultados"
                    : "Todavía no hay áreas"}
            </p>

            <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                {hasAreas
                    ? "Prueba modificando la búsqueda o el filtro de estado."
                    : "Crea la primera área para comenzar a gestionar esta sección."}
            </p>

            {!hasAreas && (
                <Link
                    href="/admin/areas/new"
                    className="cms-button-primary mt-5"
                >
                    <CirclePlus size={15} />
                    Nueva área
                </Link>
            )}
        </div>
    );
}

function AreaIcon({
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

function MutedValue({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <span className="text-xs text-zinc-700">
            {children}
        </span>
    );
}