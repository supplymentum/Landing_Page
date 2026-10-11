"use client";

import {
    Menu,
    Search,
    ShieldCheck,
} from "lucide-react";

interface AdminHeaderProps {
    onOpenSidebar: () => void;
}

export default function AdminHeader({
    onOpenSidebar,
}: AdminHeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#22222A] bg-[#0A0A0D]/95 px-5 backdrop-blur-md sm:px-7 lg:px-10">
            <div className="flex min-w-0 items-center gap-4">
                <button
                    type="button"
                    onClick={onOpenSidebar}
                    aria-label="Abrir menú"
                    className="flex h-9 w-9 items-center justify-center border border-[#292930] text-zinc-500 transition-colors hover:border-zinc-600 hover:text-white lg:hidden"
                >
                    <Menu size={18} />
                </button>

                <div className="hidden items-center gap-3 lg:flex">
                    <Search
                        size={16}
                        className="text-zinc-600"
                    />

                    <span className="text-[12px] text-zinc-600">
                        Panel de administración
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 border border-[#292930] bg-[#111115] px-3 py-2 sm:flex">
                    <ShieldCheck
                        size={14}
                        className="text-[#ED1C24]"
                    />

                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                        Sesión segura
                    </span>
                </div>

                <div className="flex items-center gap-3 border-l border-[#292930] pl-3">
                    <div className="flex h-9 w-9 items-center justify-center bg-[#ED1C24] font-[family-name:var(--font-archivo)] text-xs font-extrabold text-white">
                        AD
                    </div>

                    <div className="hidden leading-tight md:block">
                        <p className="text-xs font-semibold text-zinc-200">
                            Administrador
                        </p>

                        <p className="mt-1 text-[10px] text-zinc-600">
                            CMS SupplyMentum
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}