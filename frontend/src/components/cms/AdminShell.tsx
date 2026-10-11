"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { checkAdminSession } from "@/lib/api/auth";

interface AdminShellProps {
    children: React.ReactNode;
}

export default function AdminShell({
    children,
}: AdminShellProps) {
    const router = useRouter();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        async function verifySession() {
            const authenticated = await checkAdminSession();

            if (!authenticated) {
                router.replace("/admin/login");
                return;
            }

            setCheckingSession(false);
        }

        void verifySession();
    }, [router]);

    if (checkingSession) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#070709]">
                <div className="flex flex-col items-center text-center">
                    <Loader2
                        size={28}
                        className="animate-spin text-[#ED1C24]"
                    />

                    <p className="mt-4 text-sm font-semibold text-zinc-400">
                        Verificando sesión...
                    </p>

                    <p className="mt-1 text-xs text-zinc-700">
                        Validando acceso al CMS.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070709] text-zinc-100">
            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="lg:pl-[260px]">
                <AdminHeader
                    onOpenSidebar={() => setSidebarOpen(true)}
                />

                <main className="min-h-[calc(100vh-72px)]">
                    <div className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-7 lg:px-10 lg:py-9">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}