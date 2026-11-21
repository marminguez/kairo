import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { DRUGS } from "../domain/drugs";
import { AI_MODEL } from "./extract";
import { getProspecto } from "./prospecto";

export interface Citation {
  text: string;
}

export interface AskResult {
  answer: string;
  /** Fragmentos literales del prospecto en los que se apoya la respuesta. */
  citations: Citation[];
  source: { title: string; url: string } | null;
  /** La IA cree que lo que cuenta el paciente debería verlo su equipo. */
  shouldReport: boolean;
}

const REPORT_MARK = "[AVISAR_EQUIPO]";

const SYSTEM = `Eres el asistente de información de Kairo para pacientes con tratamiento oncológico oral.
Respondes dudas del paciente usando EXCLUSIVAMENTE el prospecto oficial de su medicamento que se te adjunta (fuente: AEMPS). Tu objetivo es que el paciente tenga información fiable y no recurra a bulos de internet.

Reglas:
- Responde en español, de tú, con frases cortas y palabras sencillas. Máximo 90 palabras.
- Apóyate solo en el prospecto adjunto. Si la respuesta no está en el prospecto, dilo con claridad y recomienda preguntarlo a su equipo de enfermería u oncología. No completes con conocimiento general.
- Si el paciente menciona información de internet, redes o conocidos que contradice el prospecto o no aparece en él, dilo con respeto y sin juzgar.
- Nunca le digas que cambie, suspenda o ajuste la dosis por su cuenta.
- Si describe dolor en el pecho, falta de aire, sangrado o fiebre, dile que contacte hoy con su equipo o llame al 112 si es grave.
- Si lo que cuenta es un síntoma que su equipo debería conocer, termina la respuesta con la marca ${REPORT_MARK} (la app la convierte en un botón para avisar al equipo).`;

export async function askWithAI(question: string, drugId: string): Promise<AskResult> {
  const client = new Anthropic();
  const doc = await getProspecto(drugId);
  const drug = DRUGS[drugId];

  const content: Anthropic.ContentBlockParam[] = [];
  if (doc) {
    content.push({
      type: "document",
      source: { type: "text", media_type: "text/plain", data: doc.text },
      title: doc.title,
      citations: { enabled: true },
    });
  }
  content.push({
    type: "text",
    text: doc
      ? `Medicamento del paciente: ${drug?.name}.\nPregunta del paciente: ${question}`
      : `No se ha podido cargar el prospecto. Explica al paciente que ahora mismo no puedes consultar la información oficial y que se lo pregunte a su equipo. Pregunta: ${question}`,
  });

  const message = await client.messages.create(
    { model: AI_MODEL, max_tokens: 600, system: SYSTEM, messages: [{ role: "user", content }] },
    { timeout: 25_000, maxRetries: 1 },
  );

  let answer = "";
  const citations: Citation[] = [];
  for (const block of message.content) {
    if (block.type !== "text") continue;
    answer += block.text;
    for (const c of block.citations ?? []) {
      const text = c.cited_text.replace(/\s+/g, " ").trim();
      if (text && !citations.some((x) => x.text === text)) citations.push({ text });
    }
  }

  const shouldReport = answer.includes(REPORT_MARK);
  answer = answer.replaceAll(REPORT_MARK, "").replace(/\s+\n/g, "\n").trim();
  return {
    answer,
    citations: citations.slice(0, 3),
    source: doc ? { title: doc.title, url: doc.url } : null,
    shouldReport,
  };
}
