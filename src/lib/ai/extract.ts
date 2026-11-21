import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { DRUGS } from "../domain/drugs";
import { SYMPTOMS, SYMPTOM_IDS } from "../domain/symptoms";
import type { Measurements, SymptomEntry } from "../domain/types";

export const AI_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

const Output = z.object({
  symptoms: z
    .array(
      z.object({
        id: z.enum(SYMPTOM_IDS as [string, ...string[]]),
        grade: z.number().int().min(0).max(4),
        evidence: z.string().describe("Fragmento literal de lo que dijo el paciente que justifica el grado"),
      }),
    )
    .describe("Solo síntomas que el paciente menciona como presentes. Lista vacía si se encuentra bien."),
  temperature: z.number().nullable().describe("Temperatura en ºC si la menciona, si no null"),
  systolic: z.number().nullable().describe("Tensión sistólica en mmHg si la menciona, si no null"),
  diastolic: z.number().nullable().describe("Tensión diastólica en mmHg si la menciona, si no null"),
});

function catalog() {
  return SYMPTOM_IDS.map((id) => {
    const s = SYMPTOMS[id];
    const grades = Object.entries(s.grades)
      .map(([g, d]) => `    grado ${g}: ${d}`)
      .join("\n");
    return `- ${id} (${s.label})${s.redFlag ? " [síntoma de alarma]" : ""}\n${grades}`;
  }).join("\n");
}

const SYSTEM = `Eres el módulo de extracción clínica de Kairo, una herramienta de telemonitorización para pacientes con tratamiento oncológico oral.
Recibes lo que un paciente cuenta con sus palabras (a menudo transcrito de voz, con errores y lenguaje coloquial) y lo conviertes en síntomas graduados según los criterios orientativos inspirados en PRO-CTCAE que se indican abajo.

Reglas:
- Usa solo los identificadores del catálogo. Si el paciente menciona algo que no está en el catálogo, ignóralo.
- Incluye un síntoma solo si el paciente dice que lo tiene. Si lo niega ("no tengo fiebre"), no lo incluyas.
- Elige el grado cuya descripción encaje mejor con lo que cuenta. Ante la duda entre dos grados, elige el más alto: es más seguro que lo revise un profesional.
- "evidence" debe ser un fragmento literal y breve del texto del paciente.
- Interpreta expresiones coloquiales: "cada dos por tres" o "no salgo del baño" en diarrea indican muchas deposiciones; "no me tengo en pie" indica cansancio que impide cuidarse.
- Tensión en formato español: "18,4 de alta y 11 de baja" significa 184/110 mmHg. "16/10" significa 160/100 mmHg.
- No des consejos ni diagnósticos. Solo extraes datos; las alertas las decide un sistema de reglas aparte y un profesional sanitario.

Catálogo:
${catalog()}`;

export async function extractWithAI(
  text: string,
  drugId?: string,
): Promise<{ symptoms: SymptomEntry[]; measurements: Measurements }> {
  const client = new Anthropic();
  const drug = drugId ? DRUGS[drugId] : undefined;
  const message = await client.messages.parse(
    {
      model: AI_MODEL,
      max_tokens: 1024,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `${drug ? `Tratamiento del paciente: ${drug.name}.\n` : ""}Lo que cuenta el paciente:\n"""${text}"""`,
        },
      ],
      output_config: { format: zodOutputFormat(Output) },
    },
    { timeout: 15_000, maxRetries: 1 },
  );
  const out = message.parsed_output;
  if (!out) throw new Error("La IA no ha devuelto una respuesta válida");

  const measurements: Measurements = {};
  if (out.temperature !== null) measurements.temperature = out.temperature;
  if (out.systolic !== null && out.diastolic !== null) {
    measurements.systolic = out.systolic;
    measurements.diastolic = out.diastolic;
  }
  return {
    symptoms: out.symptoms
      .filter((s) => s.grade > 0)
      .map((s) => ({ id: s.id as SymptomEntry["id"], grade: s.grade as SymptomEntry["grade"], evidence: s.evidence })),
    measurements,
  };
}
