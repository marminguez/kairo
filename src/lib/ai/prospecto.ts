import "server-only";
import { DRUGS } from "../domain/drugs";
import { htmlToText, relevantSections } from "./prospecto-parse";

// Descarga el prospecto oficial de CIMA (AEMPS) y lo deja como texto plano.
// Se guarda en memoria para que solo la primera pregunta de cada fármaco espere la descarga.
const cache = new Map<string, string>();

export async function getProspecto(drugId: string): Promise<{ title: string; url: string; text: string } | null> {
  const drug = DRUGS[drugId];
  if (!drug) return null;
  const title = `Prospecto de ${drug.brand} (${drug.name}), AEMPS`;
  const cached = cache.get(drugId);
  if (cached) return { title, url: drug.prospectoUrl, text: cached };

  try {
    const res = await fetch(drug.prospectoUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const text = relevantSections(htmlToText(await res.text()));
    if (text.length < 500) return null;
    cache.set(drugId, text);
    return { title, url: drug.prospectoUrl, text };
  } catch (e) {
    console.error(`[prospecto] No se ha podido descargar ${drug.prospectoUrl}:`, e);
    return null;
  }
}
