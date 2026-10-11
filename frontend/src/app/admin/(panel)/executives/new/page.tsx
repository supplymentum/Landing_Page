import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ExecutiveForm from "@/components/cms/executives/ExecutiveForm";
import PageHeader from "@/components/cms/PageHeader";

export default function NewExecutivePage() {
    return (
        <>
            <div className="mb-5">
                <Link
                    href="/admin/executives"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 transition-colors hover:text-white"
                >
                    <ArrowLeft size={14} />
                    Volver a directivos
                </Link>
            </div>

            <PageHeader
                eyebrow="Directivos"
                title="Nuevo directivo"
                description="Registra un nuevo directivo dentro de la estructura organizacional de SupplyMentum."
            />

            <div className="mx-auto max-w-5xl">
                <ExecutiveForm mode="create" />
            </div>
        </>
    );
}