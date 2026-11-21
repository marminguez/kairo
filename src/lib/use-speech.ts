"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Tipos mínimos de la Web Speech API (no vienen en lib.dom de TypeScript).
interface SpeechResult {
  0: { transcript: string };
  isFinal: boolean;
}
interface SpeechEvent {
  resultIndex: number;
  results: ArrayLike<SpeechResult>;
}
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => Recognition;

function getCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Dictado por voz en español con el reconocimiento del navegador (Chrome, Edge, Safari). */
export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<Recognition | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detección de capacidad del navegador
    setSupported(getCtor() !== null);
  }, []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) return;
    setFinalText("");
    setInterim("");
    setError(null);
    const r = new Ctor();
    r.lang = "es-ES";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
      let fin = "";
      let mid = "";
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) fin += res[0].transcript;
        else mid += res[0].transcript;
      }
      setFinalText(fin.trim());
      setInterim(mid.trim());
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed") setError("Necesitamos permiso para usar el micrófono. Puedes escribirlo en su lugar.");
      else if (e.error !== "no-speech" && e.error !== "aborted") setError("No hemos podido escucharte. Puedes escribirlo en su lugar.");
    };
    r.onend = () => setListening(false);
    rec.current = r;
    r.start();
    setListening(true);
  }, []);

  const stop = useCallback(() => {
    rec.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => () => rec.current?.stop(), []);

  const transcript = [finalText, interim].filter(Boolean).join(" ");
  return { supported, listening, transcript, error, start, stop };
}
