"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    BriefcaseBusiness,
    ChevronRight,
    CirclePlus,
    Edit3,
    RefreshCw,
    Search,
    Star,
} from "lucide-react";

import PageHeader from "@/components/cms/PageHeader";
import { type Project, getProjects } from "@/lib/api/projects";

type StatusFilter = "all" | "active" | "inactive";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [areaFilter, setAreaFilter] = useState("all");

    async function loadProjects() {
        try {
            setLoading(true);
            setError(null);

            const data = await getProjects();

            setProjects(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudieron obtener los proyectos.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadProjects();
    }, []);

    const areas = useMemo(
        () => Array.from(new Set(projects.map((project) => project.area))),
        [projects],
    );

    const filteredProjects = useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase("es");

        return projects.filter((project) => {
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && project.is_active) ||
                (statusFilter === "inactive" && !project.is_active);

            if (!matchesStatus) {
                return false;
            }

            if (areaFilter !== "all" && project.area !== areaFilter) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const searchableValues = [
                project.name,
                project.slug,
                project.description,
            ]
                .filter(Boolean)
                .join(" ")
                .toLocaleLowerCase("es");

            return searchableValues.includes(normalizedSearch);
        });
    }, [projects, search, statusFilter, areaFilter]);

    const activeCount = useMemo(
        () => projects.filter((project) => project.is_active).length,
        [projects],
    );

    const starredCount = useMemo(
        () => projects.filter((project) => project.starred).length,
        [projects],
    );

    return (
        <>
            <PageHeader
                eyebrow="Contenido"
                title="Proyectos"
                description="Administra el portafolio de proyectos de SupplyMentum, su categoría, año y visibilidad pública."
                action={
                    <Link
                        href="/admin/projects/new"
                        className="cms-button-primary"
                    >
                        <CirclePlus size={16} />
                        Nuevo proyecto
                    </Link>
                }
            />

            <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SummaryCard label="Total" value={projects.length} />
                <SummaryCard label="Activos" value={activeCount} />
                <SummaryCard label="Destacados" value={starredCount} />
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
                            placeholder="Buscar por nombre, slug o descripción..."
                            className="cms-input pl-11"
                        />
                    </div>

                    <div className="flex w-full gap-2 sm:w-auto">
                        <select
                            value={areaFilter}
                            onChange={(event) =>
                                setAreaFilter(event.target.value)
                            }
                            className="cms-input min-w-[160px] cursor-pointer"
                            aria-label="Filtrar proyectos por categoría"
                        >
                            <option value="all">Todas las categorías</option>

                            {areas.map((area) => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value as StatusFilter,
                                )
                            }
                            className="cms-input min-w-[150px] cursor-pointer"
                            aria-label="Filtrar proyectos por estado"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </select>

                        <button
                            type="button"
                            onClick={() => void loadProjects()}
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
                    <ErrorState
                        message={error}
                        onRetry={() => void loadProjects()}
                    />
                ) : filteredProjects.length === 0 ? (
                    <EmptyState hasProjects={projects.length > 0} />
                ) : (
                    <ProjectsTable projects={filteredProjects} />
                )}

                {!loading && !error && projects.length > 0 && (
                    <div className="flex flex-col gap-1 border-t border-[#22222A] px-5 py-4 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            Mostrando {filteredProjects.length} de{" "}
                            {projects.length} proyectos
                        </span>
                    </div>
                )}
            </section>
        </>
    );
}

function ProjectsTable({ projects }: { projects: Project[] }) {
    return (
        <div className="cms-scrollbar overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="bg-[#0C0C0F]">
                    <tr className="border-b border-[#22222A]">
                        <TableHeader>Proyecto</TableHeader>
                        <TableHeader>Categoría</TableHeader>
                        <TableHeader>Año</TableHeader>
                        <TableHeader>Estado</TableHeader>

                        <th className="w-[120px] px-5 py-4 text-right font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {projects.map((project) => (
                        <ProjectRow
                            key={project.project_id}
                            project={project}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ProjectRow({ project }: { project: Project }) {
    return (
        <tr className="group border-b border-[#1D1D23] transition-colors last:border-b-0 hover:bg-white/[0.018]">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#292930] bg-[#17171C] text-zinc-400">
                        {project.starred ? (
                            <Star
                                size={16}
                                className="text-[#ED1C24]"
                                fill="currentColor"
                            />
                        ) : (
                            <BriefcaseBusiness size={16} />
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="max-w-[280px] truncate text-sm font-semibold text-zinc-200">
                            {project.name}
                        </p>

                        <span className="text-[11px] text-zinc-700">
                            /{project.slug}
                        </span>
                    </div>
                </div>
            </td>

            <td className="px-5 py-4">
                <span className="inline-flex items-center border border-[#292930] bg-[#0D0D10] px-2.5 py-1 text-xs text-zinc-400">
                    {project.area}
                </span>
            </td>

            <td className="px-5 py-4">
                <span className="text-sm tabular-nums text-zinc-500">
                    {project.year}
                </span>
            </td>

            <td className="px-5 py-4">
                <StatusBadge active={project.is_active} />
            </td>

            <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                    <Link
                        href={`/admin/projects/${project.project_id}`}
                        title="Editar proyecto"
                        aria-label={`Editar ${project.name}`}
                        className="flex h-9 w-9 items-center justify-center border border-[#292930] text-zinc-600 transition-colors hover:border-zinc-500 hover:text-white"
                    >
                        <Edit3 size={15} />
                    </Link>

                    <Link
                        href={`/admin/projects/${project.project_id}`}
                        title="Ver proyecto"
                        aria-label={`Ver ${project.name}`}
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
            {active ? "Activo" : "Inactivo"}
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

            <BriefcaseBusiness
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
            <RefreshCw size={25} className="animate-spin text-[#ED1C24]" />

            <p className="mt-4 text-sm font-semibold text-zinc-400">
                Cargando proyectos...
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
                No se pudieron cargar los proyectos
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

function EmptyState({ hasProjects }: { hasProjects: boolean }) {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-[#292930] bg-[#0D0D10]">
                <BriefcaseBusiness size={21} className="text-zinc-600" />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-300">
                {hasProjects
                    ? "No se encontraron resultados"
                    : "Todavía no hay proyectos"}
            </p>

            <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                {hasProjects
                    ? "Prueba modificando la búsqueda o los filtros."
                    : "Crea el primer proyecto para comenzar a gestionar esta sección."}
            </p>

            {!hasProjects && (
                <Link
                    href="/admin/projects/new"
                    className="cms-button-primary mt-5"
                >
                    <CirclePlus size={15} />
                    Nuevo proyecto
                </Link>
            )}
        </div>
    );
}
