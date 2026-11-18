import type { Message, Patient, Report } from "../domain/types";

export interface KairoData {
  patients: Patient[];
  reports: Report[];
  messages: Message[];
}

export type NewReport = Omit<Report, "id" | "createdAt"> & { createdAt?: string };
export type NewMessage = Omit<Message, "id" | "createdAt">;

/**
 * Capa de datos intercambiable:
 * - "local": localStorage + BroadcastChannel. Funciona sin configurar nada y sin red (ideal como red de seguridad en la final).
 * - "supabase": Postgres + Realtime. Sincroniza entre dispositivos (móvil del paciente y portátil de enfermería).
 */
export interface KairoStore {
  readonly mode: "local" | "supabase";
  load(): Promise<KairoData>;
  addReport(report: NewReport): Promise<Report>;
  addMessage(message: NewMessage): Promise<Message>;
  /** Llama a `onChange` cuando cambian los datos (también desde otra pestaña o dispositivo). Devuelve la función para cancelar. */
  subscribe(onChange: () => void): () => void;
  /** Vuelve a los datos de demo iniciales. */
  reset(): Promise<void>;
}
