"use client";

import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    Check,
    ChevronDown,
    FileUser,
    Loader2,
    RefreshCw,
    RotateCcw,
    Search,
    Trash2,
    X,
} from "lucide-react";

import PageHeader from "@/components/cms/PageHeader";
import {
    type Applicant,
    type ApplicantStatus,
    type ApplicationArea,
    getApplicants,
    getApplicationAreas,
    removeApplicant,
    updateApplicantStatus,
} from "@/lib/api/applications";

const DATE_FORMATTER = new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Lima",
});

export default function ApplicationsPage() {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [areas, setAreas] = useState<ApplicationArea[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [areaFilter, setAreaFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState<"all" | ApplicantStatus>(
        "all",
    );
    const [expanded, setExpanded] = useState<string | null>(null);

    /* ID de la postulación sobre la que se está ejecutando una acción */
    const [acting, setActing] = useState<string | null>(null);

    /**
     * Cambia el estado y refleja el resultado en la lista sin recargar
     * todo el listado.
     */
    async function handleStatusChange(
        applicantId: string,
        status: ApplicantStatus,
    ) {
        try {
            setActing(applicantId);
            setError(null);

            const updated = await updateApplicantStatus(applicantId, status);

            setApplicants((current) =>
                current.map((applicant) =>
                    applicant.applicant_id === applicantId
                        ? { ...applicant, status: updated.status }
                        : applicant,
                ),
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo actualizar la postulación.",
            );
        } finally {
            setActing(null);
        }
    }

    async function handleDelete(applicant: Applicant) {
        if (!applicant.applicant_id) {
            return;
        }

        const confirmed = window.confirm(
            `¿Eliminar la postulación de ${applicant.first_name} ${applicant.last_name}? Esta acción no se puede deshacer y esa cuenta podrá volver a postular.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setActing(applicant.applicant_id);
            setError(null);

            await removeApplicant(applicant.applicant_id);

            setApplicants((current) =>
                current.filter(
                    (item) => item.applicant_id !== applicant.applicant_id,
                ),
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo eliminar la postulación.",
            );
        } finally {
            setActing(null);
        }
    }

    async function loadApplicants() {
        try {
            setLoading(true);
            setError(null);

            const [applicantsData, areasData] = await Promise.all([
                getApplicants(),
                getApplicationAreas(),
            ]);

            setApplicants(applicantsData);
            setAreas(areasData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudieron obtener las postulaciones.",
            );
        } finally {
            setLoading(false);
        }
    }

    function exportToCsv() {
        if (!applicants.length) return;

        // Definir los encabezados del CSV
        const headers = [
            "ID",
            "Nombres",
            "Apellidos",
            "Correo",
            "Teléfono",
            "Carrera",
            "Código UNI",
            "Ciclo",
            "Primera Opción",
            "Segunda Opción",
            "Motivo",
            "Estado",
            "Fecha de Postulación"
        ];

        // Crear las filas
        const rows = applicants.map((a) => {
            const firstChoice = areas.find(area => area.area_id === a.first_choice_area_id)?.name || a.first_choice_area_id;
            const secondChoice = a.second_choice_area_id ? (areas.find(area => area.area_id === a.second_choice_area_id)?.name || a.second_choice_area_id) : "N/A";
            const date = a.created_at ? DATE_FORMATTER.format(new Date(a.created_at)) : "N/A";
            
            // Función para escapar strings en CSV
            const escapeCsv = (str: string) => {
                if (!str) return '""';
                return `"${String(str).replace(/"/g, '""')}"`;
            };

            return [
                a.applicant_id,
                a.first_name,
                a.last_name,
                a.email,
                a.phone,
                a.career,
                a.codigo_uni,
                a.university_semester,
                firstChoice,
                secondChoice,
                a.application_reason,
                a.status,
                date
            ].map(escapeCsv).join(",");
        });

        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" }); // BOM for Excel
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `postulantes_convocatoria_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    useEffect(() => {
        void loadApplicants();
    }, []);

    const areaNameById = useMemo(() => {
        const map = new Map<number, string>();

        for (const area of areas) {
            map.set(area.area_id, area.name);
        }

        return map;
    }, [areas]);

    const filteredApplicants = useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase("es");

        return applicants.filter((applicant) => {
            if (
                areaFilter !== "all" &&
                String(applicant.first_choice_area_id) !== areaFilter &&
                String(applicant.second_choice_area_id ?? "") !== areaFilter
            ) {
                return false;
            }

            if (statusFilter !== "all" && applicant.status !== statusFilter) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const searchableValues = [
                applicant.first_name,
                applicant.last_name,
                applicant.email,
                applicant.career,
                applicant.codigo_uni,
            ]
                .filter(Boolean)
                .join(" ")
                .toLocaleLowerCase("es");

            return searchableValues.includes(normalizedSearch);
        });
    }, [applicants, search, areaFilter, statusFilter]);

    return (
        <>
            <PageHeader
                eyebrow="Gestión"
                title="Convocatorias"
                description="Revisa las postulaciones recibidas desde el formulario público de convocatoria."
                action={
                    <button
                        type="button"
                        onClick={exportToCsv}
                        disabled={applicants.length === 0}
                        className="cms-button-secondary bg-[#111115] hover:bg-zinc-800"
                    >
                        Exportar a CSV
                    </button>
                }
            />

            <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
                <SummaryCard label="Total" value={applicants.length} />
                <SummaryCard
                    label="Pendientes"
                    value={
                        applicants.filter((a) => a.status === "pendiente")
                            .length
                    }
                />
                <SummaryCard
                    label="Aceptados"
                    value={
                        applicants.filter((a) => a.status === "aceptado").length
                    }
                />
                <SummaryCard
                    label="Rechazados"
                    value={
                        applicants.filter((a) => a.status === "rechazado")
                            .length
                    }
                />
            </section>

            {error && !loading && (
                <div className="mb-5 border border-red-900/50 bg-red-950/20 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

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
                            placeholder="Buscar por nombre, correo, carrera..."
                            className="cms-input pl-11"
                        />
                    </div>

                    <div className="flex w-full gap-2 sm:w-auto">
                        <select
                            value={areaFilter}
                            onChange={(event) =>
                                setAreaFilter(event.target.value)
                            }
                            className="cms-input min-w-[190px] cursor-pointer"
                            aria-label="Filtrar postulaciones por área"
                        >
                            <option value="all">Todas las áreas</option>

                            {areas.map((area) => (
                                <option key={area.area_id} value={area.area_id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value as
                                        | "all"
                                        | ApplicantStatus,
                                )
                            }
                            className="cms-input min-w-[160px] cursor-pointer"
                            aria-label="Filtrar postulaciones por estado"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="aceptado">Aceptados</option>
                            <option value="rechazado">Rechazados</option>
                        </select>

                        <button
                            type="button"
                            onClick={() => void loadApplicants()}
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
                        onRetry={() => void loadApplicants()}
                    />
                ) : filteredApplicants.length === 0 ? (
                    <EmptyState hasApplicants={applicants.length > 0} />
                ) : (
                    <ul className="divide-y divide-[#1D1D23]">
                        {filteredApplicants.map((applicant, index) => {
                            const id = applicant.applicant_id ?? String(index);
                            const isOpen = expanded === id;

                            return (
                                <li key={id}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpanded(isOpen ? null : id)
                                        }
                                        className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-white/[0.018] sm:p-5"
                                        aria-expanded={isOpen}
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#292930] bg-[#17171C] font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase text-zinc-400">
                                            {applicant.first_name.charAt(0)}
                                            {applicant.last_name.charAt(0)}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-zinc-200">
                                                {applicant.first_name}{" "}
                                                {applicant.last_name}
                                            </p>

                                            <p className="mt-1 truncate text-xs text-zinc-600">
                                                {applicant.email} ·{" "}
                                                {applicant.career}
                                            </p>
                                        </div>

                                        <div className="hidden shrink-0 sm:block">
                                            <span className="inline-flex items-center border border-[#292930] bg-[#0D0D10] px-2.5 py-1 text-xs text-zinc-400">
                                                {areaNameById.get(
                                                    applicant.first_choice_area_id,
                                                ) ?? "Área desconocida"}
                                            </span>
                                        </div>

                                        <div className="shrink-0">
                                            <StatusBadge
                                                status={applicant.status}
                                            />
                                        </div>

                                        <div className="hidden shrink-0 text-xs text-zinc-600 md:block">
                                            {applicant.created_at
                                                ? DATE_FORMATTER.format(
                                                      new Date(
                                                          applicant.created_at,
                                                      ),
                                                  )
                                                : "—"}
                                        </div>

                                        <ChevronDown
                                            size={16}
                                            className={`shrink-0 text-zinc-600 transition-transform ${
                                                isOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {isOpen && (
                                        <div className="grid grid-cols-1 gap-4 border-t border-[#1D1D23] bg-[#0D0D10] p-5 sm:grid-cols-2">
                                            <Detail
                                                label="Teléfono"
                                                value={applicant.phone}
                                            />
                                            <Detail
                                                label="Código UNI"
                                                value={applicant.codigo_uni}
                                            />
                                            <Detail
                                                label="Ciclo"
                                                value={
                                                    applicant.university_semester
                                                }
                                            />
                                            <Detail
                                                label="Segunda opción"
                                                value={
                                                    applicant.second_choice_area_id
                                                        ? (areaNameById.get(
                                                              applicant.second_choice_area_id,
                                                          ) ?? "—")
                                                        : "—"
                                                }
                                            />

                                            <div className="sm:col-span-2">
                                                <p className="font-[family-name:var(--font-archivo)] text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                                                    Motivo de postulación
                                                </p>

                                                <p className="mt-2 text-sm leading-6 text-zinc-400">
                                                    {
                                                        applicant.application_reason
                                                    }
                                                </p>
                                            </div>

                                            {applicant.applicant_id && (
                                                <div className="flex flex-wrap items-center gap-2 border-t border-[#1D1D23] pt-4 sm:col-span-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            void handleStatusChange(
                                                                applicant.applicant_id!,
                                                                "aceptado",
                                                            )
                                                        }
                                                        disabled={
                                                            acting === id ||
                                                            applicant.status ===
                                                                "aceptado"
                                                        }
                                                        className="inline-flex items-center gap-2 border border-emerald-900/50 bg-emerald-950/10 px-4 py-2.5 font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-500 transition-colors hover:bg-emerald-950/30 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Check size={14} />
                                                        Aceptar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            void handleStatusChange(
                                                                applicant.applicant_id!,
                                                                "rechazado",
                                                            )
                                                        }
                                                        disabled={
                                                            acting === id ||
                                                            applicant.status ===
                                                                "rechazado"
                                                        }
                                                        className="inline-flex items-center gap-2 border border-[#303037] bg-[#151519] px-4 py-2.5 font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <X size={14} />
                                                        Rechazar
                                                    </button>

                                                    {applicant.status !==
                                                        "pendiente" && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                void handleStatusChange(
                                                                    applicant.applicant_id!,
                                                                    "pendiente",
                                                                )
                                                            }
                                                            disabled={
                                                                acting === id
                                                            }
                                                            className="inline-flex items-center gap-2 border border-[#303037] bg-[#151519] px-4 py-2.5 font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <RotateCcw
                                                                size={14}
                                                            />
                                                            Volver a pendiente
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            void handleDelete(
                                                                applicant,
                                                            )
                                                        }
                                                        disabled={acting === id}
                                                        className="ml-auto inline-flex items-center gap-2 border border-red-900/50 bg-red-950/10 px-4 py-2.5 font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.12em] text-red-400 transition-colors hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        {acting === id ? (
                                                            <Loader2
                                                                size={14}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Trash2 size={14} />
                                                        )}
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </>
    );
}

function Detail({
    label,
    value,
}: {
    label: string;
    value: string | undefined;
}) {
    return (
        <div>
            <p className="font-[family-name:var(--font-archivo)] text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                {label}
            </p>

            <p className="mt-1 text-sm text-zinc-300">{value || "—"}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: ApplicantStatus }) {
    const styles: Record<ApplicantStatus, string> = {
        pendiente: "border-amber-900/40 bg-amber-950/20 text-amber-500",
        aceptado: "border-emerald-900/40 bg-emerald-950/20 text-emerald-500",
        rechazado: "border-[#303037] bg-[#151519] text-zinc-500",
    };

    const dots: Record<ApplicantStatus, string> = {
        pendiente: "bg-amber-500",
        aceptado: "bg-emerald-500",
        rechazado: "bg-zinc-600",
    };

    return (
        <span
            className={`inline-flex items-center gap-2 border px-2.5 py-1.5 font-[family-name:var(--font-archivo)] text-[9px] font-bold uppercase tracking-[0.13em] ${styles[status]}`}
        >
            <span className={`h-1.5 w-1.5 ${dots[status]}`} />
            {status}
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

            <FileUser size={18} strokeWidth={1.5} className="text-zinc-700" />
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <RefreshCw size={25} className="animate-spin text-[#ED1C24]" />

            <p className="mt-4 text-sm font-semibold text-zinc-400">
                Cargando postulaciones...
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
                No se pudieron cargar las postulaciones
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

function EmptyState({ hasApplicants }: { hasApplicants: boolean }) {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-[#292930] bg-[#0D0D10]">
                <FileUser size={21} className="text-zinc-600" />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-300">
                {hasApplicants
                    ? "No se encontraron resultados"
                    : "Todavía no hay postulaciones"}
            </p>

            <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                {hasApplicants
                    ? "Prueba modificando la búsqueda o el filtro de área."
                    : "Las postulaciones enviadas desde la página de convocatoria aparecerán aquí."}
            </p>
        </div>
    );
}
