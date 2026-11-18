// Pacientes y registros FICTICIOS para la demo. Ningún dato corresponde a personas reales.
// Las fechas se generan relativas a "hoy" para que la demo siempre parezca reciente.

import { triage } from "../domain/triage";
import type { Grade, Measurements, Message, Patient, Report, SymptomEntry, SymptomId } from "../domain/types";

export const DEMO_PATIENT_ID = "p-antonio";

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);

export function buildPatients(today = new Date()): Patient[] {
  return [
    {
      id: DEMO_PATIENT_ID,
      name: "Antonio Ferrer",
      age: 58,
      sex: "M",
      diagnosis: "Carcinoma renal de células claras, estadio IV",
      drugId: "sunitinib",
      dose: "50 mg/día",
      cycleStart: iso(addDays(today, -12)),
      nextVisit: iso(addDays(today, 9)),
      oncologist: "Dra. Ruiz",
    },
    {
      id: "p-carmen",
      name: "Carmen Llull",
      age: 64,
      sex: "F",
      diagnosis: "Carcinoma renal metastásico",
      drugId: "cabozantinib",
      dose: "60 mg/día",
      cycleStart: iso(addDays(today, -20)),
      nextVisit: iso(addDays(today, 6)),
      oncologist: "Dr. Serra",
    },
    {
      id: "p-miguel",
      name: "Miguel Ángel Roig",
      age: 71,
      sex: "M",
      diagnosis: "Carcinoma renal, recaída pulmonar",
      drugId: "pazopanib",
      dose: "800 mg/día",
      cycleStart: iso(addDays(today, -30)),
      nextVisit: iso(addDays(today, 2)),
      oncologist: "Dra. Ruiz",
    },
    {
      id: "p-lucia",
      name: "Lucía Bennàssar",
      age: 52,
      sex: "F",
      diagnosis: "Carcinoma renal de células claras",
      drugId: "axitinib",
      dose: "5 mg cada 12 h",
      cycleStart: iso(addDays(today, -9)),
      nextVisit: iso(addDays(today, 12)),
      oncologist: "Dr. Serra",
    },
    {
      id: "p-rafael",
      name: "Rafael Oliver",
      age: 67,
      sex: "M",
      diagnosis: "Carcinoma renal papilar",
      drugId: "cabozantinib",
      dose: "40 mg/día",
      cycleStart: iso(addDays(today, -40)),
      nextVisit: iso(addDays(today, 15)),
      oncologist: "Dra. Ruiz",
    },
    {
      id: "p-pilar",
      name: "Pilar Mas",
      age: 75,
      sex: "F",
      diagnosis: "Carcinoma renal de células claras",
      drugId: "sunitinib",
      dose: "37,5 mg/día",
      cycleStart: iso(addDays(today, -16)),
      nextVisit: iso(addDays(today, 4)),
      oncologist: "Dr. Serra",
    },
  ];
}

type DayPlan = { s?: Partial<Record<SymptomId, Grade>>; m?: Measurements; text?: string } | null;

// 14 días por paciente, del más antiguo (índice 0 = hace 13 días) a hoy. null = no registró ese día.
const PLANS: Record<string, DayPlan[]> = {
  [DEMO_PATIENT_ID]: [
    {}, {}, { s: { fatiga: 1 } }, {}, { s: { disgeusia: 1 } }, {}, { s: { fatiga: 1 } },
    {}, { s: { disgeusia: 1 } }, {}, { s: { fatiga: 1 } }, {}, { s: { disgeusia: 1 } }, null,
  ],
  "p-carmen": [
    {}, { s: { fatiga: 1 } }, {}, { s: { diarrea: 1 } }, {}, { s: { mano_pie: 1 } }, { s: { mano_pie: 1 } },
    { s: { diarrea: 1, mano_pie: 1 } }, { s: { diarrea: 1, mano_pie: 1 } }, { s: { diarrea: 2, mano_pie: 1 } },
    { s: { diarrea: 2, mano_pie: 2 } }, { s: { diarrea: 2, mano_pie: 2, fatiga: 1 } },
    { s: { diarrea: 2, mano_pie: 2, fatiga: 2 } },
    { s: { diarrea: 2, mano_pie: 2, fatiga: 2 }, text: "Llevo varios días yendo al baño unas cinco o seis veces y me duelen mucho las plantas de los pies al andar." },
  ],
  "p-miguel": [
    { m: { systolic: 138, diastolic: 85 } }, {}, { m: { systolic: 142, diastolic: 88 } }, {}, { m: { systolic: 150, diastolic: 92 } },
    {}, { m: { systolic: 155, diastolic: 95 } }, { s: { cefalea: 1 } }, { m: { systolic: 158, diastolic: 96 } },
    { s: { cefalea: 1 }, m: { systolic: 162, diastolic: 98 } }, { s: { cefalea: 1 } },
    { s: { cefalea: 2 }, m: { systolic: 170, diastolic: 102 } }, { s: { cefalea: 2 }, m: { systolic: 176, diastolic: 104 } },
    { s: { cefalea: 2 }, m: { systolic: 184, diastolic: 112, temperature: 36.8 }, text: "Me duele bastante la cabeza desde ayer y el tensiómetro me marca 18,4 de alta." },
  ],
  "p-lucia": [
    null, {}, {}, { s: { mucositis: 1 } }, {}, {}, { s: { mucositis: 1 } }, {}, {}, {}, { s: { fatiga: 1 } }, {}, {},
    { text: "Hoy me encuentro bien, algo cansada por la tarde pero nada más." , s: { fatiga: 1 } },
  ],
  "p-rafael": [
    {}, {}, {}, {}, {}, {}, {}, {}, {}, null, null, null, null, null,
  ],
  "p-pilar": [
    {}, { s: { inapetencia: 1 } }, {}, { s: { inapetencia: 1 } }, { s: { nauseas: 1 } }, {}, { s: { nauseas: 1 } },
    { s: { nauseas: 1, inapetencia: 1 } }, {}, { s: { nauseas: 1 } }, { s: { nauseas: 1 } },
    { s: { nauseas: 1, inapetencia: 1 } },
    { s: { nauseas: 1 } },
    { s: { nauseas: 1, inapetencia: 1 }, text: "Sigo con el estómago revuelto, como poco pero voy tirando." },
  ],
};

function toEntries(s?: Partial<Record<SymptomId, Grade>>): SymptomEntry[] {
  return Object.entries(s ?? {}).map(([id, grade]) => ({ id: id as SymptomId, grade: grade as Grade }));
}

export function buildReports(today = new Date()): Report[] {
  const reports: Report[] = [];
  for (const [patientId, plan] of Object.entries(PLANS)) {
    const history: Report[] = [];
    plan.forEach((day, i) => {
      if (!day) return;
      const date = addDays(today, i - (plan.length - 1));
      date.setUTCHours(9 + (i % 4), 15 * (i % 4), 0, 0);
      const symptoms = toEntries(day.s);
      const measurements = day.m ?? {};
      const report: Report = {
        id: `${patientId}-r${i}`,
        patientId,
        createdAt: date.toISOString(),
        source: "seed",
        rawText: day.text ?? "",
        symptoms,
        measurements,
        triage: triage(symptoms, measurements, history, undefined, date),
      };
      history.push(report);
      reports.push(report);
    });
  }
  return reports;
}

export function buildMessages(today = new Date()): Message[] {
  const at = (daysBack: number, h: number) => {
    const d = addDays(today, -daysBack);
    d.setUTCHours(h, 0, 0, 0);
    return d.toISOString();
  };
  return [
    {
      id: "m-1",
      patientId: DEMO_PATIENT_ID,
      createdAt: at(4, 12),
      sender: "enfermeria",
      body: "Hola Antonio, vemos que el sabor metálico va y viene. Es habitual con sunitinib: prueba con cubiertos de plástico y caramelos sin azúcar. Seguimos atentas.",
    },
  ];
}
