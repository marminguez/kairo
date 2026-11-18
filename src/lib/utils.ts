import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

/** "hace 5 minutos", "ayer", "hace 3 días" */
export function relativeTime(iso: string, now = new Date()) {
  const diff = (new Date(iso).getTime() - now.getTime()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return "ahora mismo";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  return rtf.format(Math.round(diff / 86400), "day");
}
