import React from "react";
import Link from "next/link";

export default function AreaCTA() {
  return (
    <section className="px-8 md:px-[72px] py-[60px] md:py-[90px] bg-[#131316] border-t border-t-[#26262A] text-center">
      <h2 className="m-0 mb-[16px] text-[32px] md:text-[36px] font-extrabold font-[family-name:var(--font-archivo-black)]">
        ¿Te interesa esta área?
      </h2>
      <p className="m-0 mb-[36px] text-[15px] text-[#9B9AA0] font-light font-[family-name:var(--font-archivo)]">
        Revisa si la convocatoria está habilitada y postula.
      </p>
      <Link 
        href="/convocatoria" 
        className="inline-block bg-[#ED1C24] text-white border-none font-bold text-[14px] tracking-[2px] px-[48px] py-[17px] cursor-pointer hover:bg-[#C4151C] transition-colors font-[family-name:var(--font-archivo)]"
      >
        POSTULA AQUÍ
      </Link>
    </section>
  );
}
