import { ArrowRight, BellRing, BookOpenCheck, ClipboardList, Mic, Monitor, Scale, Smartphone, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site";
import hero from "../../public/kairo-hero.jpg";

// Portada. Estructura de la propuesta de diseño (titular, foto, llamada a la acción) con el contenido de la demo:
// la tira de 14 días como firma visual, cómo funciona, la evidencia y el acceso a las dos vistas.

const HISTORY = ["v", "v", "v", "v", "n", "v", "v", "v", "v", "v", "v", "n", "v"] as const;

const STEPS = [
  {
    icon: Mic,
    title: "El paciente habla",
    text: "Desde el móvil cuenta cómo se encuentra, con su voz y sus palabras. Sin formularios. Si está bien, un toque.",
  },
  {
    icon: Stethoscope,
    title: "La IA lo traduce a datos clínicos",
    text: "Identifica los síntomas y los gradúa con la escala PRO-CTCAE del Instituto Nacional del Cáncer de EE. UU. Guarda la frase exacta que lo justifica.",
  },
  {
    icon: Scale,
    title: "Reglas clínicas deciden la prioridad",
    text: "Verde, ámbar o rojo. La IA nunca decide sola: las alertas salen de reglas fijas y auditables que configura el servicio.",
  },
  {
    icon: BellRing,
    title: "Enfermería actúa a tiempo",
    text: "El panel ordena a los pacientes por urgencia, explica el motivo, sugiere la acción del protocolo y permite responder al momento.",
  },
  {
    icon: BookOpenCheck,
    title: "Dudas sin bulos",
    text: "Kairo responde solo con el prospecto oficial de la AEMPS y enseña el fragmento en el que se apoya. Si es un síntoma, ofrece avisar al equipo.",
  },
  {
    icon: ClipboardList,
    title: "Resumen para la consulta",
    text: "Antes de cada cita, el oncólogo recibe en un clic la evolución de los últimos 14 días.",
  },
] as const;

const EVIDENCE = [
  {
    figure: "+4 meses",
    text: "sin deterioro de la función física al monitorizar síntomas cada semana (12,6 frente a 8,5 meses).",
    source: "Ensayo PRO-TECT, 1.191 pacientes, Nature Medicine 2025",
  },
  {
    figure: "34 %",
    text: "de los pacientes mejoró su calidad de vida cuando podía comunicar sus síntomas entre consultas, frente al 18 % con la atención habitual.",
    source: "Basch et al., Journal of Clinical Oncology 2016",
  },
  {
    figure: "1 de cada 3",
    text: "artículos sobre cáncer más compartidos en redes sociales contiene información falsa.",
    source: "Johnson et al., JNCI 2021",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* Héroe */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 pt-6 pb-16 md:grid-cols-[1.15fr_1fr] md:items-center md:pt-10 md:pb-20">
            <div className="relative z-10">
              <h1 className="font-display text-5xl leading-[1.04] font-bold tracking-tight text-brand md:text-[3.25rem] xl:text-[3.6rem]">
                Actuar a tiempo, <br className="hidden lg:block" />
                <span className="lg:whitespace-nowrap">no en la próxima cita</span>
              </h1>
              <p className="mt-6 max-w-[40ch] text-xl leading-relaxed">
                Seguimiento desde casa durante el tratamiento oncológico oral. El paciente cuenta cómo está y enfermería lo
                sabe al momento.
              </p>
              <p className="mt-3 max-w-[48ch] text-muted">Empezamos por el cáncer de riñón.</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="#como-funciona"
                  className="rounded-xl bg-brand px-7 py-4 font-display text-lg font-bold text-white hover:bg-ink"
                >
                  Conocer Kairo
                </Link>
                <Link href="/demo" className="flex items-center gap-2 font-bold text-brand underline-offset-4 hover:underline">
                  Ver la demo en directo <ArrowRight className="size-5" aria-hidden />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[2rem]">
                <Image
                  src={hero}
                  alt="Un hombre de unos sesenta años, sentado en el sofá de su casa, habla con su móvil."
                  priority
                  placeholder="blur"
                  sizes="(min-width: 768px) 520px, 100vw"
                  className="h-auto w-full"
                />
              </div>

              {/* La firma visual: lo que pasa entre citas, ahora visible. */}
              <figure className="relative z-10 -mt-24 ml-4 max-w-[22rem] rounded-2xl bg-surface p-5 shadow-[0_12px_40px_-12px_rgb(30_45_57/0.35)] md:absolute md:bottom-8 md:-left-16 md:mt-0 md:ml-0">
                <div className="flex h-14 items-end gap-1" aria-hidden>
                  {HISTORY.map((d, i) => (
                    <span
                      key={i}
                      className={
                        d === "v"
                          ? "h-full w-full rounded-[3px] bg-verde"
                          : "h-full w-full rounded-[3px] border-2 border-dashed border-silencio"
                      }
                    />
                  ))}
                  <span className="kairo-turn h-full w-full rounded-[3px] bg-verde" />
                </div>
                <figcaption className="mt-4 leading-snug">
                  <span className="block text-sm text-muted">Día 13 de tratamiento, 9:12</span>
                  <q className="mt-1 block font-bold">Llevo dos días con diarrea, unas seis veces al día.</q>
                  <span className="mt-2 block text-sm text-ambar-ink">Diarrea grado 2. Enfermería lo ve hoy, no dentro de tres semanas.</span>
                </figcaption>
              </figure>
            </div>
          </div>
          {/* Arco de arena, eco del monograma */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-56 -left-40 size-[28rem] rounded-full border-[56px] border-sand/70"
          />
        </section>

        {/* Entrar en la demo: banda de la marca, una tarjeta por papel */}
        <section id="demo" className="scroll-mt-6 bg-brand py-16 text-white md:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-bold text-sand">Pruébalo</p>
                <h2 className="mt-2 font-display text-4xl leading-tight font-bold">Entra en la demo</h2>
                <p className="mt-3 max-w-[56ch] text-lg leading-relaxed text-white/80">
                  Hacen falta dos personas: una en el móvil, como paciente, y otra en el ordenador, como enfermería. Lo que
                  cuenta el paciente aparece en el panel al momento.
                </p>
              </div>
              <Link href="/demo" className="flex items-center gap-2 font-bold text-white underline-offset-4 hover:underline">
                ¿Una sola pantalla? Ver las dos a la vez <ArrowRight className="size-5" aria-hidden />
              </Link>
            </div>

            <nav aria-label="Entrar en la demo" className="relative mt-10 grid gap-5 md:grid-cols-2 md:gap-8">
              <Link
                href="/paciente"
                className="group flex flex-col rounded-3xl bg-surface p-7 text-ink shadow-[0_20px_50px_-24px_rgb(0_0_0/0.5)] transition hover:-translate-y-1 md:p-8"
              >
                <div className="flex items-center gap-4">
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <Mic className="size-7" aria-hidden />
                  </span>
                  <div>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-muted">
                      <Smartphone className="size-4" aria-hidden /> En el móvil
                    </span>
                    <span className="mt-0.5 block font-display text-2xl font-bold text-brand">Soy el paciente</span>
                  </div>
                </div>
                <p className="mt-5 text-lg leading-relaxed text-muted md:mb-8">
                  Cuenta con tu voz cómo te encuentras, pregunta tus dudas sobre el medicamento y lee lo que te responde tu
                  equipo.
                </p>
                <span className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-brand px-5 py-3.5 font-display text-lg font-bold text-white group-hover:bg-ink md:mt-auto md:pt-3.5">
                  Abrir la app del paciente <ArrowRight className="size-5" aria-hidden />
                </span>
              </Link>

              <Link
                href="/panel"
                className="group flex flex-col rounded-3xl bg-surface p-7 text-ink shadow-[0_20px_50px_-24px_rgb(0_0_0/0.5)] transition hover:-translate-y-1 md:p-8"
              >
                <div className="flex items-center gap-4">
                  <span className="flex size-16 shrink-0 flex-col justify-center gap-1.5 rounded-2xl bg-paper px-3.5" aria-hidden>
                    <span className="h-2 rounded-full bg-rojo" />
                    <span className="h-2 w-4/5 rounded-full bg-ambar" />
                    <span className="h-2 w-3/5 rounded-full bg-verde" />
                  </span>
                  <div>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-muted">
                      <Monitor className="size-4" aria-hidden /> En el ordenador
                    </span>
                    <span className="mt-0.5 block font-display text-2xl font-bold text-brand">Soy enfermería</span>
                  </div>
                </div>
                <p className="mt-5 text-lg leading-relaxed text-muted md:mb-8">
                  Mira quién necesita atención hoy y por qué, revisa lo que ha contado el paciente y respóndele desde el panel.
                </p>
                <span className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-brand px-5 py-3.5 font-display text-lg font-bold text-white group-hover:bg-ink md:mt-auto md:pt-3.5">
                  Abrir el panel de enfermería <ArrowRight className="size-5" aria-hidden />
                </span>
              </Link>
            </nav>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="scroll-mt-6 py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="font-bold text-muted">Cómo funciona</p>
            <h2 className="mt-2 max-w-[24ch] font-display text-4xl leading-tight font-bold text-brand">
              Lo que antes era invisible hasta la consulta, ahora llega a tiempo
            </h2>
            <ol className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
                    <step.icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold">
                      <span className="sr-only">{i + 1}. </span>
                      {step.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Evidencia */}
        <section className="py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="font-bold text-muted">Por qué funciona</p>
            <h2 className="mt-2 max-w-[26ch] font-display text-4xl leading-tight font-bold text-brand">
              Escuchar al paciente entre consultas tiene evidencia detrás
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {EVIDENCE.map((e) => (
                <figure key={e.figure} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
                  <span className="font-display text-4xl font-bold text-brand">{e.figure}</span>
                  <p className="mt-3 leading-relaxed">{e.text}</p>
                  <figcaption className="mt-auto pt-5 text-sm text-muted">{e.source}</figcaption>
                </figure>
              ))}
            </div>
            <Link href="/evidencia" className="mt-8 inline-flex items-center gap-2 font-bold text-brand underline-offset-4 hover:underline">
              Ver toda la evidencia y sus fuentes <ArrowRight className="size-5" aria-hidden />
            </Link>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
