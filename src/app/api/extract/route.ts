import { z } from "zod";
import { extractWithAI } from "@/lib/ai/extract";
import { extractLocal } from "@/lib/domain/extract-local";

const Body = z.object({
  text: z.string().trim().min(1).max(2000),
  drugId: z.string().optional(),
});

export type ExtractResponse = ReturnType<typeof extractLocal> & {
  engine: "ia" | "local";
};

/**
 * Convierte el relato del paciente en síntomas graduados.
 * Usa la IA si hay ANTHROPIC_API_KEY; si no hay clave o la IA falla, usa el extractor local.
 * La demo nunca se queda sin respuesta.
 */
export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Falta el texto del paciente" }, { status: 400 });
  }
  const { text, drugId } = parsed.data;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const result = await extractWithAI(text, drugId);
      return Response.json({ ...result, engine: "ia" } satisfies ExtractResponse);
    } catch (e) {
      console.error("[extract] La IA ha fallado, se usa el extractor local:", e);
    }
  }
  return Response.json({ ...extractLocal(text), engine: "local" } satisfies ExtractResponse);
}
