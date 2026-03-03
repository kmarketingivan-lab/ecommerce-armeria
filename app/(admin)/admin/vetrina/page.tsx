import { requireAdmin } from "@/lib/auth/helpers";
import { getHeroSlides } from "./actions";
import { VetrinaEditor } from "./vetrina-editor";

export default async function AdminVetrinaPage() {
  await requireAdmin();
  const slides = await getHeroSlides();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vetrina — Slider homepage</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestisci le slide dello slider in homepage: immagini, testi, bottoni e ordine.
        </p>
      </div>
      <VetrinaEditor initialSlides={slides} />
    </div>
  );
}
