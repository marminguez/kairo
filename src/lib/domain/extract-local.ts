// Extractor de síntomas SIN IA, basado en palabras clave.
// Es la red de seguridad si no hay API key o no hay conexión: la demo nunca se queda en blanco.
// La versión con IA (Claude) gradúa con mucha más precisión y cita la frase del paciente.

import { SYMPTOMS, SYMPTOM_IDS } from "./symptoms";
import type { Grade, Measurements, SymptomEntry } from "./types";

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const INTENSIFIERS = ["mucho", "mucha", "muchos", "muchas", "muchisimo", "muy", "fatal", "no puedo", "fuerte", "bastante", "cada vez peor"];
const SEVERE = ["no puedo levantarme", "no puedo comer", "insoportable", "no me tengo en pie"];

export function extractLocal(text: string): { symptoms: SymptomEntry[]; measurements: Measurements } {
  const t = normalize(text);
  const symptoms: SymptomEntry[] = [];

  for (const id of SYMPTOM_IDS) {
    const hit = SYMPTOMS[id].patientWords.map(normalize).find((w) => t.includes(w));
    if (!hit) continue;
    let grade: Grade = 1;
    if (INTENSIFIERS.some((w) => t.includes(w))) grade = 2;
    if (SEVERE.some((w) => t.includes(w))) grade = 3;
    if (id === "diarrea") {
      const n = Number(t.match(/(\d+)\s*(veces|deposiciones)/)?.[1] ?? NaN);
      if (!Number.isNaN(n)) grade = n >= 7 ? 3 : n >= 4 ? 2 : 1;
    }
    symptoms.push({ id, grade, evidence: hit });
  }

  const measurements: Measurements = {};
  const temp = t.match(/\b(3[5-9]|4[0-2])(?:[.,](\d))?\s*(?:grados|º|°)?/);
  if (temp && /fiebre|temperatura|grados|termometro/.test(t)) {
    measurements.temperature = Number(`${temp[1]}.${temp[2] ?? 0}`);
  }
  const bp = t.match(/(\d{2,3})\s*[/-]\s*(\d{2,3})/);
  if (bp && /tension|presion/.test(t)) {
    measurements.systolic = Number(bp[1]);
    measurements.diastolic = Number(bp[2]);
  }
  return { symptoms, measurements };
}
