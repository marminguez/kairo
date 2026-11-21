import { MonitorSmartphone, Smartphone } from "lucide-react";
import Link from "next/link";
import { Logo, Monogram } from "./brand";

// Cabecera y pie de las páginas públicas (portada y evidencia). La app del paciente y el panel tienen los suyos.

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-6 sm:px-6">
      <Link href="/" aria-label="Kairo, ir a la portada" className="text-brand">
        <Logo className="h-7 sm:h-8 md:h-9" />
      </Link>
      <nav aria-label="Principal" className="ml-auto flex items-center gap-3.5 text-base sm:gap-4 md:gap-7">
        <Link href="/#como-funciona" className="hidden hover:text-brand lg:inline">
          Cómo funciona
        </Link>
        <Link href="/evidencia" className="hidden hover:text-brand md:inline">
          Evidencia
        </Link>
        <Link href="/paciente" className="flex items-center gap-1.5 font-bold hover:text-brand">
          <Smartphone className="size-4" aria-hidden /> Paciente
        </Link>
        <Link href="/panel" className="flex items-center gap-1.5 font-bold hover:text-brand">
          <MonitorSmartphone className="size-4" aria-hidden /> Enfermería
        </Link>
        <Link
          href="/demo"
          className="hidden rounded-full border-2 border-brand px-4 py-1.5 font-bold whitespace-nowrap text-brand hover:bg-brand hover:text-white sm:inline"
        >
          Ver la demo
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-start">
        <Monogram className="size-10 text-brand" decorative />
        <p className="max-w-[60ch] text-sm leading-relaxed text-muted">
          Prototipo para el Hackathon Salud 2026, reto Instituto #SaludsinBulos. Todos los pacientes son ficticios. Kairo
          no es un producto sanitario y no sustituye el criterio clínico.
        </p>
        <nav aria-label="Más información" className="flex flex-col gap-2 text-sm md:ml-auto">
          <Link href="/evidencia" className="underline underline-offset-4">
            La evidencia científica
          </Link>
          <Link href="/aviso" className="underline underline-offset-4">
            Cómo usa Kairo la IA y los datos
          </Link>
          <a href="/libro-de-kairo.pdf" download className="font-bold underline underline-offset-4">
            Descargar el libro de Kairo (PDF)
          </a>
          <a href="https://github.com/marminguez/kairo" className="underline underline-offset-4">
            Código en GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
