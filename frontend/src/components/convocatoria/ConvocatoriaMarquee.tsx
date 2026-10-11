export default function ConvocatoriaMarquee() {
  const words = [
    "OPERACIONES",
    "MARKETING",
    "TALENTO",
    "CORPORATIVAS",
    "PROYECTOS",
    "TECNOLOGÍA",
  ];

  return (
    <div className="w-full overflow-hidden border-b border-zinc-900/80 bg-[#070709] py-3.5 select-none">
      <div className="flex animate-marquee whitespace-nowrap gap-10 sm:gap-14 items-center">
        {[...words, ...words, ...words, ...words].map((word, index) => (
          <span key={index} className="flex items-center gap-10 sm:gap-14">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-wider text-stroke-grey transition-all duration-300">
              {word}
            </span>
            {/* Square separator icon (matching screenshot ▫) */}
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 border border-[#33333e] inline-block shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
