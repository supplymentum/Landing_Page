import Image from "next/image";

export interface Proyecto {
  id: string;
  title: string;
  category: string;
  description: string;
  year: string;
  imageUrl: string;
}

interface ProyectoCardProps {
  proyecto: Proyecto;
}

export default function ProyectoCard({ proyecto }: ProyectoCardProps) {
  return (
    <div className="w-[300px] sm:w-[268px] shrink-0 bg-[#121216] border border-zinc-800 overflow-hidden shadow-none hover:shadow-[0_8px_30px_rgba(237,28,36,0.1)] hover:border-[#ED1C24]/50 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between h-[418px] select-none">
      {/* Image container with fixed height */}
      <div className="relative h-[200px] w-full overflow-hidden bg-zinc-950">
        <Image
          src={proyecto.imageUrl}
          alt={proyecto.title}
          fill
          sizes="(max-width: 640px) 300px, 340px"
          className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
          priority={false}
        />
      </div>

      {/* Internal Content */}
      <div className="p-5 flex-1 flex flex-col justify-between items-start text-left">
        <div>
          {/* Badge */}
          <span style={{ fontFamily: "var(--font-archivo)" }} className="text-[10px]  text-white font-bold tracking-widest bg-[#ED1C24] border border-[#ED1C24]/20 px-2.5 py-1 w-fit uppercase inline-block">
            {proyecto.category}
          </span>

          {/* Title */}
          <h3 style={{ fontFamily: "var(--font-archivo)" }} className="text-[20px] font-bold text-white text-base  leading-snug line-clamp-2 mt-3 transition-colors duration-300">
            {proyecto.title}
          </h3>

          {/* Description */}
          <p style={{ fontFamily: "var(--font-archivo)" }} className="text-zinc-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mt-2 font-normal">
            {proyecto.description}
          </p>
        </div>

        {/* Year */}
        <span style={{ fontFamily: "var(--font-archivo)" }} className="text-zinc-500 text-xs font-bold mt-4">
          {proyecto.year}
        </span>
      </div>
    </div>
  );
}
