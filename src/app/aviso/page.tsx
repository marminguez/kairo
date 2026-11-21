import Link from "next/link";

export const metadata = { title: "Kairo · IA y datos" };

// Información de transparencia (art. 50 del Reglamento de IA) y sobre el tratamiento de datos del prototipo.
export default function AvisoPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 text-lg leading-relaxed">
      <Link href="/" className="text-xl font-bold text-brand">
        kairo
      </Link>
      <h1 className="mt-8 text-3xl font-bold">Cómo usa Kairo la inteligencia artificial y los datos</h1>

      <h2 className="mt-8 text-xl font-bold">Es un prototipo</h2>
      <p className="mt-2">
        Kairo es un prototipo de investigación creado para el Hackathon Salud 2026. Todos los pacientes que aparecen son
        ficticios. No es un producto sanitario con marcado CE y no debe usarse para tomar decisiones sobre pacientes
        reales. No escribas datos personales reales.
      </p>

      <h2 className="mt-8 text-xl font-bold">Dónde hay inteligencia artificial</h2>
      <ul className="mt-2 list-disc space-y-2 pl-6">
        <li>
          Cuando el paciente cuenta cómo se encuentra, una IA (Claude, de Anthropic) identifica los síntomas y les asigna
          un grado orientativo según la escala PRO-CTCAE. Guarda la frase del paciente que justifica cada grado.
        </li>
        <li>
          Cuando el paciente pregunta una duda, la IA responde solo con el prospecto oficial de su medicamento publicado
          por la AEMPS, y muestra el fragmento en el que se apoya.
        </li>
        <li>El resumen previo a la consulta lo redacta la IA a partir de los registros del paciente.</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold">Qué no hace la inteligencia artificial</h2>
      <ul className="mt-2 list-disc space-y-2 pl-6">
        <li>
          No decide el nivel de alerta. Verde, ámbar y rojo salen de reglas clínicas fijas, revisables por el servicio.
        </li>
        <li>No diagnostica ni cambia el tratamiento. Todas las acciones son sugerencias para el equipo sanitario.</li>
        <li>No recibe el nombre del paciente.</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold">Si la IA no está disponible</h2>
      <p className="mt-2">
        Kairo sigue funcionando con un sistema sin IA basado en palabras clave, menos preciso. La app indica en cada
        caso qué sistema se ha usado.
      </p>

      <h2 className="mt-8 text-xl font-bold">Datos</h2>
      <p className="mt-2">
        En este prototipo los datos son ficticios. Se guardan en una base de datos de Supabase y, para graduar síntomas
        y responder dudas, el texto se envía a la API de Anthropic, que no lo usa para entrenar sus modelos. Un uso con
        pacientes reales requeriría una evaluación de impacto en protección de datos, procesamiento en la Unión Europea y
        la autorización como producto sanitario.
      </p>
    </main>
  );
}
