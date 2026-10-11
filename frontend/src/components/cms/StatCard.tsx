import {
    ArrowUpRight,
    type LucideIcon,
} from "lucide-react";

interface StatCardProps {
    label: string;
    value: number | string;
    detail?: string;
    icon: LucideIcon;
    href?: string;
}

export default function StatCard({
    label,
    value,
    detail,
    icon: Icon,
    href,
}: StatCardProps) {
    const content = (
        <div className="group relative h-full border border-[#22222A] bg-[#111115] p-5 transition-colors hover:border-[#34343C]">
            <div className="mb-8 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center border border-[#292930] bg-[#0B0B0E]">
                    <Icon
                        size={18}
                        strokeWidth={1.7}
                        className="text-[#ED1C24]"
                    />
                </div>

                {href && (
                    <ArrowUpRight
                        size={17}
                        className="text-zinc-700 transition-colors group-hover:text-[#ED1C24]"
                    />
                )}
            </div>

            <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                {label}
            </p>

            <p className="mt-2 font-[family-name:var(--font-archivo-black)] text-4xl tracking-[-0.04em] text-white">
                {value}
            </p>

            {detail && (
                <p className="mt-3 text-xs text-zinc-600">
                    {detail}
                </p>
            )}

            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#ED1C24] transition-all duration-300 group-hover:w-full" />
        </div>
    );

    if (href) {
        return (
            <a
                href={href}
                className="block h-full"
            >
                {content}
            </a>
        );
    }

    return content;
}