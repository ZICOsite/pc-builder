"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useAuth } from "@/components/telegram-provider";
import { useIsAdmin } from "@/components/admin-provider";
import { useLocale } from "@/components/locale-provider";
import type { Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "uz", label: "UZ" },
];

export function Nav() {
  const auth = useAuth();
  const isAdmin = useIsAdmin();
  const { locale, setLocale, t } = useLocale();

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-2 px-4 py-3">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" />}>
            <Menu />
            <span className="sr-only">Menu</span>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>PC Forge</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4">
              <SheetClose
                render={<Link href="/" />}
                nativeButton={false}
                className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
              >
                {t.nav.home}
              </SheetClose>
              <SheetClose
                render={<Link href="/configurator" />}
                nativeButton={false}
                className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
              >
                {t.nav.configurator}
              </SheetClose>
              {auth.status === "authenticated" && (
                <SheetClose
                  render={<Link href="/profile" />}
                  nativeButton={false}
                  className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
                >
                  {t.nav.profile}
                </SheetClose>
              )}
              {isAdmin && (
                <SheetClose
                  render={<Link href="/admin" />}
                  nativeButton={false}
                  className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
                >
                  {t.nav.admin}
                </SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <span className="font-heading text-sm font-semibold text-foreground">PC Forge</span>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            {LOCALES.find((l) => l.code === locale)?.label}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {LOCALES.map((l) => (
              <DropdownMenuItem key={l.code} onClick={() => setLocale(l.code)}>
                {l.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
