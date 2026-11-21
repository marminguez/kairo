# Kairo

**Actuar a tiempo, no en la próxima cita.**

Kairo es una plataforma de telemonitorización para pacientes con tratamiento oncológico oral. El paciente cuenta con su voz cómo se encuentra; Kairo lo convierte en síntomas graduados (escala PRO-CTCAE) y avisa a enfermería solo cuando hace falta, con el contexto ya preparado.

Proyecto para el **Hackathon Salud 2026**, reto Instituto #SaludsinBulos: telemonitorización, comunicación con el paciente y continuidad asistencial.

> Prototipo. Todos los pacientes son ficticios. Kairo no sustituye el criterio clínico.

## Cómo funciona

1. **El paciente habla, no rellena formularios.** Desde el móvil cuenta cómo está, o pulsa "Hoy estoy bien".
2. **La IA extrae y gradúa síntomas.** Diarrea, síndrome mano-pie, fatiga, tensión arterial, fiebre…
3. **Reglas clínicas fijas deciden la prioridad.** Verde, ámbar o rojo. La IA nunca decide sola el nivel de alerta: las reglas son auditables y configurables por el servicio (`src/lib/domain/triage.ts`).
4. **Enfermería ve en tiempo real quién necesita atención**, por qué, qué ha contado el paciente y la acción sugerida, y le responde desde el panel.
5. **Dudas sin bulos.** El paciente pregunta y Kairo responde solo con el prospecto oficial de su medicamento (CIMA, AEMPS), citando el fragmento en el que se apoya.
6. **Resumen para la consulta.** Con un clic, el oncólogo recibe la evolución de los últimos 14 días.

## Arrancar en local

```bash
npm install
npm run dev
```

- Portada: http://localhost:3000
- App del paciente: http://localhost:3000/paciente
- Panel de enfermería: http://localhost:3000/panel
- Demo en paralelo (para el vídeo): http://localhost:3000/demo
- Evidencia científica: http://localhost:3000/evidencia

Sin configurar nada, Kairo funciona en **modo demo local**: los datos viven en el navegador y las pestañas se sincronizan entre sí. Es también la red de seguridad para la demo en directo.

### Con IA

Añade `ANTHROPIC_API_KEY` en `.env.local`. Sin clave, o si la IA falla, Kairo usa un extractor local de palabras clave para que la demo nunca se quede sin respuesta. El modelo se puede cambiar con `ANTHROPIC_MODEL`.

La voz usa el reconocimiento del navegador: funciona en Chrome, Edge y Safari, en español.

### Con Supabase (sincronizar entre dispositivos)

1. Crea un proyecto en [Supabase](https://supabase.com).
2. En *SQL Editor*, ejecuta en orden `supabase/migrations/0001_init.sql`, `0002_engine.sql` y `0003_grants.sql`.
3. Copia `.env.example` como `.env.local` y rellena las claves.
4. Carga los pacientes ficticios: `npm run db:seed`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm test` | Tests del motor de triaje y del extractor |
| `npm run lint` | Linter |
| `npm run build` | Build de producción |
| `npm run db:seed` | Carga los datos de demo en Supabase |

## Estructura

```
src/
  app/
    page.tsx            Portada
    paciente/           App del paciente (móvil)
    panel/              Panel de enfermería
    demo/               Las dos vistas a la vez
  components/           Semáforo y la tira "entre citas"
  lib/
    domain/             Síntomas, fármacos, motor de triaje (con tests)
    demo/seed.ts        Pacientes ficticios
    store/              Datos: modo local o Supabase con tiempo real
supabase/migrations/    Esquema de base de datos
```

## Marca

Logotipo y monograma en `public/brand/` (pizarra `#2F495D` y versión blanca). En el código se usan como componentes en `src/components/brand.tsx`. Paleta: pizarra sobre papel crema `#F6F2EA`; el verde, ámbar y rojo del semáforo son los únicos colores vivos. Títulos en Figtree, texto en Atkinson Hyperlegible.

## Evidencia

La página `/evidencia` recoge los ensayos sobre monitorización de síntomas comunicados por el paciente (Basch 2016 y 2017, Denis 2019, PRO-TECT 2025), la guía ESMO 2022 y cómo se traduce cada dato en una decisión de diseño, con sus referencias.

## Stack

Next.js, TypeScript, Tailwind CSS, Supabase (Postgres + Realtime), API de Claude (Anthropic). Tipografía Atkinson Hyperlegible, diseñada para personas con baja visión.

## Equipo

Mar Mínguez, Jose y Daniela.
