"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertCircle,
    ArrowRight,
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    UserRound,
} from "lucide-react";

import {
    checkAdminSession,
    loginAdmin,
} from "@/lib/api/auth";

export default function AdminLoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [checkingSession, setCheckingSession] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        async function verifyExistingSession() {
            const authenticated =
                await checkAdminSession();

            if (authenticated) {
                router.replace("/admin");
                return;
            }

            setCheckingSession(false);
        }

        void verifyExistingSession();
    }, [router]);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const cleanUsername = username.trim();

        if (!cleanUsername) {
            setError(
                "Ingresa tu nombre de usuario.",
            );
            return;
        }

        if (!password) {
            setError(
                "Ingresa tu contraseña.",
            );
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            await loginAdmin({
                username: cleanUsername,
                password,
            });

            router.replace("/admin");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo iniciar sesión.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (checkingSession) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#070709]">
                <Loader2
                    size={28}
                    className="animate-spin text-[#ED1C24]"
                />
            </div>
        );
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070709] px-5 py-10">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[#ED1C24]/30 to-transparent" />

                <div className="absolute -left-40 top-1/3 h-80 w-80 bg-[#ED1C24]/[0.035] blur-3xl" />

                <div className="absolute -right-40 bottom-0 h-80 w-80 bg-[#FFBD59]/[0.025] blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-[440px]">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#2B2B32] bg-[#111115]">
                        <LockKeyhole
                            size={21}
                            strokeWidth={1.7}
                            className="text-[#ED1C24]"
                        />
                    </div>

                    <p className="mt-5 font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.26em] text-[#ED1C24]">
                        SupplyMentum CMS
                    </p>

                    <h1 className="mt-2 font-[family-name:var(--font-archivo-black)] text-3xl uppercase tracking-[-0.03em] text-white">
                        Iniciar sesión
                    </h1>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-600">
                        Accede al panel administrativo para gestionar el contenido de SupplyMentum.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="border border-[#22222A] bg-[#111115]"
                >
                    <div className="border-b border-[#22222A] px-5 py-4 sm:px-6">
                        <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                            Acceso administrativo
                        </p>
                    </div>

                    <div className="space-y-5 p-5 sm:p-6">
                        {error && (
                            <div className="flex gap-3 border border-red-900/50 bg-red-950/20 px-4 py-3">
                                <AlertCircle
                                    size={17}
                                    className="mt-0.5 shrink-0 text-red-500"
                                />

                                <p className="text-sm leading-5 text-red-400">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="username"
                                className="cms-label"
                            >
                                Usuario
                            </label>

                            <div className="relative">
                                <UserRound
                                    size={16}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                                />

                                <input
                                    id="username"
                                    type="text"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                    placeholder="admin"
                                    className="cms-input !pl-11"
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="cms-label"
                            >
                                Contraseña
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={16}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                                />

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="cms-input !pl-11 !pr-12"
                                    disabled={submitting}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (current) => !current,
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                    className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-zinc-600 transition-colors hover:text-white"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="cms-button-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <>
                                    <Loader2
                                        size={15}
                                        className="animate-spin"
                                    />
                                    Iniciando sesión
                                </>
                            ) : (
                                <>
                                    Ingresar al CMS
                                    <ArrowRight size={15} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <p className="mt-5 text-center text-[11px] leading-5 text-zinc-700">
                    El acceso está restringido a usuarios administradores autorizados.
                </p>
            </div>
        </main>
    );
}