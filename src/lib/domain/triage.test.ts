import { describe, expect, it } from "vitest";
import { triage } from "./triage";

const NOW = new Date("2026-11-20T10:00:00Z");
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

describe("triage", () => {
  it("verde sin síntomas", () => {
    expect(triage([], {}, [], undefined, NOW).level).toBe("verde");
  });

  it("verde con síntoma leve aislado", () => {
    expect(triage([{ id: "fatiga", grade: 1 }], {}, [], undefined, NOW).level).toBe("verde");
  });

  it("ámbar con grado 2", () => {
    const r = triage([{ id: "diarrea", grade: 2 }], {}, [], undefined, NOW);
    expect(r.level).toBe("ambar");
    expect(r.reasons[0].rule).toBe("grado2.diarrea");
  });

  it("rojo con grado 3", () => {
    expect(triage([{ id: "mano_pie", grade: 3 }], {}, [], undefined, NOW).level).toBe("rojo");
  });

  it("rojo con síntoma de alarma aunque sea leve", () => {
    expect(triage([{ id: "dolor_toracico", grade: 1 }], {}, [], undefined, NOW).level).toBe("rojo");
  });

  it("rojo con fiebre", () => {
    expect(triage([], { temperature: 38.2 }, [], undefined, NOW).level).toBe("rojo");
  });

  it("ámbar y rojo por tensión arterial", () => {
    expect(triage([], { systolic: 165, diastolic: 95 }, [], undefined, NOW).level).toBe("ambar");
    expect(triage([], { systolic: 185, diastolic: 100 }, [], undefined, NOW).level).toBe("rojo");
  });

  it("ámbar por persistencia de un síntoma leve 3 días", () => {
    const history = [
      { createdAt: daysAgo(1), symptoms: [{ id: "nauseas" as const, grade: 1 as const }] },
      { createdAt: daysAgo(2), symptoms: [{ id: "nauseas" as const, grade: 1 as const }] },
    ];
    const r = triage([{ id: "nauseas", grade: 1 }], {}, history, undefined, NOW);
    expect(r.level).toBe("ambar");
    expect(r.reasons[0].text).toContain("3 días");
  });

  it("no cuenta persistencia si hay un día sin síntoma", () => {
    const history = [
      { createdAt: daysAgo(1), symptoms: [{ id: "nauseas" as const, grade: 1 as const }] },
      { createdAt: daysAgo(3), symptoms: [{ id: "nauseas" as const, grade: 1 as const }] },
    ];
    expect(triage([{ id: "nauseas", grade: 1 }], {}, history, undefined, NOW).level).toBe("verde");
  });

  it("el nivel final es el máximo y las razones se ordenan de mayor a menor", () => {
    const r = triage(
      [
        { id: "diarrea", grade: 2 },
        { id: "vomitos", grade: 3 },
      ],
      {},
      [],
      undefined,
      NOW,
    );
    expect(r.level).toBe("rojo");
    expect(r.reasons.map((x) => x.level)).toEqual(["rojo", "ambar"]);
  });
});

describe("persistencia combinada", () => {
  it("no duplica el motivo si el síntoma ya es grado 2", () => {
    const h = [1, 2].map((d) => ({ createdAt: daysAgo(d), symptoms: [{ id: "diarrea" as const, grade: 2 as const }] }));
    const r = triage([{ id: "diarrea", grade: 2 }], {}, h, undefined, NOW);
    expect(r.reasons).toHaveLength(1);
    expect(r.reasons[0].text).toBe("Diarrea grado 2, 3 días seguidos");
  });
});
