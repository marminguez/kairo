import { summarizeWithAI } from "@/lib/ai/summary";
import type { Patient, Report } from "@/lib/domain/types";
import { localSummary, type VisitSummary } from "@/lib/domain/visit-summary";

export type SummaryResponse = VisitSummary & { engine: "ia" | "local" };

/** Resumen previo a la consulta. El cliente envía el paciente y sus registros (funciona igual en modo local y con Supabase). */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { patient?: Patient; reports?: Report[] } | null;
  if (!body?.patient || !Array.isArray(body.reports)) {
    return Response.json({ error: "Faltan los datos del paciente" }, { status: 400 });
  }
  const reports = body.reports.slice(-60);

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const s = await summarizeWithAI(body.patient, reports);
      return Response.json({ ...s, engine: "ia" } satisfies SummaryResponse);
    } catch (e) {
      console.error("[summary] La IA ha fallado, se usa el resumen local:", e);
    }
  }
  return Response.json({ ...localSummary(body.patient, reports), engine: "local" } satisfies SummaryResponse);
}
