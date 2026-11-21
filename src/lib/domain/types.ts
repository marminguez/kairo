// Tipos de dominio de Kairo.
// Todo el lenguaje clínico se valida con el equipo sanitario antes de cualquier uso real.

export type TriageLevel = "verde" | "ambar" | "rojo";

/** Grado orientativo inspirado en CTCAE / PRO-CTCAE (0 = sin síntoma, 4 = potencialmente mortal). */
export type Grade = 0 | 1 | 2 | 3 | 4;

export type SymptomId =
  | "diarrea"
  | "nauseas"
  | "vomitos"
  | "fatiga"
  | "mano_pie"
  | "mucositis"
  | "inapetencia"
  | "disgeusia"
  | "cefalea"
  | "sangrado"
  | "disnea"
  | "dolor_toracico";

export interface SymptomEntry {
  id: SymptomId;
  grade: Grade;
  /** Frase del paciente que justifica el grado (trazabilidad para el profesional). */
  evidence?: string;
}

export interface Measurements {
  /** Temperatura en ºC */
  temperature?: number;
  /** Tensión arterial sistólica / diastólica en mmHg */
  systolic?: number;
  diastolic?: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: "F" | "M";
  diagnosis: string;
  drugId: string;
  dose: string;
  /** Fecha de inicio del ciclo actual (ISO yyyy-mm-dd) */
  cycleStart: string;
  /** Fecha de la próxima consulta (ISO yyyy-mm-dd) */
  nextVisit: string;
  oncologist: string;
}

export interface Report {
  id: string;
  patientId: string;
  createdAt: string; // ISO
  source: "voz" | "texto" | "seed";
  /** Qué graduó los síntomas: la IA o el extractor local de respaldo. */
  engine?: "ia" | "local";
  rawText: string;
  symptoms: SymptomEntry[];
  measurements: Measurements;
  triage: TriageResult;
}

export type MessageSender = "paciente" | "enfermeria" | "sistema";

export interface Message {
  id: string;
  patientId: string;
  createdAt: string;
  sender: MessageSender;
  body: string;
  reportId?: string;
}

export interface TriageReason {
  level: TriageLevel;
  /** Código estable de la regla que se ha disparado (auditable). */
  rule: string;
  text: string;
}

export interface TriageResult {
  level: TriageLevel;
  reasons: TriageReason[];
  /** Acción sugerida según protocolo. Siempre la confirma un profesional. */
  suggestedAction: string;
}
