"use client";

import { BookOpen, ExternalLink, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import type { AskResponse } from "@/app/api/ask/route";
import type { Patient } from "@/lib/domain/types";
import type { KairoStore } from "@/lib/store";

/**
 * Dudas del paciente respondidas solo con el prospecto oficial (AEMPS), con citas.
 * Es la respuesta de Kairo a los bulos: información fiable sin salir de la app.
 */
export function AskCard({
  patient,
  store,
  onReport,
}: {
  patient: Patient;
  store: KairoStore;
  onReport: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskResponse | null>(null);

  async function ask() {
    const q = question.trim();
    if (!q) return;
    setLoading(true);
    setResult(null);
    setAsked(q);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, drugId: patient.drugId }),
      });
      const data = (await res.json()) as AskResponse;
      setResult(data);
      setQuestion("");
      // Queda en la conversación para que enfermería sepa qué dudas tiene el paciente.
      await store.addMessage({ patientId: patient.id, sender: "paciente", body: q });
      await store.addMessage({
        patientId: patient.id,
        sender: "sistema",
        body: data.source ? `${data.answer}\n\nFuente: ${data.source.title}` : data.answer,
      });
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border-2 border-line p-4 text-left hover:border-brand"
      >
        <MessageCircleQuestion className="size-7 shrink-0 text-brand" aria-hidden />
        <span>
          <span className="block text-lg font-bold">Tengo una duda</span>
          <span className="block text-muted">Te respondemos con la información oficial de tu medicamento.</span>
        </span>
      </button>
    );
  }

  return (
    <section className="flex flex-col gap-3 rounded-2xl border-2 border-line p-4">
      <label htmlFor="duda" className="text-lg font-bold">
        ¿Qué quieres saber?
      </label>
      <textarea
        id="duda"
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Por ejemplo: ¿es normal que se me pongan amarillas las manos?"
        className="rounded-xl border-2 border-line p-3 text-lg leading-snug focus:border-brand focus:outline-none"
      />
      <div className="flex gap-3">
        <button
          onClick={ask}
          disabled={!question.trim() || loading}
          className="flex-1 rounded-full bg-brand py-3 text-lg font-bold text-white disabled:opacity-40"
        >
          {loading ? "Consultando el prospecto…" : "Preguntar"}
        </button>
        <button onClick={() => setOpen(false)} className="px-4 text-lg font-bold text-muted">
          Cerrar
        </button>
      </div>

      {result && (
        <div aria-live="polite" className="mt-2 flex flex-col gap-3">
          <p className="text-sm text-muted">Has preguntado: {asked}</p>
          <p className="text-lg leading-snug whitespace-pre-line">{result.answer}</p>
          <p className="text-sm text-muted">
            Respuesta generada por inteligencia artificial solo con el prospecto oficial. Si tienes dudas, consulta a tu
            equipo.
          </p>
          {result.citations.length > 0 && (
            <div className="rounded-xl bg-paper p-3">
              <p className="flex items-center gap-2 text-sm font-bold">
                <BookOpen className="size-4" aria-hidden /> Lo dice el prospecto
              </p>
              <ul className="mt-1 space-y-1">
                {result.citations.map((c) => (
                  <li key={c.text} className="text-sm leading-snug text-muted">
                    «{c.text.length > 220 ? `${c.text.slice(0, 220)}…` : c.text}»
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.source && (
            <a
              href={result.source.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-bold text-brand underline underline-offset-4"
            >
              Fuente oficial: {result.source.title} <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
          {result.shouldReport && (
            <button
              onClick={() => onReport(asked)}
              className="rounded-full border-2 border-brand py-3 text-lg font-bold text-brand"
            >
              Contárselo a mi equipo
            </button>
          )}
        </div>
      )}
    </section>
  );
}
