import React from "react";
import type { Metadata } from "next";

import Conocenos from "@/components/Conocenos";
import NetworkBackground from "@/components/home/NetworkBackground";
import SmoothScroll from "@/components/ui/SmoothScroll";

import { getPublicExecutives } from "@/lib/api/executives";

export const metadata: Metadata = {
  title: "Conócenos - SupplyMentum UNI",
  description:
    "Nuestra historia, misión, visión y el equipo de la Junta Directiva detrás del centro de Supply Chain.",
};

export default async function ConocenosPage() {
  const executives = await getPublicExecutives();

  return (
    <div className="relative min-h-screen w-full bg-[#09090B]">
      <SmoothScroll />
      <NetworkBackground />

      <main className="relative z-[1]">
        <Conocenos initialExecutives={executives} />
      </main>
    </div>
  );
}