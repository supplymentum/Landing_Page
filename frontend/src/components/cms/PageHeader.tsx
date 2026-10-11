interface PageHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export default function PageHeader({
    eyebrow = "CMS",
    title,
    description,
    action,
}: PageHeaderProps) {
    return (
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-[#22222A] pb-7 sm:flex-row sm:items-end">
            <div className="max-w-3xl">
                <div className="mb-3 flex items-center gap-3">
                    <span className="h-[2px] w-7 bg-[#ED1C24]" />

                    <span className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.24em] text-[#ED1C24]">
                        {eyebrow}
                    </span>
                </div>

                <h1 className="font-[family-name:var(--font-archivo-black)] text-3xl uppercase tracking-[-0.03em] text-white sm:text-4xl">
                    {title}
                </h1>

                {description && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <div className="shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}