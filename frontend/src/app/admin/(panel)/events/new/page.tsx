import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import EventForm from "@/components/cms/events/EventForm";
import PageHeader from "@/components/cms/PageHeader";

export default function NewEventPage() {
    return (
        <>
            <div className="mb-5">
                <Link
                    href="/admin/events"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 transition-colors hover:text-white"
                >
                    <ArrowLeft size={14} />
                    Volver a eventos
                </Link>
            </div>

            <PageHeader
                eyebrow="Eventos"
                title="Nuevo evento"
                description="Registra un nuevo evento para la comunidad de SupplyMentum."
            />

            <div className="mx-auto max-w-5xl">
                <EventForm mode="create" />
            </div>
        </>
    );
}
