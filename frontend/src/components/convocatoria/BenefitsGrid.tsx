import {
  GraduationCap,
  Users,
  Briefcase,
  TrendingUp,
  HeartHandshake,
  Award,
} from "lucide-react";
import RevealOnScroll from "../ui/RevealOnScroll";

export default function BenefitsGrid() {
  const benefits = [
    {
      title: "Formación aplicada",
      description:
        "Talleres, casos y visitas técnicas que no encontrarás en clase.",
      icon: GraduationCap,
    },
    {
      title: "Red de contactos",
      description:
        "Conecta con profesionales, egresados y empresas del sector.",
      icon: Users,
    },
    {
      title: "Experiencia real",
      description:
        "Lidera proyectos y consultorías con impacto medible.",
      icon: Briefcase,
    },
    {
      title: "Desarrollo personal",
      description:
        "Mentorías y feedback constante para crecer más rápido.",
      icon: TrendingUp,
    },
    {
      title: "Comunidad",
      description:
        "Un equipo que aprende, celebra y crece contigo.",
      icon: HeartHandshake,
    },
    {
      title: "Marca personal",
      description:
        "Visibilidad ante reclutadores y líderes del Supply Chain.",
      icon: Award,
    },
  ];

  return (
    <section id="beneficios" className="w-full py-20 bg-[#070709] border-t border-zinc-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tag */}
        <RevealOnScroll direction="up">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-0.5 bg-[#ED1C24]" />
            <span className="text-xs font-extrabold tracking-widest text-[#ED1C24] uppercase">
              ¿POR QUÉ SUPPLYMENTUM?
            </span>
          </div>
        </RevealOnScroll>

        {/* Title */}
        <RevealOnScroll direction="up" delayMs={100}>
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
              Esto es lo que ganarás
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-normal">
              Desarrolla las competencias más demandadas del mercado mientras impulsamos juntos el ecosistema logístico de la UNI.
            </p>
          </div>
        </RevealOnScroll>

        {/* Grid of 6 Benefit Cards with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <RevealOnScroll key={idx} direction="up" delayMs={150 + idx * 90}>
                <div className="relative bg-[#121216] border-l-4 border-l-[#ED1C24] border-y border-r border-y-zinc-800/80 border-r-zinc-800/80 p-7 transition-all duration-300 hover:bg-[#16161c] hover:-translate-y-1 shadow-md h-full">
                  <div className="w-10 h-10 rounded-none bg-red-950/40 border border-red-900/40 flex items-center justify-center text-[#ED1C24] mb-5">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">{b.title}</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
