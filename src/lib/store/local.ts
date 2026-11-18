import { buildMessages, buildPatients, buildReports } from "../demo/seed";
import type { KairoData, KairoStore, NewMessage, NewReport } from "./types";

const KEY = "kairo-demo-v1";
const CHANNEL = "kairo";

function seed(): KairoData {
  const today = new Date();
  return { patients: buildPatients(today), reports: buildReports(today), messages: buildMessages(today) };
}

function read(): KairoData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as KairoData;
  } catch {
    // localStorage no disponible o datos corruptos: se regenera la demo.
  }
  const data = seed();
  write(data);
  return data;
}

function write(data: KairoData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Sin persistencia: la demo sigue funcionando en memoria.
  }
}

const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Math.random()));

export function createLocalStore(): KairoStore {
  const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL) : null;
  const listeners = new Set<() => void>();
  const notify = () => {
    listeners.forEach((l) => l());
    channel?.postMessage("changed");
  };
  channel?.addEventListener("message", () => listeners.forEach((l) => l()));

  return {
    mode: "local",
    async load() {
      return read();
    },
    async addReport(input: NewReport) {
      const data = read();
      const report = { ...input, id: uid(), createdAt: input.createdAt ?? new Date().toISOString() };
      data.reports.push(report);
      write(data);
      notify();
      return report;
    },
    async addMessage(input: NewMessage) {
      const data = read();
      const message = { ...input, id: uid(), createdAt: new Date().toISOString() };
      data.messages.push(message);
      write(data);
      notify();
      return message;
    },
    subscribe(onChange) {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    async reset() {
      write(seed());
      notify();
    },
  };
}
