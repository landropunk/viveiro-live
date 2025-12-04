'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';
import { CookieBanner } from './CookieBanner';
import { CookieSettings } from './CookieSettings';
import { useState } from 'react';

export function CookieConsentManager() {
  const { showBanner, acceptAll, rejectAll, acceptSelected } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);

  if (!showBanner && !showSettings) {
    return null;
  }

  return (
    <>
      {showBanner && !showSettings && (
        <CookieBanner
          onAcceptAll={acceptAll}
          onRejectAll={rejectAll}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {showSettings && (
        <CookieSettings
          onClose={() => setShowSettings(false)}
          onAcceptSelected={(consent) => {
            acceptSelected(consent);
            setShowSettings(false);
          }}
        />
      )}
    </>
  );
}
