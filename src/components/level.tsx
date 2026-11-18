import type { TriageLevel } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

export const LEVEL_LABEL: Record<TriageLevel, string> = {
  rojo: "Atender hoy",
  ambar: "Revisar en 24–48 h",
  verde: "Estable",
};

const BG: Record<TriageLevel, string> = { rojo: "bg-rojo", ambar: "bg-ambar", verde: "bg-verde" };

export function levelBg(level: TriageLevel | null) {
  return level ? BG[level] : "bg-line";
}

export function LevelPill({ level, className }: { level: TriageLevel; className?: string }) {
  const styles: Record<TriageLevel, string> = {
    rojo: "bg-rojo-tint text-rojo",
    ambar: "bg-ambar-tint text-ambar-ink",
    verde: "bg-verde-tint text-verde",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-bold", styles[level], className)}>
      <span aria-hidden className={cn("size-2 rounded-full", BG[level])} />
      {LEVEL_LABEL[level]}
    </span>
  );
}
