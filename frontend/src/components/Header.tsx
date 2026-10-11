"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./ui/Logo";
import UserMenu from "./UserMenu";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "INICIO", href: "/" },
    { name: "CONÓCENOS", href: "/conocenos" },
    { name: "ÁREAS", href: "/areas" },
    { name: "PROYECTOS", href: "/proyectos" },
    { name: "EVENTOS", href: "/eventos" },
    { name: "CONVOCATORIA", href: "/convocatoria" },
  ];

  // Una página de detalle (ej. /areas/operaciones) marca activo el link de su
  // sección padre (/areas), igual que el mapeo de "familias" de `initNav()`
  // en site.js del prototipo (area.html → areas.html, etc.), generalizado a
  // cualquier ruta anidada en vez de un caso especial solo para Convocatoria.
  const isLinkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050507] border-b border-zinc-900/40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-[11px] lg:text-xs font-extrabold tracking-widest uppercase transition-colors duration-200 ${
                  isActive
                    ? "text-[#ED1C24]" // Active route is RED
                    : "text-zinc-400 hover:text-white" // Default options are GREY
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button (ÚNETE) + cuenta del postulante */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/convocatoria#postula"
            className="px-8 py-3.5 text-xs font-black tracking-widest text-white uppercase bg-[#ED1C24] hover:bg-red-600 active:scale-95 transition-all rounded-none shadow-md"
          >
            ÚNETE
          </Link>

          <UserMenu />
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0C] border-b border-zinc-800 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-xs font-extrabold tracking-wider py-2 uppercase ${
                    isActive ? "text-[#ED1C24]" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/convocatoria#postula"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3.5 text-xs font-black tracking-widest text-white uppercase bg-[#ED1C24] hover:bg-red-600 transition-colors mt-2 rounded-none"
            >
              ÚNETE
            </Link>

            <UserMenu
              variant="mobile"
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
