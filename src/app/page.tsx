"use client";

import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { Configurator } from "@/components/configurator";

export default function Home() {
  const auth = useAuth();
  const { t } = useLocale();

  return (
    <main className="flex flex-1 flex-col items-center gap-4 py-6">
      <h1 className="text-2xl font-semibold">PC Forge</h1>
      {auth.status === "error" && <p className="text-red-500">{t.errors.authFailed}</p>}
      <Configurator />
    </main>
  );
}
