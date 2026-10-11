import { getSpecializations } from "@/lib/data/specializations";
import SpecializationsBlock from "./SpecializationsBlock";

export default async function Specializations() {
  const specializations = await getSpecializations();
  return <SpecializationsBlock specializations={specializations} />;
}
