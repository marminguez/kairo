export interface DrugDef {
  id: string;
  name: string;
  schedule: string;
  /** Ficha técnica en CIMA (AEMPS). Se usará como fuente verificada en las respuestas. */
  cimaUrl: string;
}

// Fármacos orales habituales en carcinoma renal avanzado.
// Las URL apuntan al buscador de CIMA; se sustituirán por la ficha concreta al construir la parte de fuentes.
export const DRUGS: Record<string, DrugDef> = {
  sunitinib: {
    id: "sunitinib",
    name: "Sunitinib",
    schedule: "4 semanas sí, 2 semanas de descanso",
    cimaUrl: "https://cima.aemps.es/cima/publico/lista.html",
  },
  pazopanib: {
    id: "pazopanib",
    name: "Pazopanib",
    schedule: "Diario continuo",
    cimaUrl: "https://cima.aemps.es/cima/publico/lista.html",
  },
  cabozantinib: {
    id: "cabozantinib",
    name: "Cabozantinib",
    schedule: "Diario continuo",
    cimaUrl: "https://cima.aemps.es/cima/publico/lista.html",
  },
  axitinib: {
    id: "axitinib",
    name: "Axitinib",
    schedule: "Dos veces al día, continuo",
    cimaUrl: "https://cima.aemps.es/cima/publico/lista.html",
  },
};
