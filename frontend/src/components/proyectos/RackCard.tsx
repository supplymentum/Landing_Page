import Image from "next/image";
import { type Project, getProjectImage } from "@/lib/api/projects";

/**
 * Card individual que representa un proyecto dentro del rack/catálogo.
 * Se renderiza N veces según la cantidad de proyectos visibles por página.
 */
export default function RackCard({ proyecto }: { proyecto: Project }) {
  return (
    <article className="group relative bg-[#121216] border border-zinc-800/80 overflow-hidden hover:border-[#ED1C24]/40 hover:shadow-[0_8px_32px_rgba(237,28,36,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      {/* Imagen */}
      <div className="relative h-[200px] w-full overflow-hidden bg-zinc-950">
        <Image
          src={getProjectImage(proyecto)}
          alt={proyecto.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay sutil en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col gap-2">
        {/* Badge de área */}
        <span
          style={{ fontFamily: "var(--font-archivo)" }}
          className="text-[10px] font-bold tracking-widest uppercase bg-[#ED1C24] text-white px-2.5 py-1 w-fit"
        >
          {proyecto.area}
        </span>

        {/* Título */}
        <h3
          style={{ fontFamily: "var(--font-archivo)" }}
          className="text-base font-bold text-white leading-snug line-clamp-2 mt-1"
        >
          {proyecto.name}
        </h3>

        {/* Descripción */}
        <p
          style={{ fontFamily: "var(--font-archivo)" }}
          className="text-zinc-400 text-sm line-clamp-3 leading-relaxed font-normal"
        >
          {proyecto.description}
        </p>

        {/* Año */}
        <span
          style={{ fontFamily: "var(--font-archivo)" }}
          className="text-zinc-500 text-xs font-bold mt-2"
        >
          {proyecto.year}
        </span>
      </div>
    </article>
  );
}
