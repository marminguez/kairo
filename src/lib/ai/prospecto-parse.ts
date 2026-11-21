// Funciones puras para convertir el HTML del prospecto de CIMA en texto.

export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

/** Se queda con las secciones útiles para el paciente: de "2. Qué necesita saber" a "5. Conservación". */
export function relevantSections(text: string): string {
  // El índice del principio repite los mismos títulos: nos quedamos con la última aparición (el cuerpo).
  const last = (re: RegExp) => [...text.matchAll(re)].at(-1)?.index ?? -1;
  const start = last(/\n\s*2\.\s*Qué necesita saber antes/gi);
  const end = last(/\n\s*5\.\s*Conservación/gi);
  if (start >= 0 && end > start + 500) return text.slice(start, end).trim();
  return text;
}
