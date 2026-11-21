"use client";

import { RotateCcw, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DayStrip } from "@/components/day-strip";
import { LevelPill, levelBg } from "@/components/level";
import { DRUGS } from "@/lib/domain/drugs";
import { sortForTriage, summarize, type PatientSummary } from "@/lib/domain/summary";
import { SYMPTOMS } from "@/lib/domain/symptoms";
import type { Message } from "@/lib/domain/types";
import { useKairo, type KairoStore } from "@/lib/store";
import { cn, relativeTime } from "@/lib/utils";

export function NursePanel() {
  const { data, error, store } = useKairo();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [arrived, setArrived] = useState<Set<string>>(new Set());
  const seen = useRef<Map<string, string> | null>(null);

  const list = useMemo(
    () => (data ? sortForTriage(data.patients.map((p) => summarize(p, data.reports))) : []),
    [data],
  );

  // Detecta registros nuevos para iluminar la fila una vez (el momento "a tiempo").
  useEffect(() => {
    if (!data) return;
    const latestByPatient = new Map(list.map((s) => [s.patient.id, s.latest?.id ?? ""]));
    if (seen.current) {
      const fresh = [...latestByPatient].filter(([id, rid]) => rid && seen.current!.get(id) !== rid).map(([id]) => id);
      if (fresh.length) {
         
        setArrived(new Set(fresh));
        setSelectedId(fresh[0]);
        const t = setTimeout(() => setArrived(new Set()), 2000);
        seen.current = latestByPatient;
        return () => clearTimeout(t);
      }
    }
    seen.current = latestByPatient;
  }, [data, list]);

  if (error) return <p className="p-6 text-rojo">{error}</p>;
  if (!data || !store) return <p className="p-6 text-muted">Cargando…</p>;

  const selected = list.find((s) => s.patient.id === selectedId) ?? list[0];
  const count = (pred: (s: PatientSummary) => boolean) => list.filter(pred).length;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line bg-surface px-6 py-4">
        <span className="text-xl font-bold text-brand">kairo</span>
        <span className="text-muted">Enfermería oncológica, hospital de día</span>
        <dl className="ml-auto flex gap-5 text-sm">
          <Stat label="Atender hoy" value={count((s) => s.level === "rojo")} dot="bg-rojo" />
          <Stat label="Revisar" value={count((s) => s.level === "ambar")} dot="bg-ambar" />
          <Stat label="Sin registrar" value={count((s) => s.level === "verde" && s.silent)} dot="bg-silencio" />
          <Stat label="Estables" value={count((s) => s.level === "verde" && !s.silent)} dot="bg-verde" />
        </dl>
        <button
          onClick={() => store.reset()}
          title="Volver a los datos de demo"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted hover:bg-paper"
        >
          <RotateCcw className="size-4" aria-hidden /> Reiniciar demo
        </button>
      </header>

      <div className="grid flex-1 md:grid-cols-[minmax(0,1.4fr)_minmax(340px,1fr)]">
        <ul aria-label="Pacientes por prioridad" className="flex flex-col gap-2 p-4">
          {list.map((s) => (
            <li key={s.patient.id}>
              <PatientRow
                s={s}
                active={s.patient.id === selected?.patient.id}
                arrived={arrived.has(s.patient.id)}
                onSelect={() => setSelectedId(s.patient.id)}
              />
            </li>
          ))}
        </ul>
        {selected && (
          <Detail
            key={selected.patient.id}
            s={selected}
            messages={data.messages.filter((m) => m.patientId === selected.patient.id)}
            store={store}
          />
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, dot }: { label: string; value: number; dot: string }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className={cn("size-2.5 rounded-full", dot)} />
      <dt className="text-muted">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}

function PatientRow({
  s,
  active,
  arrived,
  onSelect,
}: {
  s: PatientSummary;
  active: boolean;
  arrived: boolean;
  onSelect: () => void;
}) {
  const reason =
    s.level !== "verde"
      ? s.latest?.triage.reasons.map((r) => r.text).join(", ")
      : s.silent
        ? `Sin registros desde hace ${s.daysSinceLast ?? "—"} días`
        : "Sin incidencias";

  return (
    <button
      onClick={onSelect}
      aria-current={active}
      className={cn(
        "grid w-full grid-cols-[6px_1fr] overflow-hidden rounded-xl border bg-surface text-left",
        active ? "border-brand" : "border-line hover:border-ink/30",
        arrived && "kairo-arrive",
      )}
    >
      <span aria-hidden className={s.level === "verde" && s.silent ? "bg-silencio" : levelBg(s.level)} />
      <span className="grid gap-x-6 gap-y-2 px-4 py-3 md:grid-cols-[1fr_auto] md:items-center">
        <span>
          <span className="block text-lg font-bold">{s.patient.name}</span>
          <span className="block text-sm text-muted">
            {DRUGS[s.patient.drugId]?.name} {s.patient.dose}, día {s.dayOfCycle}
          </span>
          <span className={cn("mt-1 block text-sm", s.level === "rojo" ? "text-rojo font-bold" : s.level === "ambar" ? "text-ambar-ink font-bold" : "text-muted")}>
            {reason}
          </span>
        </span>
        <span className="flex flex-col items-start gap-1 md:items-end">
          <DayStrip reports={s.reports} size="sm" daysToVisit={s.daysToVisit} />
          {s.latest && <span className="text-xs text-muted">Último registro {relativeTime(s.latest.createdAt)}</span>}
        </span>
      </span>
    </button>
  );
}

function Detail({ s, messages, store }: { s: PatientSummary; messages: Message[]; store: KairoStore }) {
  const [reply, setReply] = useState("");
  const latest = s.latest;

  async function sendReply() {
    if (!reply.trim()) return;
    await store.addMessage({ patientId: s.patient.id, sender: "enfermeria", body: reply.trim(), reportId: latest?.id });
    setReply("");
  }

  return (
    <aside className="flex flex-col gap-6 border-line bg-surface p-6 md:border-l">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold">{s.patient.name}</h2>
          <LevelPill level={s.level} />
        </div>
        <p className="mt-1 text-muted">
          {s.patient.age} años. {s.patient.diagnosis}.
          <br />
          {DRUGS[s.patient.drugId]?.name} {s.patient.dose} ({DRUGS[s.patient.drugId]?.schedule}). {s.patient.oncologist}.
        </p>
      </div>

      {latest && latest.triage.reasons.length > 0 && (
        <section>
          <h3 className="font-bold">Por qué aparece aquí</h3>
          <ul className="mt-2 space-y-1">
            {latest.triage.reasons.map((r) => (
              <li key={r.rule} className="flex items-start gap-2">
                <span aria-hidden className={cn("mt-2 size-2 shrink-0 rounded-full", levelBg(r.level))} />
                {r.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {latest?.rawText && (
        <section>
          <h3 className="font-bold">Lo que ha contado</h3>
          <blockquote className="mt-2 border-l-4 border-brand-tint pl-4 text-lg leading-snug">{latest.rawText}</blockquote>
          <p className="mt-1 text-sm text-muted">{relativeTime(latest.createdAt)}</p>
          {latest.symptoms.length > 0 && (
            <>
              <ul className="mt-3 flex flex-col gap-2">
                {latest.symptoms.map((x) => (
                  <li key={x.id} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className="rounded-full bg-paper px-3 py-1">
                      {SYMPTOMS[x.id].label} <strong>grado {x.grade}</strong>
                    </span>
                    {x.evidence && <span className="text-muted">por «{x.evidence}»</span>}
                  </li>
                ))}
              </ul>
              {latest.engine && (
                <p className="mt-2 text-xs text-muted">
                  {latest.engine === "ia"
                    ? "Síntomas graduados por IA según la escala PRO-CTCAE. Revísalos antes de actuar."
                    : "Síntomas detectados por palabras clave (IA no disponible). Revísalos antes de actuar."}
                </p>
              )}
            </>
          )}
        </section>
      )}

      {latest && latest.triage.level !== "verde" && (
        <section className="rounded-xl bg-paper p-4">
          <h3 className="font-bold">Acción sugerida según protocolo</h3>
          <p className="mt-1 leading-snug">{latest.triage.suggestedAction}</p>
          <p className="mt-2 text-sm text-muted">Es una sugerencia. La decisión es del equipo clínico.</p>
        </section>
      )}

      <section className="mt-auto">
        <h3 className="font-bold">Conversación</h3>
        <ul className="mt-2 flex max-h-56 flex-col gap-2 overflow-y-auto">
          {messages.map((m) => (
            <li key={m.id} className={cn("rounded-xl px-3 py-2", m.sender === "enfermeria" ? "self-end bg-brand-tint" : "bg-paper")}>
              {m.body}
              <span className="block text-xs text-muted">{relativeTime(m.createdAt)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-2">
          <label htmlFor="respuesta" className="sr-only">
            Responder a {s.patient.name}
          </label>
          <input
            id="respuesta"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendReply()}
            placeholder={`Escribir a ${s.patient.name.split(" ")[0]}…`}
            className="flex-1 rounded-full border border-line px-4 py-2.5 focus:border-brand focus:outline-none"
          />
          <button
            onClick={sendReply}
            disabled={!reply.trim()}
            className="flex items-center gap-2 rounded-full bg-brand px-4 font-bold text-white disabled:opacity-40"
          >
            <Send className="size-4" aria-hidden /> Enviar
          </button>
        </div>
      </section>
    </aside>
  );
}
