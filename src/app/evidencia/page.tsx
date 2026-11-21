import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/site";

export const metadata: Metadata = {
  title: "Kairo · La evidencia científica",
  description:
    "Qué dicen los ensayos sobre la monitorización de síntomas comunicados por el paciente y cómo se traduce en cada decisión de diseño de Kairo.",
};

// Investigación de la evidencia que respalda Kairo. Cada cifra lleva su referencia numerada al final de la página.
// Revisado el 21 de noviembre de 2026.

type Ref = { id: number; text: string; url: string };

const REFS: Ref[] = [
  {
    id: 1,
    text: "Basch E, Deal AM, Kris MG, et al. Symptom monitoring with patient-reported outcomes during routine cancer treatment: a randomized controlled trial. J Clin Oncol. 2016;34(6):557-565.",
    url: "https://doi.org/10.1200/JCO.2015.63.0830",
  },
  {
    id: 2,
    text: "Basch E, Deal AM, Dueck AC, et al. Overall survival results of a trial assessing patient-reported outcomes for symptom monitoring during routine cancer treatment. JAMA. 2017;318(2):197-198.",
    url: "https://doi.org/10.1001/jama.2017.7156",
  },
  {
    id: 3,
    text: "Denis F, Basch E, Septans AL, et al. Two-year survival comparing web-based symptom monitoring vs routine surveillance following treatment for lung cancer. JAMA. 2019;321(3):306-307.",
    url: "https://doi.org/10.1001/jama.2018.18085",
  },
  {
    id: 4,
    text: "Basch E, Schrag D, Jansen J, et al. Symptom monitoring with electronic patient-reported outcomes during cancer treatment: final results of the PRO-TECT cluster-randomized trial. Nat Med. 2025;31(4):1225-1232.",
    url: "https://doi.org/10.1038/s41591-025-03507-y",
  },
  {
    id: 5,
    text: "Di Maio M, Basch E, Denis F, et al. The role of patient-reported outcome measures in the continuum of cancer clinical care: ESMO Clinical Practice Guideline. Ann Oncol. 2022;33(9):878-892.",
    url: "https://doi.org/10.1016/j.annonc.2022.04.007",
  },
  {
    id: 6,
    text: "Arnold B, Mitchell SA, Lent L, et al. Linguistic validation of the Spanish version of the National Cancer Institute's PRO-CTCAE. Support Care Cancer. 2016;24(7):2843-2851.",
    url: "https://doi.org/10.1007/s00520-015-3062-5",
  },
  {
    id: 7,
    text: "Greer JA, Amoyal N, Nisotel L, et al. A systematic review of adherence to oral antineoplastic therapies. Oncologist. 2016;21(3):354-376.",
    url: "https://doi.org/10.1634/theoncologist.2015-0405",
  },
  {
    id: 8,
    text: "Iacovelli R, Cossu Rocca M, Galli L, De Giorgi U, et al. Clinical outcome of patients who reduced sunitinib or pazopanib during first-line treatment for advanced kidney cancer. Urol Oncol. 2017;35:541.e7-541.e13.",
    url: "https://doi.org/10.1016/j.urolonc.2017.05.007",
  },
  {
    id: 9,
    text: "Johnson SB, Parsons M, Dorff T, et al. Cancer misinformation and harmful information on Facebook and other social media: a brief report. J Natl Cancer Inst. 2022;114(7):1036-1039.",
    url: "https://doi.org/10.1093/jnci/djab141",
  },
  {
    id: 10,
    text: "Sociedad Española de Oncología Médica (SEOM) y REDECAN. Las cifras del cáncer en España 2026. Datos de cáncer de riñón recogidos por El Debate, 18 de junio de 2026.",
    url: "https://www.eldebate.com/salud-y-bienestar/salud/20260618/cancer-rinon-nuevos-tratamientos-mejoran-pronostico-pacientes_429715.html",
  },
];

function R({ n }: { n: number | number[] }) {
  const ids = Array.isArray(n) ? n : [n];
  return (
    <sup className="ml-0.5 text-xs font-bold">
      {ids.map((id, i) => (
        <span key={id}>
          {i > 0 && ","}
          <a href={`#ref-${id}`} className="text-brand no-underline hover:underline" aria-label={`Referencia ${id}`}>
            {id}
          </a>
        </span>
      ))}
    </sup>
  );
}

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 border-t border-line py-14">
      <p className="font-bold text-muted">{kicker}</p>
      <h2 className="mt-2 max-w-[28ch] font-display text-3xl leading-tight font-bold text-brand md:text-4xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Stat({ figure, children, refs }: { figure: string; children: ReactNode; refs: number | number[] }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <p className="font-display text-3xl font-bold text-brand">{figure}</p>
      <p className="mt-2 leading-relaxed">
        {children}
        <R n={refs} />
      </p>
    </div>
  );
}

const TRIALS = [
  {
    name: "Basch, Memorial Sloan Kettering",
    year: "2016–2017",
    design: "Ensayo aleatorizado, 1 centro, 766 pacientes con tumores sólidos metastásicos en quimioterapia",
    result:
      "Más pacientes mejoraron su calidad de vida (34 % frente a 18 %), menos fueron a urgencias (34 % frente a 41 %) y siguieron más tiempo en tratamiento (8,2 frente a 6,3 meses). Supervivencia mediana de 31,2 frente a 26,0 meses.",
    refs: [1, 2],
  },
  {
    name: "Denis, Francia",
    year: "2017–2019",
    design: "Ensayo aleatorizado multicéntrico, cáncer de pulmón avanzado tras el tratamiento inicial",
    result:
      "Un cuestionario semanal por internet con alertas al oncólogo alargó la supervivencia mediana: 22,5 frente a 14,9 meses.",
    refs: [3],
  },
  {
    name: "PRO-TECT, Estados Unidos",
    year: "2025",
    design: "Ensayo aleatorizado por centros, 52 consultas de oncología comunitaria en 26 estados, 1.191 pacientes metastásicos",
    result:
      "Sin diferencia en supervivencia global, que era el objetivo principal. Retrasó el deterioro de la función física (12,6 frente a 8,5 meses), el empeoramiento de los síntomas (12,7 frente a 9,9) y de la calidad de vida (15,6 frente a 12,2), y alargó el tiempo hasta la primera visita a urgencias.",
    refs: [4],
  },
] as const;

const DESIGN = [
  {
    decision: "El paciente habla en lugar de rellenar un cuestionario",
    why: "En PRO-TECT, la mediana de edad era de 63 años y cerca del 17 % no había usado nunca internet. En el ensayo de 2016, el beneficio fue mayor en quienes no tenían experiencia previa con ordenadores. La voz baja todavía más esa barrera.",
    refs: [1, 4],
  },
  {
    decision: "Los síntomas se gradúan con PRO-CTCAE",
    why: "Es la escala de síntomas comunicados por el paciente del Instituto Nacional del Cáncer de EE. UU., con versión en español validada lingüísticamente con 109 pacientes hispanohablantes. Así, lo que dice el paciente llega al equipo en el mismo idioma que usa la oncología para la toxicidad.",
    refs: [6],
  },
  {
    decision: "Las alertas las deciden reglas fijas, no la IA",
    why: "En los ensayos, la alerta saltaba con reglas sencillas: un síntoma grave o que empeora. En el estudio de 2016, cuando un síntoma llegaba a grado 3 o subía dos puntos. Kairo usa la misma lógica (grado 3 o síntoma de alarma en rojo, grado 2 o persistencia en ámbar), auditable y configurable por el servicio.",
    refs: [1, 4],
  },
  {
    decision: "El panel está pensado para enfermería",
    why: "En los ensayos, las alertas llegaban sobre todo a enfermeras y gestores de casos, que son quienes ya llevan el manejo de síntomas y la coordinación. En el estudio de 2016, enfermería actuó con frecuencia a partir de las alertas.",
    refs: [1, 4],
  },
  {
    decision: "Un resumen de 14 días para la consulta",
    why: "En el ensayo de Basch, el oncólogo recibía en cada visita un informe con la evolución de los síntomas del paciente. Kairo lo genera en un clic.",
    refs: [2],
  },
  {
    decision: "Las dudas se responden solo con el prospecto oficial",
    why: "Un tercio de los artículos sobre cáncer más populares en redes contiene desinformación, y la mayoría de esos artículos incluye información dañina. Kairo no busca en internet: responde con el prospecto de la AEMPS y cita el fragmento.",
    refs: [9],
  },
] as const;

export default function EvidenciaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6">
        <header className="pt-8 pb-14">
          <p className="font-bold text-muted">La evidencia</p>
          <h1 className="mt-2 max-w-[22ch] font-display text-4xl leading-[1.08] font-bold tracking-tight text-brand md:text-6xl">
            Escuchar al paciente entre consultas cambia lo que pasa después
          </h1>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed">
            Kairo no parte de una intuición. Desde 2016, varios ensayos aleatorizados han comprobado que, cuando el paciente
            comunica sus síntomas desde casa y el equipo recibe una alerta, los pacientes viven mejor y acuden menos a
            urgencias. La guía europea de oncología ya lo recomienda. Aquí está lo que sabemos, de dónde sale y cómo se
            traduce en cada decisión de Kairo.
          </p>
          <nav aria-label="En esta página" className="mt-8 flex flex-wrap gap-2 text-sm">
            {[
              ["#problema", "El problema"],
              ["#ensayos", "Los ensayos"],
              ["#guia", "La recomendación"],
              ["#diseno", "Del dato al diseño"],
              ["#limites", "Lo que aún no sabemos"],
              ["#referencias", "Referencias"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full border border-line bg-surface px-3 py-1.5 hover:border-brand">
                {label}
              </a>
            ))}
          </nav>
        </header>

        <Section id="problema" kicker="1. El problema" title="La toxicidad no espera a la próxima cita">
          <p className="max-w-[65ch] text-lg leading-relaxed">
            Cada vez más pacientes con cáncer se tratan en casa con fármacos orales. Es una ventaja, pero los efectos
            secundarios aparecen entre una consulta y otra, cuando nadie del equipo los ve.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Stat figure="Hasta la mitad" refs={2}>
              de los síntomas de los pacientes en tratamiento por cáncer avanzado pasan desapercibidos para los clínicos.
            </Stat>
            <Stat figure="45,7 %" refs={8}>
              de los pacientes con cáncer renal metastásico en primera línea con sunitinib o pazopanib necesitaron reducir
              la dosis por toxicidad, en una serie de 591 pacientes.
            </Stat>
            <Stat figure="Del 46 % al 100 %" refs={7}>
              es el rango de adherencia a los tratamientos oncológicos orales. Una parte importante de los pacientes no
              consigue tomarlos como se prescriben.
            </Stat>
            <Stat figure="32,5 %" refs={9}>
              de los 200 artículos sobre cáncer más populares en redes sociales contenía desinformación, y el 76,9 % de esos
              incluía información potencialmente dañina.
            </Stat>
          </div>
          <p className="mt-8 max-w-[65ch] leading-relaxed text-muted">
            En España se diagnosticarán 301.884 nuevos casos de cáncer en 2026, por primera vez más de 300.000. De ellos,
            9.165 serán de riñón, el tumor con el que empieza el piloto de Kairo.
            <R n={10} />
          </p>
        </Section>

        <Section id="ensayos" kicker="2. Los ensayos" title="Tres ensayos, una misma conclusión: el paciente vive mejor">
          <ol className="space-y-5">
            {TRIALS.map((t) => (
              <li key={t.name} className="rounded-2xl border border-line bg-surface p-6">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="font-display text-xl font-bold">{t.name}</h3>
                  <span className="text-sm text-muted">{t.year}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{t.design}</p>
                <p className="mt-3 leading-relaxed">
                  {t.result}
                  <R n={[...t.refs]} />
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-8 rounded-2xl bg-brand-tint p-6 leading-relaxed">
            <p className="font-bold text-brand">Una lectura honesta de la supervivencia</p>
            <p className="mt-2">
              Los dos primeros ensayos encontraron más supervivencia, pero uno se hizo en un solo centro y el otro solo en
              cáncer de pulmón. PRO-TECT, el más grande y el más parecido a la práctica real, no confirmó esa diferencia.
              Sí confirmó los beneficios en calidad de vida, síntomas, función física y urgencias. Por eso Kairo promete
              actuar antes y vivir mejor el tratamiento, no vivir más.
              <R n={[2, 3, 4]} />
            </p>
          </div>
        </Section>

        <Section id="guia" kicker="3. La recomendación" title="La guía europea ya lo recomienda">
          <p className="max-w-[65ch] text-lg leading-relaxed">
            En 2022, la Sociedad Europea de Oncología Médica (ESMO) publicó una guía de práctica clínica sobre el uso
            de los resultados comunicados por el paciente en la atención oncológica. Cubre su uso desde el inicio del
            tratamiento activo, durante el seguimiento y hasta el final de la vida, y la firman, entre otros, los autores
            de los ensayos anteriores.
            <R n={5} />
          </p>
          <p className="mt-4 max-w-[65ch] leading-relaxed text-muted">
            Los autores de PRO-TECT concluyen que la monitorización de síntomas debería formar parte de la atención
            oncológica de calidad como práctica estándar.
            <R n={4} />
          </p>
        </Section>

        <Section id="diseno" kicker="4. Del dato al diseño" title="Cada decisión de Kairo sale de la evidencia">
          <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {DESIGN.map((d) => (
              <div key={d.decision} className="grid gap-2 p-6 md:grid-cols-[16rem_1fr] md:gap-8">
                <dt className="font-display text-lg leading-snug font-bold">{d.decision}</dt>
                <dd className="leading-relaxed text-muted">
                  {d.why}
                  <R n={[...d.refs]} />
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="limites" kicker="5. Lo que aún no sabemos" title="Lo que Kairo tiene que demostrar">
          <ul className="max-w-[65ch] list-disc space-y-3 pl-6 text-lg leading-relaxed">
            <li>
              Los ensayos usaron cuestionarios. Que la IA gradúe bien lo que el paciente cuenta con su voz está por validar:
              el primer estudio del piloto debe medir la concordancia entre el grado de la IA y el de enfermería.
            </li>
            <li>
              Los umbrales del semáforo son orientativos. Cada servicio debe revisarlos y ajustarlos antes de usarlos con
              pacientes reales.
            </li>
            <li>
              La evidencia procede sobre todo de pacientes en quimioterapia y de Estados Unidos y Francia. Hay que medir el
              efecto en tratamientos orales y en el sistema sanitario español.
            </li>
            <li>
              Para usarse con pacientes, Kairo debería certificarse como producto sanitario y cumplir el Reglamento europeo de
              IA y el RGPD. <Link href="/aviso" className="text-brand underline underline-offset-4">Cómo lo abordamos hoy</Link>.
            </li>
          </ul>
        </Section>

        <section id="referencias" className="scroll-mt-6 border-t border-line py-14">
          <h2 className="font-display text-2xl font-bold text-brand">Referencias</h2>
          <ol className="mt-6 space-y-3 text-sm leading-relaxed">
            {REFS.map((r) => (
              <li key={r.id} id={`ref-${r.id}`} className="grid scroll-mt-6 grid-cols-[2rem_1fr] target:rounded target:bg-sand/50">
                <span className="font-bold text-muted">{r.id}.</span>
                <span>
                  {r.text}{" "}
                  <a href={r.url} className="break-all text-brand underline underline-offset-4">
                    {r.url.replace(/^https:\/\//, "")}
                  </a>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted">Revisado el 21 de noviembre de 2026.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
