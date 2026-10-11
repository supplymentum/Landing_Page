"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    ArrowRight,
    BriefcaseBusiness,
    CalendarDays,
    CircleUserRound,
    FileUser,
    Loader2,
    Network,
    RefreshCw,
} from "lucide-react";

import PageHeader from "@/components/cms/PageHeader";
import StatCard from "@/components/cms/StatCard";

import {
    type Area,
    getAreas,
} from "@/lib/api/areas";

import {
    type Executive,
    getExecutives,
} from "@/lib/api/executives";

interface DashboardData {
    areas: Area[];
    executives: Executive[];
}

const quickAccess = [
    {
        id: 1,
        title: "Áreas",
        description:
            "Administra las áreas y su información pública.",
        href: "/admin/areas",
    },
    {
        id: 2,
        title: "Directivos",
        description:
            "Gestiona directivos, cargos, áreas y visibilidad.",
        href: "/admin/executives",
    },
    {
        id: 3,
        title: "Eventos",
        description:
            "Administración de eventos y publicaciones.",
        href: "/admin/events",
    },
    {
        id: 4,
        title: "Proyectos",
        description:
            "Gestión del portafolio de proyectos.",
        href: "/admin/projects",
    },
];

export default function AdminDashboardPage() {
    const [data, setData] =
        useState<DashboardData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    async function loadDashboard() {
        try {
            setLoading(true);
            setError(null);

            const [
                areas,
                executives,
            ] = await Promise.all([
                getAreas(),
                getExecutives(),
            ]);

            setData({
                areas,
                executives,
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo cargar la información del dashboard.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadDashboard();
    }, []);

    const totalAreas =
        data?.areas.length ?? 0;

    const activeAreas =
        data?.areas.filter(
            (area) => area.is_active,
        ).length ?? 0;

    const totalExecutives =
        data?.executives.length ?? 0;

    const activeExecutives =
        data?.executives.filter(
            (executive) =>
                executive.is_active,
        ).length ?? 0;

    return (
        <>
            <PageHeader
                eyebrow="Panel administrativo"
                title="Dashboard"
                description="Administra el contenido público de SupplyMentum desde un único panel."
                action={
                    <button
                        type="button"
                        onClick={() =>
                            void loadDashboard()
                        }
                        disabled={loading}
                        className="cms-button-secondary"
                    >
                        <RefreshCw
                            size={14}
                            className={
                                loading
                                    ? "animate-spin"
                                    : undefined
                            }
                        />

                        Actualizar
                    </button>
                }
            />

            {error && (
                <div className="mb-6 border border-red-900/50 bg-red-950/20 px-4 py-3">
                    <p className="text-sm text-red-400">
                        {error}
                    </p>
                </div>
            )}

            {loading && !data ? (
                <LoadingDashboard />
            ) : (
                <>
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            label="Áreas"
                            value={totalAreas}
                            detail={`${activeAreas} activas`}
                            icon={Network}
                            href="/admin/areas"
                        />

                        <StatCard
                            label="Directivos"
                            value={totalExecutives}
                            detail={`${activeExecutives} activos`}
                            icon={CircleUserRound}
                            href="/admin/executives"
                        />

                        <StatCard
                            label="Eventos"
                            value="—"
                            detail="Pendiente de integración"
                            icon={CalendarDays}
                            href="/admin/events"
                        />

                        <StatCard
                            label="Proyectos"
                            value="—"
                            detail="Pendiente de integración"
                            icon={BriefcaseBusiness}
                            href="/admin/projects"
                        />
                    </section>

                    <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="border border-[#22222A] bg-[#111115]">
                            <div className="border-b border-[#22222A] px-5 py-4 sm:px-6">
                                <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                                    Acceso rápido
                                </p>

                                <h2 className="mt-1 text-base font-semibold text-zinc-200">
                                    Gestión de contenido
                                </h2>
                            </div>

                            <div className="divide-y divide-[#22222A]">
                                {quickAccess.map(
                                    (item) => (
                                        <Link
                                            key={item.id}
                                            href={item.href}
                                            className="group flex items-center justify-between gap-5 px-5 py-5 transition-colors hover:bg-white/[0.02] sm:px-6"
                                        >
                                            <div>
                                                <h3 className="text-sm font-semibold text-zinc-200 transition-colors group-hover:text-white">
                                                    {item.title}
                                                </h3>

                                                <p className="mt-1 text-xs leading-5 text-zinc-600">
                                                    {item.description}
                                                </p>
                                            </div>

                                            <ArrowRight
                                                size={17}
                                                className="shrink-0 text-zinc-700 transition-all group-hover:translate-x-1 group-hover:text-[#ED1C24]"
                                            />
                                        </Link>
                                    ),
                                )}
                            </div>
                        </div>

                        <div className="border border-[#22222A] bg-[#111115]">
                            <div className="border-b border-[#22222A] px-5 py-4">
                                <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                                    Resumen
                                </p>

                                <h2 className="mt-1 text-base font-semibold text-zinc-200">
                                    Contenido activo
                                </h2>
                            </div>

                            <div className="space-y-5 p-5">
                                <ContentStatus
                                    label="Áreas visibles"
                                    current={activeAreas}
                                    total={totalAreas}
                                />

                                <ContentStatus
                                    label="Directivos visibles"
                                    current={activeExecutives}
                                    total={
                                        totalExecutives
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 border border-[#22222A] bg-[#0D0D10] px-5 py-5 sm:px-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#292930]">
                                    <FileUser
                                        size={18}
                                        className="text-[#FFBD59]"
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-zinc-300">
                                        Convocatorias
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                                        Revisa y administra las postulaciones recibidas.
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/admin/applications"
                                className="cms-button-secondary"
                            >
                                Ver módulo
                            </Link>
                        </div>
                    </section>
                </>
            )}
        </>
    );
}

function LoadingDashboard() {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <Loader2
                size={28}
                className="animate-spin text-[#ED1C24]"
            />

            <p className="mt-4 text-sm font-semibold text-zinc-400">
                Cargando dashboard...
            </p>

            <p className="mt-1 text-xs text-zinc-700">
                Consultando información del CMS.
            </p>
        </div>
    );
}

interface ContentStatusProps {
    label: string;
    current: number;
    total: number;
}

function ContentStatus({
    label,
    current,
    total,
}: ContentStatusProps) {
    const percentage =
        total > 0
            ? Math.round(
                (current / total) * 100,
            )
            : 0;

    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-xs text-zinc-500">
                    {label}
                </span>

                <span className="text-xs font-semibold tabular-nums text-zinc-400">
                    {current}/{total}
                </span>
            </div>

            <div className="h-1.5 overflow-hidden bg-[#202027]">
                <div
                    className="h-full bg-[#ED1C24] transition-all"
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>

            <p className="mt-2 text-[10px] tabular-nums text-zinc-700">
                {percentage}% activo
            </p>
        </div>
    );
}