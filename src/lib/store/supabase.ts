import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { buildMessages, buildPatients, buildReports } from "../demo/seed";
import type { Message, Patient, Report } from "../domain/types";
import type { KairoData, KairoStore, NewMessage, NewReport } from "./types";

// Filas tal y como están en Postgres (snake_case).
type PatientRow = {
  id: string; name: string; age: number; sex: "F" | "M"; diagnosis: string; drug_id: string;
  dose: string; cycle_start: string; next_visit: string; oncologist: string;
};
type ReportRow = {
  id: string; patient_id: string; created_at: string; source: Report["source"]; raw_text: string;
  symptoms: Report["symptoms"]; measurements: Report["measurements"]; triage: Report["triage"];
};
type MessageRow = {
  id: string; patient_id: string; created_at: string; sender: Message["sender"]; body: string; report_id: string | null;
};

export const toPatient = (r: PatientRow): Patient => ({
  id: r.id, name: r.name, age: r.age, sex: r.sex, diagnosis: r.diagnosis, drugId: r.drug_id,
  dose: r.dose, cycleStart: r.cycle_start, nextVisit: r.next_visit, oncologist: r.oncologist,
});
export const fromPatient = (p: Patient): PatientRow => ({
  id: p.id, name: p.name, age: p.age, sex: p.sex, diagnosis: p.diagnosis, drug_id: p.drugId,
  dose: p.dose, cycle_start: p.cycleStart, next_visit: p.nextVisit, oncologist: p.oncologist,
});
const toReport = (r: ReportRow): Report => ({
  id: r.id, patientId: r.patient_id, createdAt: r.created_at, source: r.source, rawText: r.raw_text,
  symptoms: r.symptoms, measurements: r.measurements, triage: r.triage,
});
const fromReport = (r: NewReport) => ({
  patient_id: r.patientId, created_at: r.createdAt, source: r.source, raw_text: r.rawText,
  symptoms: r.symptoms, measurements: r.measurements, triage: r.triage,
});
const toMessage = (r: MessageRow): Message => ({
  id: r.id, patientId: r.patient_id, createdAt: r.created_at, sender: r.sender, body: r.body,
  reportId: r.report_id ?? undefined,
});

/** Inserta los datos de demo. Lo usa el script `npm run db:seed` y el botón de reinicio. */
export async function seedSupabase(client: SupabaseClient) {
  const today = new Date();
  await client.from("messages").delete().neq("id", "");
  await client.from("reports").delete().neq("id", "");
  await client.from("patients").delete().neq("id", "");
  const patients = buildPatients(today).map(fromPatient);
  const reports = buildReports(today).map((r) => ({ id: r.id, ...fromReport(r) }));
  const messages = buildMessages(today).map((m) => ({
    id: m.id, patient_id: m.patientId, created_at: m.createdAt, sender: m.sender, body: m.body, report_id: m.reportId ?? null,
  }));
  for (const [table, rows] of [["patients", patients], ["reports", reports], ["messages", messages]] as const) {
    const { error } = await client.from(table).insert(rows as never);
    if (error) throw new Error(`Error al cargar ${table}: ${error.message}`);
  }
}

export function createSupabaseStore(url: string, anonKey: string): KairoStore {
  const client = createClient(url, anonKey);
  const uid = () => crypto.randomUUID();

  return {
    mode: "supabase",
    async load(): Promise<KairoData> {
      const [p, r, m] = await Promise.all([
        client.from("patients").select("*"),
        client.from("reports").select("*").order("created_at"),
        client.from("messages").select("*").order("created_at"),
      ]);
      const error = p.error ?? r.error ?? m.error;
      if (error) throw new Error(error.message);
      return {
        patients: (p.data as PatientRow[]).map(toPatient),
        reports: (r.data as ReportRow[]).map(toReport),
        messages: (m.data as MessageRow[]).map(toMessage),
      };
    },
    async addReport(input) {
      const row = { id: uid(), ...fromReport({ ...input, createdAt: input.createdAt ?? new Date().toISOString() }) };
      const { data, error } = await client.from("reports").insert(row).select().single();
      if (error) throw new Error(error.message);
      return toReport(data as ReportRow);
    },
    async addMessage(input: NewMessage) {
      const row = {
        id: uid(), patient_id: input.patientId, sender: input.sender, body: input.body, report_id: input.reportId ?? null,
      };
      const { data, error } = await client.from("messages").insert(row).select().single();
      if (error) throw new Error(error.message);
      return toMessage(data as MessageRow);
    },
    subscribe(onChange) {
      const channel = client
        .channel("kairo-live")
        .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, onChange)
        .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, onChange)
        .on("postgres_changes", { event: "*", schema: "public", table: "patients" }, onChange)
        .subscribe();
      return () => {
        client.removeChannel(channel);
      };
    },
    async reset() {
      await seedSupabase(client);
    },
  };
}
