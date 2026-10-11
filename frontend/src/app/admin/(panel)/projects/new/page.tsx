import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ProjectForm from "@/components/cms/projects/ProjectForm";
import PageHeader from "@/components/cms/PageHeader";

export default function NewProjectPage() {
    return (
        <>
            <div className="mb-5">
                <Link
                    href="/admin/projects"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 transition-colors hover:text-white"
                >
                    <ArrowLeft size={14} />
                    Volver a proyectos
                </Link>
            </div>

            <PageHeader
                eyebrow="Proyectos"
                title="Nuevo proyecto"
                description="Registra un nuevo proyecto en el portafolio de SupplyMentum."
            />

            <div className="mx-auto max-w-5xl">
                <ProjectForm mode="create" />
            </div>
        </>
    );
}
