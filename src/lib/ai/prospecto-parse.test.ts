import { describe, expect, it } from "vitest";

// Comprueba la lógica de recorte de secciones sin red, con un HTML mínimo parecido al de CIMA.
describe("recorte del prospecto", () => {
  it("salta el índice y se queda con el cuerpo", async () => {
    const mod = await import("./prospecto-parse");
    const body = "x".repeat(600);
    const html = `<p>Contenido del prospecto</p><p>1. Qué es</p><p>2. Qué necesita saber antes de empezar</p><p>5. Conservación</p>
      <p>1. Qué es Sutent</p><p>2. Qué necesita saber antes de empezar a tomar Sutent</p><p>${body}</p><p>5. Conservación de Sutent</p><p>fin</p>`;
    const out = mod.relevantSections(mod.htmlToText(html));
    expect(out.startsWith("2. Qué necesita saber antes de empezar a tomar Sutent")).toBe(true);
    expect(out).toContain(body);
    expect(out).not.toContain("fin");
  });
});
