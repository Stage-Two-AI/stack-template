import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Kort een tekst af op een maximale lengte, met een beletselteken. */
export function afkorten(tekst: string, maximum: number): string {
  return tekst.length <= maximum ? tekst : `${tekst.slice(0, maximum - 1)}…`;
}
