import { compareLevel } from "./triage";
import type { Patient, Report, TriageLevel } from "./types";

export interface PatientSummary {
  patient: Patient;
  reports: Report[]; // ordenados del más antiguo al más reciente
  latest?: Report;
  level: TriageLevel;
  /** Días desde el último registro (0 = hoy). undefined si nunca ha registrado. */
  daysSinceLast?: number;
  dayOfCycle: number;
  daysToVisit: number;
  /** El paciente lleva varios días sin registrar: también es una señal para enfermería. */
  silent: boolean;
}

const DAY = 86_400_000;
const startOfDay = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

export function daysBetween(a: Date, b: Date) {
  return Math.round((startOfDay(b) - startOfDay(a)) / DAY);
}

export const SILENT_AFTER_DAYS = 3;

export function summarize(patient: Patient, all: Report[], now = new Date()): PatientSummary {
  const reports = all
    .filter((r) => r.patientId === patient.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const latest = reports.at(-1);
  const daysSinceLast = latest ? daysBetween(new Date(latest.createdAt), now) : undefined;
  const silent = daysSinceLast === undefined || daysSinceLast >= SILENT_AFTER_DAYS;
  // El nivel solo cuenta si el último registro es reciente (hoy o ayer).
  const level: TriageLevel = latest && daysSinceLast !== undefined && daysSinceLast <= 1 ? latest.triage.level : "verde";
  return {
    patient,
    reports,
    latest,
    level,
    daysSinceLast,
    dayOfCycle: daysBetween(new Date(patient.cycleStart), now) + 1,
    daysToVisit: daysBetween(now, new Date(patient.nextVisit)),
    silent,
  };
}

/** Orden de la bandeja: rojo, ámbar, silenciosos, verde; dentro de cada grupo, lo más reciente primero. */
export function sortForTriage(list: PatientSummary[]): PatientSummary[] {
  const bucket = (s: PatientSummary) => (s.level !== "verde" ? compareLevel(s.level, "rojo") : s.silent ? 2 : 3);
  return [...list].sort(
    (a, b) => bucket(a) - bucket(b) || (b.latest?.createdAt ?? "").localeCompare(a.latest?.createdAt ?? ""),
  );
}

/** Peor nivel de cada uno de los últimos `days` días (null = sin registro). Índice 0 = el más antiguo. */
export function dailyLevels(reports: Report[], days: number, now = new Date()): (TriageLevel | null)[] {
  const out: (TriageLevel | null)[] = Array(days).fill(null);
  for (const r of reports) {
    const ago = daysBetween(new Date(r.createdAt), now);
    if (ago < 0 || ago >= days) continue;
    const i = days - 1 - ago;
    const prev = out[i];
    if (prev === null || compareLevel(r.triage.level, prev) < 0) out[i] = r.triage.level;
  }
  return out;
}
