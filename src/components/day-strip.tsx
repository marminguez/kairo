import { dailyLevels } from "@/lib/domain/summary";
import type { Report } from "@/lib/domain/types";
import { cn } from "@/lib/utils";
import { levelBg, LEVEL_LABEL } from "./level";

/**
 * "Entre citas": una barra por día con el peor nivel registrado.
 * Es la firma visual de Kairo: lo que antes era invisible hasta la consulta.
 */
export function DayStrip({
  reports,
  days = 14,
  daysToVisit,
  size = "md",
}: {
  reports: Report[];
  days?: number;
  daysToVisit?: number;
  size?: "sm" | "md";
}) {
  const levels = dailyLevels(reports, days);
  const h = size === "sm" ? "h-5" : "h-8";
  const label = levels
    .map((l, i) => `${i === days - 1 ? "hoy" : `hace ${days - 1 - i} días`}: ${l ? LEVEL_LABEL[l] : "sin registro"}`)
    .join(", ");

  return (
    <div className="flex items-end gap-[3px]" role="img" aria-label={`Últimos ${days} días. ${label}`}>
      {levels.map((level, i) => (
        <span
          key={i}
          className={cn(
            "w-[7px] rounded-[2px]",
            h,
            level ? levelBg(level) : "border border-dashed border-silencio bg-transparent",
            i === days - 1 && "w-[11px]",
          )}
        />
      ))}
      {daysToVisit !== undefined && daysToVisit >= 0 && (
        <span className={cn("ml-2 flex items-center gap-1 text-xs text-muted whitespace-nowrap", h)}>
          <span aria-hidden className="h-full w-px bg-ink/40" />
          cita en {daysToVisit} {daysToVisit === 1 ? "día" : "días"}
        </span>
      )}
    </div>
  );
}
