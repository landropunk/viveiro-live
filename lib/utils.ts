/**
 * Utilidades generales de la aplicación
 */

/**
 * Convierte velocidad del viento de m/s a km/h
 * @param ms Velocidad en metros por segundo
 * @returns Velocidad en kilómetros por hora
 */
export function msToKmh(ms: number): number {
  return ms * 3.6;
}

/**
 * Convierte velocidad del viento de km/h a m/s
 * @param kmh Velocidad en kilómetros por hora
 * @returns Velocidad en metros por segundo
 */
export function kmhToMs(kmh: number): number {
  return kmh / 3.6;
}

/**
 * Formatea un número con decimales específicos
 * @param value Valor a formatear
 * @param decimals Número de decimales
 * @returns String formateado
 */
export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

/**
 * Convierte y formatea velocidad del viento de m/s a km/h
 * @param ms Velocidad en metros por segundo
 * @param decimals Número de decimales (por defecto 0)
 * @returns String formateado con la velocidad en km/h
 */
export function formatWindSpeed(ms: number, decimals: number = 0): string {
  return formatNumber(msToKmh(ms), decimals);
}
