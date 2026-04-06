'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LanguageCode, TranslationKey, translate } from './translations';

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const langToGoogleCode: Record<LanguageCode, string> = {
  US: 'en',
  SA: 'ar',
  FR: 'fr',
  DE: 'de',
  ES: 'es',
  BR: 'pt',
  CN: 'zh-CN',
  JP: 'ja',
  KR: 'ko',
  IN: 'hi',
  PK: 'ur',
  TR: 'tr',
  RU: 'ru',
  IT: 'it',
  NL: 'nl',
};

function setGoogleTranslateCookie(googleCode: string) {
  const cookieValue = `/en/${googleCode}`;
  document.cookie = `googtrans=${cookieValue};path=/`;
  document.cookie = `googtrans=${cookieValue};domain=${window.location.hostname};path=/`;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === 'undefined') return 'US';
    return (window.localStorage.getItem('nexus_lang_code') as LanguageCode | null) ?? 'US';
  });

  type GoogleTranslateWindow = Window & {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: { pageLanguage: string; autoDisplay: boolean },
          elementId: string,
        ) => unknown;
      };
    };
  };

  useEffect(() => {
    const existing = document.getElementById('google-translate-script');
    if (existing) return;

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    (window as GoogleTranslateWindow).googleTranslateElementInit = () => {
      const translateElement = (window as GoogleTranslateWindow).google?.translate?.TranslateElement;
      if (!translateElement) return;
      new translateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
        },
        'google_translate_element',
      );
    };
  }, []);

  useEffect(() => {
    const googleCode = langToGoogleCode[language] ?? 'en';
    setGoogleTranslateCookie(googleCode);
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    const googleCode = langToGoogleCode[lang] ?? 'en';
    const applied = window.sessionStorage.getItem('nexus_applied_google_lang');

    setLanguageState(lang);
    window.localStorage.setItem('nexus_lang_code', lang);
    setGoogleTranslateCookie(googleCode);

    if (applied !== googleCode) {
      window.sessionStorage.setItem('nexus_applied_google_lang', googleCode);
      window.location.reload();
    }
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => translate(language, key),
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      <div id="google_translate_element" style={{ display: 'none' }} />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
