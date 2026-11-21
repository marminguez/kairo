import { z } from "zod";
import { askWithAI, type AskResult } from "@/lib/ai/ask";
import { DRUGS } from "@/lib/domain/drugs";

const Body = z.object({
  question: z.string().trim().min(2).max(1000),
  drugId: z.string(),
});

export type AskResponse = AskResult;

/** Responde dudas del paciente usando solo el prospecto oficial de su medicamento, con citas. */
export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Falta la pregunta" }, { status: 400 });
  const { question, drugId } = parsed.data;
  const drug = DRUGS[drugId];

  const fallback: AskResult = {
    answer:
      "Ahora mismo no puedo consultar la información oficial de tu medicamento. Pregúntaselo a tu equipo de enfermería: te responderán con seguridad.",
    citations: [],
    source: drug ? { title: `Prospecto de ${drug.brand} (${drug.name}), AEMPS`, url: drug.prospectoUrl } : null,
    shouldReport: false,
  };

  if (!process.env.ANTHROPIC_API_KEY) return Response.json(fallback satisfies AskResponse);
  try {
    return Response.json((await askWithAI(question, drugId)) satisfies AskResponse);
  } catch (e) {
    console.error("[ask] Error:", e);
    return Response.json(fallback satisfies AskResponse);
  }
}
