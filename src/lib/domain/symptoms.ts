import type { Grade, SymptomId } from "./types";

export interface SymptomDef {
  id: SymptomId;
  label: string;
  /** Cómo lo diría un paciente; ayuda a la IA y a la búsqueda local. */
  patientWords: string[];
  /** Descripción de cada grado en lenguaje del paciente (orientativa, pendiente de validación clínica). */
  grades: Partial<Record<Grade, string>>;
  /** Si es síntoma de alarma, cualquier grado ≥1 se trata como rojo. */
  redFlag?: boolean;
}

// Subconjunto de síntomas frecuentes con inhibidores de tirosina quinasa orales
// (sunitinib, pazopanib, cabozantinib, axitinib) más síntomas de alarma.
export const SYMPTOMS: Record<SymptomId, SymptomDef> = {
  diarrea: {
    id: "diarrea",
    label: "Diarrea",
    patientWords: ["diarrea", "suelto", "cagalera", "voy al baño", "deposiciones"],
    grades: {
      1: "Menos de 4 deposiciones al día más de lo habitual",
      2: "De 4 a 6 deposiciones al día más de lo habitual",
      3: "7 o más deposiciones al día, o no puede hacer vida normal",
      4: "Riesgo vital: deshidratación grave",
    },
  },
  nauseas: {
    id: "nauseas",
    label: "Náuseas",
    patientWords: ["náuseas", "nauseas", "mareo de estómago", "ganas de vomitar", "revuelto"],
    grades: {
      1: "Pérdida de apetito sin cambiar lo que come",
      2: "Come menos, sin perder peso ni deshidratarse",
      3: "No consigue comer ni beber lo suficiente",
    },
  },
  vomitos: {
    id: "vomitos",
    label: "Vómitos",
    patientWords: ["vómito", "vomito", "devuelto", "he vomitado"],
    grades: {
      1: "1 o 2 episodios en 24 horas",
      2: "3 a 5 episodios en 24 horas",
      3: "6 o más episodios en 24 horas",
      4: "Riesgo vital",
    },
  },
  fatiga: {
    id: "fatiga",
    label: "Cansancio",
    patientWords: ["cansado", "cansada", "agotado", "agotada", "sin fuerzas", "fatiga"],
    grades: {
      1: "Se alivia descansando",
      2: "No se alivia descansando y limita algunas tareas",
      3: "Le impide cuidarse por sí mismo",
    },
  },
  mano_pie: {
    id: "mano_pie",
    label: "Síndrome mano-pie",
    patientWords: ["palmas", "plantas", "manos rojas", "pies", "escuecen", "ampollas"],
    grades: {
      1: "Enrojecimiento o hinchazón sin dolor",
      2: "Dolor, ampollas o descamación que limita algunas tareas",
      3: "Lesiones graves con dolor que impiden cuidarse",
    },
  },
  mucositis: {
    id: "mucositis",
    label: "Llagas en la boca",
    patientWords: ["llagas", "boca", "aftas", "escozor al comer"],
    grades: {
      1: "Molestias leves",
      2: "Dolor que obliga a cambiar la dieta",
      3: "Dolor intenso que impide comer",
    },
  },
  inapetencia: {
    id: "inapetencia",
    label: "Falta de apetito",
    patientWords: ["sin hambre", "no tengo hambre", "apetito", "no me apetece comer"],
    grades: {
      1: "Come algo menos de lo habitual",
      2: "Come bastante menos, sin perder mucho peso",
      3: "Pérdida de peso importante o necesita ayuda para alimentarse",
    },
  },
  disgeusia: {
    id: "disgeusia",
    label: "Alteración del gusto",
    patientWords: ["sabor", "gusto", "sabe a metal", "no me sabe"],
    grades: {
      1: "Sabor alterado sin cambiar la dieta",
      2: "Sabor alterado que le hace cambiar la dieta",
    },
  },
  cefalea: {
    id: "cefalea",
    label: "Dolor de cabeza",
    patientWords: ["cabeza", "jaqueca", "migraña"],
    grades: {
      1: "Leve",
      2: "Moderado, limita algunas tareas",
      3: "Intenso, impide cuidarse",
    },
  },
  sangrado: {
    id: "sangrado",
    label: "Sangrado",
    patientWords: ["sangre", "sangrado", "sangro", "hemorragia"],
    redFlag: true,
    grades: { 1: "Cualquier sangrado nuevo" },
  },
  disnea: {
    id: "disnea",
    label: "Falta de aire",
    patientWords: ["ahogo", "me ahogo", "falta de aire", "no puedo respirar"],
    redFlag: true,
    grades: { 1: "Falta de aire nueva" },
  },
  dolor_toracico: {
    id: "dolor_toracico",
    label: "Dolor en el pecho",
    patientWords: ["pecho", "opresión", "dolor torácico"],
    redFlag: true,
    grades: { 1: "Dolor u opresión en el pecho" },
  },
};

export const SYMPTOM_IDS = Object.keys(SYMPTOMS) as SymptomId[];
