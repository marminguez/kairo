import { Suspense } from "react";
import { PatientApp } from "./patient-app";

export const metadata = { title: "Kairo · Paciente" };

export default function PatientPage() {
  return (
    <main className="flex flex-1 justify-center bg-paper md:py-8">
      <div className="w-full max-w-[420px] bg-surface md:min-h-[780px] md:rounded-[2rem] md:border md:border-line md:shadow-sm">
        <Suspense fallback={<p className="p-6 text-muted">Cargando…</p>}>
          <PatientApp />
        </Suspense>
      </div>
    </main>
  );
}
