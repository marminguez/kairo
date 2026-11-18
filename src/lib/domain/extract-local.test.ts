import { describe, expect, it } from "vitest";
import { extractLocal } from "./extract-local";

describe("extractLocal", () => {
  it("gradúa la diarrea por número de deposiciones", () => {
    const r = extractLocal("Llevo dos días con diarrea, unas 6 veces al día");
    expect(r.symptoms).toContainEqual(expect.objectContaining({ id: "diarrea", grade: 2 }));
  });

  it("detecta varios síntomas y la intensidad", () => {
    const r = extractLocal("Me escuecen mucho las palmas de las manos y estoy cansado");
    const ids = r.symptoms.map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["mano_pie", "fatiga"]));
    expect(r.symptoms.find((s) => s.id === "mano_pie")?.grade).toBe(2);
  });

  it("lee fiebre y tensión", () => {
    expect(extractLocal("Tengo fiebre, 38,4 grados").measurements.temperature).toBe(38.4);
    expect(extractLocal("La tensión me marca 165/100").measurements).toMatchObject({ systolic: 165, diastolic: 100 });
  });

  it("sin síntomas devuelve listas vacías", () => {
    expect(extractLocal("Hoy me encuentro bien").symptoms).toEqual([]);
  });
});
