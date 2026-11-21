import { DRUGS } from "./drugs";
import { SYMPTOMS } from "./symptoms";
import type { Patient, Report, SymptomId } from "./types";

export interface VisitSummary {
  headline: string;
  evolution: string[];
  toDiscuss: string[];
  adherence: string;
}

/** Datos de los últimos días en texto compacto, para la IA y para el resumen sin IA. */
export function digest(patient: Patient, reports: Report[], days = 14, now = new Date()) {
  const since = now.getTime() - days * 86_400_000;
  const recent = reports
    .filter((r) => r.patientId === patient.id && new Date(r.createdAt).getTime() >= since)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const perSymptom = new Map<SymptomId, { days: Set<string>; max: number; last: number }>();
  const bp: string[] = [];
  const temps: number[] = [];
  const quotes: string[] = [];
  const reportDays = new Set<string>();

  for (const r of recent) {
    const day = r.createdAt.slice(0, 10);
    reportDays.add(day);
    for (const s of r.symptoms) {
      const e = perSymptom.get(s.id) ?? { days: new Set(), max: 0, last: 0 };
      e.days.add(day);
      e.max = Math.max(e.max, s.grade);
      e.last = s.grade;
      perSymptom.set(s.id, e);
    }
    const m = r.measurements;
    if (m.systolic && m.diastolic) bp.push(`${day.slice(8, 10)}/${day.slice(5, 7)}: ${m.systolic}/${m.diastolic}`);
    if (m.temperature) temps.push(m.temperature);
    if (r.rawText && r.rawText !== "Hoy me encuentro bien") quotes.push(`${day}: "${r.rawText}"`);
  }

  return { recent, perSymptom, bp, temps, quotes, reportDays, days };
}

export function digestToText(patient: Patient, d: ReturnType<typeof digest>) {
  const drug = DRUGS[patient.drugId];
  const lines = [
    // Minimización: la IA nunca recibe el nombre del paciente.
    `Paciente: ${patient.age} años, ${patient.sex === "F" ? "mujer" : "hombre"}. ${patient.diagnosis}.`,
    `Tratamiento: ${drug?.name} ${patient.dose} (${drug?.schedule}). Inicio de ciclo: ${patient.cycleStart}.`,
    `Días con registro: ${d.reportDays.size} de ${d.days}.`,
    "Síntomas (grado máximo, grado más reciente, días con el síntoma):",
    ...[...d.perSymptom].map(
      ([id, e]) => `- ${SYMPTOMS[id].label}: máx G${e.max}, último G${e.last}, ${e.days.size} días`,
    ),
    d.bp.length ? `Tensión arterial: ${d.bp.join("; ")}` : "Sin registros de tensión arterial.",
    d.temps.length ? `Temperaturas: ${d.temps.join(", ")} ºC` : "Sin registros de temperatura.",
    "Lo que ha contado el paciente:",
    ...(d.quotes.length ? d.quotes : ["(sin comentarios libres)"]),
  ];
  return lines.join("\n");
}

/** Resumen sin IA: el respaldo cuando no hay clave o la IA falla. */
export function localSummary(patient: Patient, reports: Report[], now = new Date()): VisitSummary {
  const d = digest(patient, reports, 14, now);
  const symptoms = [...d.perSymptom].sort((a, b) => b[1].max - a[1].max);
  const worst = symptoms[0];
  return {
    headline: worst
      ? `${SYMPTOMS[worst[0]].label} hasta grado ${worst[1].max} en las últimas dos semanas.`
      : "Sin síntomas registrados en las últimas dos semanas.",
    evolution: [
      ...symptoms.map(([id, e]) => `${SYMPTOMS[id].label}: grado máximo ${e.max}, ${e.days.size} días con el síntoma.`),
      ...(d.bp.length ? [`Tensión arterial: ${d.bp.slice(-3).join(", ")}.`] : []),
    ],
    toDiscuss: symptoms.filter(([, e]) => e.max >= 2).map(([id]) => `Manejo de ${SYMPTOMS[id].label.toLowerCase()}.`),
    adherence: `Ha registrado ${d.reportDays.size} de los últimos 14 días.`,
  };
}
