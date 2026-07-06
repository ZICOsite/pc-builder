"use client";

import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { Configurator } from "@/components/configurator";

export default function ConfiguratorPage() {
  const auth = useAuth();
  const { t } = useLocale();

  return (
    <main className="flex flex-1 flex-col items-center gap-4 py-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">PC Forge</h1>
      {auth.status === "error" && <p className="text-destructive">{t.errors.authFailed}</p>}
      <Configurator />
    </main>
  );
}
