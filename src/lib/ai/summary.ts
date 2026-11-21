import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { digest, digestToText, type VisitSummary } from "../domain/visit-summary";
import type { Patient, Report } from "../domain/types";
import { AI_MODEL } from "./extract";

const Output = z.object({
  headline: z.string().describe("Una frase con lo más importante de estas dos semanas"),
  evolution: z.array(z.string()).describe("3 a 5 puntos sobre la evolución de síntomas y constantes, con grados y tendencias"),
  toDiscuss: z.array(z.string()).describe("1 a 3 temas concretos para tratar en la consulta"),
  adherence: z.string().describe("Una frase sobre la regularidad de los registros del paciente"),
});

const SYSTEM = `Preparas el resumen previo a la consulta de oncología a partir de los registros diarios que el paciente ha hecho en Kairo.
El lector es un oncólogo con dos minutos antes de la consulta.

Reglas:
- Español clínico, conciso. Usa grados (G1, G2…) y cifras.
- Describe tendencias: si un síntoma empeora, mejora o persiste.
- Usa solo los datos proporcionados. No inventes valores ni diagnósticos.
- En "temas para la consulta" puedes proponer valorar algo (por ejemplo, "valorar ajuste de dosis" o "valorar tratamiento antihipertensivo"), pero nunca decidir.
- Cita una frase del paciente solo si aporta contexto clínico.`;

export async function summarizeWithAI(patient: Patient, reports: Report[]): Promise<VisitSummary> {
  const client = new Anthropic();
  const message = await client.messages.parse(
    {
      model: AI_MODEL,
      max_tokens: 900,
      system: SYSTEM,
      messages: [{ role: "user", content: digestToText(patient, digest(patient, reports)) }],
      output_config: { format: zodOutputFormat(Output) },
    },
    { timeout: 25_000, maxRetries: 1 },
  );
  if (!message.parsed_output) throw new Error("Resumen vacío");
  return message.parsed_output;
}
