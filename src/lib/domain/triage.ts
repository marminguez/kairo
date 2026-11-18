// Motor de triaje DETERMINISTA.
// La IA solo extrae y gradúa síntomas; el nivel de alerta lo deciden estas reglas,
// que son auditables y configurables por el servicio. Los umbrales por defecto son
// orientativos y deben validarse con el equipo clínico antes de cualquier uso real.

import { SYMPTOMS } from "./symptoms";
import type {
  Measurements,
  Report,
  SymptomEntry,
  TriageLevel,
  TriageReason,
  TriageResult,
} from "./types";

export interface TriageConfig {
  feverC: number;
  bpRed: { systolic: number; diastolic: number };
  bpAmber: { systolic: number; diastolic: number };
  /** Días consecutivos con el mismo síntoma (grado ≥1) que generan ámbar por persistencia. */
  persistenceDays: number;
}

export const DEFAULT_CONFIG: TriageConfig = {
  feverC: 38,
  bpRed: { systolic: 180, diastolic: 110 },
  bpAmber: { systolic: 160, diastolic: 100 },
  persistenceDays: 3,
};

const RANK: Record<TriageLevel, number> = { verde: 0, ambar: 1, rojo: 2 };

export function maxLevel(a: TriageLevel, b: TriageLevel): TriageLevel {
  return RANK[a] >= RANK[b] ? a : b;
}

export function compareLevel(a: TriageLevel, b: TriageLevel): number {
  return RANK[b] - RANK[a];
}

const ACTIONS: Record<TriageLevel, string> = {
  rojo: "Contactar hoy con el paciente. Valorar derivación a urgencias y suspensión temporal del tratamiento según protocolo del servicio.",
  ambar: "Llamar al paciente en 24–48 h. Revisar medidas de soporte y comentar con oncología la necesidad de ajustar dosis.",
  verde: "Sin acción. Reforzar autocuidados y seguir con el registro diario.",
};

/**
 * Evalúa un registro nuevo.
 * @param history registros anteriores del mismo paciente (cualquier orden), para detectar persistencia.
 */
export function triage(
  symptoms: SymptomEntry[],
  measurements: Measurements,
  history: Pick<Report, "createdAt" | "symptoms">[] = [],
  config: TriageConfig = DEFAULT_CONFIG,
  now: Date = new Date(),
): TriageResult {
  const reasons: TriageReason[] = [];

  for (const s of symptoms) {
    if (s.grade <= 0) continue;
    const def = SYMPTOMS[s.id];
    if (def.redFlag) {
      reasons.push({ level: "rojo", rule: `alarma.${s.id}`, text: `${def.label}: síntoma de alarma` });
    } else if (s.grade >= 3) {
      reasons.push({ level: "rojo", rule: `grado3.${s.id}`, text: `${def.label} grado ${s.grade}` });
    } else if (s.grade === 2) {
      reasons.push({ level: "ambar", rule: `grado2.${s.id}`, text: `${def.label} grado 2` });
    }
  }

  const { temperature, systolic, diastolic } = measurements;
  if (temperature !== undefined && temperature >= config.feverC) {
    reasons.push({ level: "rojo", rule: "fiebre", text: `Fiebre de ${temperature.toFixed(1)} ºC` });
  }
  if (systolic !== undefined && diastolic !== undefined) {
    const bp = `${systolic}/${diastolic} mmHg`;
    if (systolic >= config.bpRed.systolic || diastolic >= config.bpRed.diastolic) {
      reasons.push({ level: "rojo", rule: "hta.grave", text: `Tensión muy alta: ${bp}` });
    } else if (systolic >= config.bpAmber.systolic || diastolic >= config.bpAmber.diastolic) {
      reasons.push({ level: "ambar", rule: "hta", text: `Tensión alta: ${bp}` });
    }
  }

  // Persistencia: la idea original de OncoRen. Un síntoma leve que no se va también importa.
  for (const s of symptoms) {
    if (s.grade < 1 || SYMPTOMS[s.id].redFlag) continue;
    const streak = consecutiveDays(s.id, history, now) + 1; // +1 = hoy
    if (streak >= config.persistenceDays) {
      // Si el síntoma ya tiene motivo por grado, se añade la duración a ese motivo en lugar de duplicarlo.
      const existing = reasons.find((r) => r.rule.endsWith(`.${s.id}`));
      if (existing) {
        existing.text += `, ${streak} días seguidos`;
        continue;
      }
      reasons.push({
        level: "ambar",
        rule: `persistencia.${s.id}`,
        text: `${SYMPTOMS[s.id].label} ${streak} días seguidos`,
      });
    }
  }

  const level = reasons.reduce<TriageLevel>((acc, r) => maxLevel(acc, r.level), "verde");
  reasons.sort((a, b) => compareLevel(a.level, b.level));
  return { level, reasons, suggestedAction: ACTIONS[level] };
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Cuenta los días consecutivos inmediatamente anteriores a `now` en los que aparece el síntoma. */
function consecutiveDays(
  id: SymptomEntry["id"],
  history: Pick<Report, "createdAt" | "symptoms">[],
  now: Date,
): number {
  const days = new Set(
    history
      .filter((r) => r.symptoms.some((s) => s.id === id && s.grade >= 1))
      .map((r) => dayKey(new Date(r.createdAt))),
  );
  let count = 0;
  const cursor = new Date(now);
  for (;;) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!days.has(dayKey(cursor))) break;
    count++;
  }
  return count;
}
