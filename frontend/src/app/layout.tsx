import type { Metadata } from "next";
import { Archivo_Black, Archivo } from "next/font/google";
import "./globals.css";

/*
 * Toda la interfaz usa Archivo: la variante Black solo para los títulos
 * de display. No cargamos otras familias para mantener una sola
 * tipografía en el sitio y en el CMS.
 */
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SupplyMentum UNI",
  description:
    "Comunidad universitaria especializada en gestión de la cadena de suministro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${archivoBlack.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#070709] text-zinc-100 selection:bg-[#ED1C24] selection:text-white">
        {children}
      </body>
    </html>
  );
}
