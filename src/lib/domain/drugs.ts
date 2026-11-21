export interface DrugDef {
  id: string;
  name: string;
  brand: string;
  schedule: string;
  /** Prospecto oficial en CIMA (AEMPS). Es la única fuente que usa Kairo para responder dudas del paciente. */
  prospectoUrl: string;
}

// Fármacos orales habituales en carcinoma renal avanzado.
export const DRUGS: Record<string, DrugDef> = {
  sunitinib: {
    id: "sunitinib",
    name: "Sunitinib",
    brand: "Sutent",
    schedule: "4 semanas sí, 2 semanas de descanso",
    prospectoUrl: "https://cima.aemps.es/cima/dochtml/p/06347001/P_06347001.html",
  },
  pazopanib: {
    id: "pazopanib",
    name: "Pazopanib",
    brand: "Votrient",
    schedule: "Diario continuo",
    prospectoUrl: "https://cima.aemps.es/cima/dochtml/p/10628004/Prospecto.html",
  },
  cabozantinib: {
    id: "cabozantinib",
    name: "Cabozantinib",
    brand: "Cabometyx",
    schedule: "Diario continuo",
    prospectoUrl: "https://cima.aemps.es/cima/dochtml/p/1161136004/Prospecto.html",
  },
  axitinib: {
    id: "axitinib",
    name: "Axitinib",
    brand: "Inlyta",
    schedule: "Dos veces al día, continuo",
    prospectoUrl: "https://cima.aemps.es/cima/dochtml/p/12777005/Prospecto.html",
  },
};
