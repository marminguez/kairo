"use client";

import { Check, Mic, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DayStrip } from "@/components/day-strip";
import { DEMO_PATIENT_ID } from "@/lib/demo/seed";
import { DRUGS } from "@/lib/domain/drugs";
import { extractLocal } from "@/lib/domain/extract-local";
import { summarize } from "@/lib/domain/summary";
import { SYMPTOMS } from "@/lib/domain/symptoms";
import { triage } from "@/lib/domain/triage";
import type { Report } from "@/lib/domain/types";
import { useKairo } from "@/lib/store";
import { cn, relativeTime } from "@/lib/utils";

const AFTER: Record<Report["triage"]["level"], string> = {
  rojo: "Tu equipo ha recibido un aviso para atenderte hoy. Si tienes dolor en el pecho, te falta el aire o sangras, llama al 112.",
  ambar: "Tu equipo lo revisará y te llamará en las próximas 24–48 horas.",
  verde: "Gracias, queda registrado. Tu equipo lo verá antes de tu próxima cita.",
};

export function PatientApp() {
  const patientId = useSearchParams().get("p") ?? DEMO_PATIENT_ID;
  const { data, error, store } = useKairo();
  const [composing, setComposing] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState<Report | null>(null);

  if (error) return <p className="p-6 text-rojo">{error}</p>;
  if (!data || !store) return <p className="p-6 text-muted">Cargando…</p>;

  const patient = data.patients.find((p) => p.id === patientId);
  if (!patient) return <p className="p-6">No encontramos a este paciente. Revisa el enlace.</p>;

  const s = summarize(patient, data.reports);
  const drug = DRUGS[patient.drugId];
  const firstName = patient.name.split(" ")[0];
  const messages = data.messages.filter((m) => m.patientId === patient.id);

  async function send(raw: string) {
    if (!store) return;
    setSending(true);
    // Día 1: extracción local. Día 2: se sustituye por la llamada a la IA con este mismo como respaldo.
    const { symptoms, measurements } = extractLocal(raw);
    const result = triage(symptoms, measurements, s.reports);
    const report = await store.addReport({
      patientId: patient!.id,
      source: "texto",
      rawText: raw,
      symptoms,
      measurements,
      triage: result,
    });
    setLastSent(report);
    setText("");
    setComposing(false);
    setSending(false);
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <header>
        <span className="text-lg font-bold text-brand">kairo</span>
        <h1 className="mt-6 text-3xl font-bold">Hola, {firstName}</h1>
        <p className="mt-2 text-lg leading-snug text-muted">
          Día {s.dayOfCycle} de tu tratamiento con {drug?.name ?? patient.drugId}.
          <br />
          Próxima cita en {s.daysToVisit} días con {patient.oncologist}.
        </p>
      </header>

      {lastSent ? (
        <section aria-live="polite" className="rounded-2xl bg-brand-tint p-5">
          <h2 className="text-xl font-bold">Lo hemos recibido</h2>
          {lastSent.symptoms.length > 0 && (
            <ul className="mt-3 space-y-1 text-lg">
              {lastSent.symptoms.map((x) => (
                <li key={x.id}>
                  <strong>{SYMPTOMS[x.id].label}</strong>: {SYMPTOMS[x.id].grades[x.grade]?.toLowerCase() ?? `grado ${x.grade}`}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-lg leading-snug">{AFTER[lastSent.triage.level]}</p>
          <button onClick={() => setLastSent(null)} className="mt-4 font-bold text-brand underline underline-offset-4">
            Contar algo más
          </button>
        </section>
      ) : composing ? (
        <section className="flex flex-col gap-3">
          <label htmlFor="relato" className="text-xl font-bold">
            ¿Cómo te encuentras hoy?
          </label>
          <textarea
            id="relato"
            autoFocus
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Por ejemplo: llevo dos días con diarrea, unas seis veces al día."
            className="rounded-2xl border-2 border-line p-4 text-lg leading-snug focus:border-brand focus:outline-none"
          />
          <div className="flex gap-3">
            <button
              disabled={!text.trim() || sending}
              onClick={() => send(text)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand py-4 text-lg font-bold text-white disabled:opacity-40"
            >
              <Send className="size-5" aria-hidden /> {sending ? "Enviando…" : "Enviar a mi equipo"}
            </button>
            <button onClick={() => setComposing(false)} className="rounded-full px-5 text-lg font-bold text-muted">
              Cancelar
            </button>
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center gap-4">
          <button
            onClick={() => setComposing(true)}
            className="flex size-44 flex-col items-center justify-center gap-2 rounded-full bg-brand text-white shadow-[0_12px_32px_-12px_var(--brand)] active:scale-95"
          >
            <Mic className="size-12" aria-hidden />
            <span className="max-w-[10ch] text-center text-lg leading-tight font-bold">Contar cómo me encuentro</span>
          </button>
          <button
            onClick={() => send("Hoy me encuentro bien")}
            disabled={sending}
            className="flex items-center gap-2 rounded-full border-2 border-line px-5 py-3 text-lg font-bold"
          >
            <Check className="size-5 text-verde" aria-hidden /> Hoy estoy bien
          </button>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold">Tus últimos 14 días</h2>
        <div className="mt-3">
          <DayStrip reports={s.reports} daysToVisit={s.daysToVisit} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">Mensajes de tu equipo</h2>
        {messages.length === 0 ? (
          <p className="mt-2 text-muted">Cuando tu equipo te escriba, lo verás aquí.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className={cn(
                  "max-w-[90%] rounded-2xl px-4 py-3 text-lg leading-snug",
                  m.sender === "paciente" ? "self-end bg-brand text-white" : "bg-paper",
                )}
              >
                {m.body}
                <span className={cn("mt-1 block text-sm", m.sender === "paciente" ? "text-white/75" : "text-muted")}>
                  {m.sender === "enfermeria" ? "Enfermería" : "Tú"}, {relativeTime(m.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
