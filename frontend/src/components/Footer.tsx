import Link from "next/link";
import Logo from "./ui/Logo";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050507] border-t border-zinc-900 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Logo & Mission */}
          <div className="space-y-4">
            <Logo />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Comunidad universitaria que impulsa el desarrollo académico y profesional en gestión de la cadena de suministro.
            </p>
          </div>

          {/* Column 2: PÁGINA */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-widest text-[#ED1C24] uppercase">
              PÁGINA
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/conocenos" className="hover:text-white transition-colors">
                  Conócenos
                </Link>
              </li>
              <li>
                <Link href="/areas" className="hover:text-white transition-colors">
                  Áreas
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="hover:text-white transition-colors">
                  Proyectos
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: COMUNIDAD */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-widest text-[#ED1C24] uppercase">
              COMUNIDAD
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/eventos" className="hover:text-white transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/convocatoria" className="hover:text-white transition-colors">
                  Convocatoria
                </Link>
              </li>
              <li>
                <Link href="/alianzas" className="hover:text-white transition-colors">
                  Alianzas
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: SÍGUENOS */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-widest text-[#ED1C24] uppercase">
              SÍGUENOS
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
