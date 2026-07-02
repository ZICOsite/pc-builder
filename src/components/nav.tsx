"use client";

import Link from "next/link";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import type { Locale } from "@/lib/i18n";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "uz", label: "UZ" },
];

export function Nav() {
  const auth = useAuth();
  const { locale, setLocale, t } = useLocale();

  return (
    <nav className="flex items-center justify-center gap-4 border-b border-black/10 p-3 text-sm dark:border-white/15">
      <Link href="/">{t.nav.configurator}</Link>
      {auth.status === "authenticated" && <Link href="/profile">{t.nav.profile}</Link>}
      <span className="ml-auto flex gap-1">
        {LOCALES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            className={`rounded px-1.5 py-0.5 text-xs ${
              l.code === locale ? "bg-foreground text-background" : "text-zinc-400"
            }`}
          >
            {l.label}
          </button>
        ))}
      </span>
    </nav>
  );
}
