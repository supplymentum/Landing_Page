import type { Metadata } from "next";
import AreasSection from "@/components/areas/AreasSection";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { getPublicAreas } from "@/lib/api/areas";

export const metadata: Metadata = {
  title: "Áreas | SupplyMentum UNI",
  description:
    "Conoce las áreas de SupplyMentum UNI y descubre cómo contribuyen al desarrollo de nuestra organización.",
};

export default async function AreasPage() {
  const areas = await getPublicAreas();

  return (
    <main>
      <SmoothScroll />

      <AreasSection
        initialAreas={areas}
      />
    </main>
  );
}