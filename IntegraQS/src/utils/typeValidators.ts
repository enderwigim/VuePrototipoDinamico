// 2026-08-20 Santi.
// La idea de estas funciones es que sean funciones que nos permitan validar ciertos inputs para poder hacer un control de casos.

export function isIntegerString(value: string): boolean {
  return /^-?\d+$/.test(value.trim());
}
