/**
 * Utilidades para gestión de cookies RGPD
 */

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const COOKIE_CONSENT_NAME = 'viveiro_cookie_consent';
const COOKIE_CONSENT_VERSION = '1.0';

/**
 * Obtiene el consentimiento de cookies guardado
 */
export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;

  try {
    const consent = localStorage.getItem(COOKIE_CONSENT_NAME);
    if (!consent) return null;

    const parsed = JSON.parse(consent);

    // Verificar versión
    if (parsed.version !== COOKIE_CONSENT_VERSION) {
      return null;
    }

    return parsed.consent;
  } catch (error) {
    console.error('Error al leer consentimiento de cookies:', error);
    return null;
  }
}

/**
 * Guarda el consentimiento de cookies
 */
export function setCookieConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;

  try {
    const data = {
      version: COOKIE_CONSENT_VERSION,
      consent,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(COOKIE_CONSENT_NAME, JSON.stringify(data));
  } catch (error) {
    console.error('Error al guardar consentimiento de cookies:', error);
  }
}

/**
 * Elimina todas las cookies según el consentimiento
 */
export function cleanupCookies(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;

  // Si no se aceptan cookies de analytics, limpiar cookies de Google Analytics
  if (!consent.analytics) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name] = cookie.split('=');
      const trimmedName = name.trim();

      // Eliminar cookies de Google Analytics
      if (
        trimmedName.startsWith('_ga') ||
        trimmedName.startsWith('_gid') ||
        trimmedName.startsWith('_gat')
      ) {
        document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    }
  }

  // Si no se aceptan cookies de marketing, limpiar cookies de terceros
  if (!consent.marketing) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name] = cookie.split('=');
      const trimmedName = name.trim();

      // Eliminar cookies de marketing comunes
      if (
        trimmedName.startsWith('_fbp') ||
        trimmedName.startsWith('_fbc') ||
        trimmedName.startsWith('fr')
      ) {
        document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    }
  }
}

/**
 * Verifica si se ha dado consentimiento
 */
export function hasGivenConsent(): boolean {
  return getCookieConsent() !== null;
}

/**
 * Resetea el consentimiento (útil para testing)
 */
export function resetCookieConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COOKIE_CONSENT_NAME);
}
