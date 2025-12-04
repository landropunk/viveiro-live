import { useState, useEffect } from 'react';
import {
  CookieConsent,
  getCookieConsent,
  setCookieConsent,
  cleanupCookies,
  hasGivenConsent,
} from '@/lib/cookies';

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    const savedConsent = getCookieConsent();

    if (savedConsent) {
      setConsent(savedConsent);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    setConsent(newConsent);
    setCookieConsent(newConsent);
    setShowBanner(false);
  };

  const rejectAll = () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    setConsent(newConsent);
    setCookieConsent(newConsent);
    cleanupCookies(newConsent);
    setShowBanner(false);
  };

  const acceptSelected = (selectedConsent: CookieConsent) => {
    const newConsent: CookieConsent = {
      necessary: true, // Siempre true
      analytics: selectedConsent.analytics,
      marketing: selectedConsent.marketing,
      preferences: selectedConsent.preferences,
    };

    setConsent(newConsent);
    setCookieConsent(newConsent);
    cleanupCookies(newConsent);
    setShowBanner(false);
  };

  const reopenBanner = () => {
    setShowBanner(true);
  };

  return {
    consent,
    showBanner,
    acceptAll,
    rejectAll,
    acceptSelected,
    reopenBanner,
    hasConsent: hasGivenConsent(),
  };
}
