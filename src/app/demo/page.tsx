import Link from "next/link";

export const metadata = { title: "Kairo · Demo" };

// Vista para el vídeo y la final: móvil del paciente y panel de enfermería a la vez.
// Ambos comparten datos en tiempo real (BroadcastChannel en modo local, Supabase Realtime si está configurado).
export default function DemoPage() {
  return (
    <main className="flex h-screen flex-col bg-ink">
      <header className="flex items-center gap-4 px-5 py-3 text-white">
        <Link href="/" className="text-lg font-bold">
          kairo
        </Link>
        <span className="text-white/70">El paciente cuenta cómo está. Enfermería lo ve al momento.</span>
      </header>
      <div className="grid flex-1 grid-cols-[400px_1fr] gap-4 px-4 pb-4">
        <iframe title="App del paciente" src="/paciente" className="h-full w-full rounded-[2rem] bg-surface" />
        <iframe title="Panel de enfermería" src="/panel" className="h-full w-full rounded-xl bg-surface" />
      </div>
    </main>
  );
}
