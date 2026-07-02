"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { retrieveRawInitData } from "@telegram-apps/sdk-react";
import { DEFAULT_LOCALE, dictionaries, normalizeLocale, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "pcforge_locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof dictionaries)[Locale];
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: dictionaries[DEFAULT_LOCALE],
});

export function useLocale() {
  return useContext(LocaleContext);
}

function detectInitialLocale(): Locale {
  const stored = normalizeLocale(localStorage.getItem(STORAGE_KEY));
  if (stored) return stored;

  try {
    const raw = retrieveRawInitData();
    const userJson = raw ? new URLSearchParams(raw).get("user") : null;
    if (userJson) {
      const user = JSON.parse(userJson) as { language_code?: string };
      const tgLocale = normalizeLocale(user.language_code);
      if (tgLocale) return tgLocale;
    }
  } catch {
    // Not inside Telegram or launch params unavailable — fall through to default.
  }

  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    queueMicrotask(() => setLocaleState(detectInitialLocale()));
  }, []);

  function setLocale(next: Locale) {
    localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: dictionaries[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}
