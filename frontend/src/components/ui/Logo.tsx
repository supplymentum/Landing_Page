import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="SupplyMentum UNI — inicio"
      className="flex items-center focus:outline-none select-none"
    >
      <Image
        src="/logo.png"
        alt="SupplyMentum · Cadena de Suministros"
        width={894}
        height={226}
        priority
        className="h-9 w-auto sm:h-10"
      />
    </Link>
  );
}
