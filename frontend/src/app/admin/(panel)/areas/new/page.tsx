import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import AreaForm from "@/components/cms/areas/AreaForm";
import PageHeader from "@/components/cms/PageHeader";

export default function NewAreaPage() {
    return (
        <>
            <div className="mb-5">
                <Link
                    href="/admin/areas"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 transition-colors hover:text-white"
                >
                    <ArrowLeft size={14} />
                    Volver a áreas
                </Link>
            </div>

            <PageHeader
                eyebrow="Áreas"
                title="Nueva área"
                description="Registra una nueva área dentro de la estructura organizacional de SupplyMentum."
            />

            <div className="mx-auto max-w-5xl">
                <AreaForm mode="create" />
            </div>
        </>
    );
}