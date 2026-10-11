"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileUser, LogOut, User } from "lucide-react";

import { useGoogleAuth } from "@/lib/useGoogleAuth";

interface UserMenuProps {
    /** En el drawer móvil el menú se muestra expandido, sin desplegable */
    variant?: "desktop" | "mobile";
    onNavigate?: () => void;
}

export default function UserMenu({
    variant = "desktop",
    onNavigate,
}: UserMenuProps) {
    const { user, loading, configured, signIn, signOut } = useGoogleAuth();

    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    /* Cerrar el desplegable al hacer clic fuera o presionar Escape */
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    /* Sin credenciales de Supabase Auth no tiene sentido ofrecer el login */
    if (!configured) {
        return null;
    }

    /* Evita el parpadeo entre "iniciar sesión" y el avatar */
    if (loading) {
        return (
            <div
                className={
                    variant === "desktop"
                        ? "h-10 w-10 animate-pulse rounded-full bg-zinc-800"
                        : "h-10 w-full animate-pulse bg-zinc-800"
                }
            />
        );
    }

    if (!user) {
        return (
            <button
                type="button"
                onClick={() => void signIn()}
                className={
                    variant === "desktop"
                        ? "px-5 py-3.5 text-xs font-extrabold tracking-widest text-zinc-300 uppercase border border-zinc-700 hover:border-zinc-500 hover:text-white transition-colors"
                        : "w-full py-3.5 text-center text-xs font-extrabold tracking-widest text-zinc-300 uppercase border border-zinc-700 hover:border-zinc-500 hover:text-white transition-colors"
                }
            >
                Iniciar sesión
            </button>
        );
    }

    const fullName =
        (user.user_metadata?.full_name as string | undefined) ??
        user.email ??
        "Mi cuenta";

    const avatarUrl =
        (user.user_metadata?.avatar_url as string | undefined) ??
        (user.user_metadata?.picture as string | undefined) ??
        null;

    /* En móvil mostramos las opciones expandidas dentro del drawer */
    if (variant === "mobile") {
        return (
            <div className="border-t border-zinc-800 pt-4">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar url={avatarUrl} name={fullName} size={36} />

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                            {fullName}
                        </p>
                        <p className="truncate text-[11px] text-zinc-500">
                            {user.email}
                        </p>
                    </div>
                </div>

                <Link
                    href="/convocatoria#postula"
                    onClick={onNavigate}
                    className="flex items-center gap-2 py-2 text-xs font-extrabold tracking-wider uppercase text-zinc-400 hover:text-white"
                >
                    <FileUser size={15} />
                    Mi postulación
                </Link>

                <button
                    type="button"
                    onClick={() => {
                        void signOut();
                        onNavigate?.();
                    }}
                    className="flex w-full items-center gap-2 py-2 text-left text-xs font-extrabold tracking-wider uppercase text-zinc-400 hover:text-red-400"
                >
                    <LogOut size={15} />
                    Cerrar sesión
                </button>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Abrir menú de cuenta"
                className={`rounded-full transition-all ${
                    open
                        ? "ring-2 ring-[#ED1C24] ring-offset-2 ring-offset-[#050507]"
                        : "ring-1 ring-zinc-700 hover:ring-zinc-500"
                }`}
            >
                <Avatar url={avatarUrl} name={fullName} size={40} />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+12px)] w-64 border border-zinc-800 bg-[#0A0A0C] shadow-2xl"
                >
                    <div className="flex items-center gap-3 border-b border-zinc-800 p-4">
                        <Avatar url={avatarUrl} name={fullName} size={38} />

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                                {fullName}
                            </p>
                            <p className="truncate text-[11px] text-zinc-500">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="p-1.5">
                        <Link
                            href="/convocatoria#postula"
                            role="menuitem"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                        >
                            <FileUser size={15} />
                            Mi postulación
                        </Link>

                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setOpen(false);
                                void signOut();
                            }}
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-zinc-400 transition-colors hover:bg-red-950/20 hover:text-red-400"
                        >
                            <LogOut size={15} />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function Avatar({
    url,
    name,
    size,
}: {
    url: string | null;
    name: string;
    size: number;
}) {
    const [failed, setFailed] = useState(false);

    if (url && !failed) {
        return (
            // La foto viene de Google (lh3.googleusercontent.com); usamos img
            // simple igual que el resto de imágenes remotas del sitio.
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={url}
                alt={name}
                width={size}
                height={size}
                referrerPolicy="no-referrer"
                onError={() => setFailed(true)}
                className="rounded-full object-cover"
                style={{ width: size, height: size }}
            />
        );
    }

    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();

    return (
        <div
            className="flex items-center justify-center rounded-full bg-[#1A1A20] text-zinc-300"
            style={{ width: size, height: size }}
        >
            {initials ? (
                <span className="text-[11px] font-bold">{initials}</span>
            ) : (
                <User size={16} />
            )}
        </div>
    );
}
