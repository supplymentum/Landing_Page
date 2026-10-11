"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    Boxes,
    BriefcaseBusiness,
    CalendarDays,
    ChevronRight,
    CircleUserRound,
    FileUser,
    HelpCircle,
    Images,
    LayoutDashboard,
    Loader2,
    LogOut,
    Network,
    PanelLeftClose,
    Settings,
    X,
} from "lucide-react";

import { logoutAdmin } from "@/lib/api/auth";

interface AdminSidebarProps {
    open: boolean;
    onClose: () => void;
}

interface SidebarItem {
    label: string;
    href: string;
    icon: React.ComponentType<{
        size?: number;
        strokeWidth?: number;
        className?: string;
    }>;
}

const navigationGroups: {
    label: string;
    items: SidebarItem[];
}[] = [
        {
            label: "General",
            items: [
                {
                    label: "Dashboard",
                    href: "/admin",
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            label: "Contenido",
            items: [
                {
                    label: "Áreas",
                    href: "/admin/areas",
                    icon: Network,
                },
                {
                    label: "Directivos",
                    href: "/admin/executives",
                    icon: CircleUserRound,
                },
                {
                    label: "Eventos",
                    href: "/admin/events",
                    icon: CalendarDays,
                },
                {
                    label: "Proyectos",
                    href: "/admin/projects",
                    icon: BriefcaseBusiness,
                },
                {
                    label: "Preguntas Frecuentes",
                    href: "/admin/faq",
                    icon: HelpCircle,
                },
            ],
        },
        {
            label: "Gestión",
            items: [
                {
                    label: "Postulantes",
                    href: "/admin/applications",
                    icon: FileUser,
                },
                {
                    label: "Conf. Convocatoria",
                    href: "/admin/convocatoria-settings",
                    icon: Settings,
                },
                {
                    label: "Multimedia",
                    href: "/admin/media",
                    icon: Images,
                },
            ],
        },
    ];

export default function AdminSidebar({
    open,
    onClose,
}: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    async function handleLogout() {
        try {
            setLoggingOut(true);
            setLogoutError(null);

            await logoutAdmin();

            router.replace("/admin/login");
            router.refresh();
        } catch (error) {
            setLogoutError(
                error instanceof Error
                    ? error.message
                    : "No se pudo cerrar la sesión.",
            );
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <>
            {open && (
                <button
                    type="button"
                    aria-label="Cerrar menú"
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px] lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col
          border-r border-[#22222A] bg-[#0A0A0D]
          transition-transform duration-300
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="flex h-[72px] items-center justify-between border-b border-[#22222A] px-5">
                    <Link
                        href="/admin"
                        onClick={onClose}
                        className="flex min-w-0 items-center gap-3"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#2A2A31] bg-[#111115]">
                            <Boxes
                                size={18}
                                strokeWidth={1.8}
                                className="text-[#ED1C24]"
                            />
                        </div>

                        <div className="min-w-0">
                            <Image
                                src="/logo.png"
                                alt="SupplyMentum"
                                width={894}
                                height={226}
                                priority
                                className="h-6 w-auto object-contain"
                            />

                            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.26em] text-zinc-600">
                                Content Management
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-zinc-500 transition-colors hover:text-white lg:hidden"
                        aria-label="Cerrar menú"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-5">
                    {navigationGroups.map((group) => (
                        <div
                            key={group.label}
                            className="mb-7"
                        >
                            <p className="mb-2 px-3 font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">
                                {group.label}
                            </p>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            className={`
                        group relative flex h-11 items-center gap-3 px-3
                        font-[family-name:var(--font-archivo)]
                        text-[12px] font-semibold uppercase tracking-[0.08em]
                        transition-colors
                        ${active
                                                    ? "bg-[#ED1C24]/10 text-white"
                                                    : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200"
                                                }
                      `}
                                        >
                                            {active && (
                                                <span className="absolute inset-y-0 left-0 w-[2px] bg-[#ED1C24]" />
                                            )}

                                            <Icon
                                                size={17}
                                                strokeWidth={1.8}
                                                className={
                                                    active
                                                        ? "text-[#ED1C24]"
                                                        : "text-zinc-600 transition-colors group-hover:text-zinc-400"
                                                }
                                            />

                                            <span className="flex-1">
                                                {item.label}
                                            </span>

                                            {active && (
                                                <ChevronRight
                                                    size={14}
                                                    className="text-[#ED1C24]"
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="border-t border-[#22222A] p-3">
                    {logoutError && (
                        <div className="mb-2 border border-red-900/40 bg-red-950/20 px-3 py-2">
                            <p className="text-[11px] leading-4 text-red-400">
                                {logoutError}
                            </p>
                        </div>
                    )}

                    <Link
                        href="/"
                        className="flex h-11 items-center gap-3 px-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-zinc-500 transition-colors hover:bg-white/[0.03] hover:text-white"
                    >
                        <PanelLeftClose
                            size={17}
                            strokeWidth={1.8}
                        />

                        Ver sitio
                    </Link>

                    <button
                        type="button"
                        onClick={() => void handleLogout()}
                        disabled={loggingOut}
                        className="flex h-11 w-full items-center gap-3 px-3 text-left text-[12px] font-semibold uppercase tracking-[0.08em] text-zinc-500 transition-colors hover:bg-red-950/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loggingOut ? (
                            <Loader2
                                size={17}
                                strokeWidth={1.8}
                                className="animate-spin"
                            />
                        ) : (
                            <LogOut
                                size={17}
                                strokeWidth={1.8}
                            />
                        )}

                        {loggingOut
                            ? "Cerrando sesión..."
                            : "Cerrar sesión"}
                    </button>
                </div>
            </aside>
        </>
    );
}