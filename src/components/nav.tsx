"use client";

import Link from "next/link";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";
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
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 py-3 text-sm font-medium">
        <Link href="/" className="text-foreground hover:text-primary">
          {t.nav.configurator}
        </Link>
        {auth.status === "authenticated" && (
          <Link href="/profile" className="text-foreground hover:text-primary">
            {t.nav.profile}
          </Link>
        )}
        <span className="ml-auto flex gap-1">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLocale(l.code)}
              className={cn(
                "rounded-md px-1.5 py-0.5 text-xs transition-colors",
                l.code === locale
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {l.label}
            </button>
          ))}
        </span>
      </div>
    </nav>
  );
}
