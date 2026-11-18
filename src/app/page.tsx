import Link from "next/link";

// Portada: explica Kairo en una frase y da acceso a las dos vistas de la demo.
const HISTORY = ["v", "v", "v", "v", "n", "v", "v", "v", "v", "v", "v", "n", "v"] as const;

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 md:py-16">
      <header className="flex items-center justify-between">
        <span className="text-2xl font-bold tracking-tight text-brand">kairo</span>
        <Link href="/demo" className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold hover:border-brand">
          Ver la demo completa
        </Link>
      </header>

      <section className="mt-16 grid gap-12 md:mt-24 md:grid-cols-[1.1fr_1fr] md:items-end">
        <div>
          <h1 className="text-5xl leading-[1.05] font-bold tracking-tight md:text-7xl">
            Actuar a tiempo, no en la próxima cita.
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">
            Los pacientes con tratamiento oncológico oral cuentan con su voz cómo se encuentran. Kairo lo convierte en
            síntomas graduados y avisa a enfermería solo cuando hace falta.
          </p>
        </div>

        <figure className="rounded-2xl bg-surface p-6 shadow-[0_1px_0_var(--line)]">
          <div className="flex h-28 items-end gap-1.5" aria-hidden>
            {HISTORY.map((d, i) => (
              <span key={i} className={d === "v" ? "h-full w-full rounded bg-verde" : "h-full w-full rounded border-2 border-dashed border-silencio"} />
            ))}
            <span className="kairo-turn h-full w-full rounded bg-verde" />
          </div>
          <figcaption className="mt-5 text-base leading-relaxed">
            <span className="block text-muted">Día 13 de tratamiento, a las 9:12</span>
            <q className="mt-1 block font-bold">Llevo dos días con diarrea, unas seis veces al día.</q>
            <span className="mt-2 block text-ambar-ink">Diarrea grado 2. Enfermería lo ve hoy, no dentro de tres semanas.</span>
          </figcaption>
        </figure>
      </section>

      <nav aria-label="Entrar en la demo" className="mt-20 grid gap-4 md:grid-cols-2">
        <Link href="/paciente" className="group rounded-2xl border border-line bg-surface p-6 hover:border-brand">
          <span className="block text-xl font-bold group-hover:text-brand">App del paciente</span>
          <span className="mt-1 block text-muted">Contar cómo me encuentro y hablar con mi equipo.</span>
        </Link>
        <Link href="/panel" className="group rounded-2xl border border-line bg-surface p-6 hover:border-brand">
          <span className="block text-xl font-bold group-hover:text-brand">Panel de enfermería</span>
          <span className="mt-1 block text-muted">Ver quién necesita atención hoy y responder.</span>
        </Link>
      </nav>

      <footer className="mt-auto pt-16 text-sm text-muted">
        Prototipo para Hackathon Salud 2026. Todos los pacientes son ficticios. Kairo no sustituye el criterio clínico.
      </footer>
    </main>
  );
}
