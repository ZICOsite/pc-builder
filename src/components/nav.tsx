"use client";

import Link from "next/link";
import { useAuth } from "@/components/telegram-provider";

export function Nav() {
  const auth = useAuth();

  return (
    <nav className="flex justify-center gap-4 border-b border-black/10 p-3 text-sm dark:border-white/15">
      <Link href="/">Конфигуратор</Link>
      {auth.status === "authenticated" && <Link href="/profile">Профиль</Link>}
    </nav>
  );
}
