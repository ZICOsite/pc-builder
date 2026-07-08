"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { getRequiredCategories, updateRequiredCategory } from "@/lib/api";
import type { RequiredCategory } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/icons";
import { BackButton } from "@/components/back-button";
import { Card, CardContent } from "@/components/ui/card";

type State = { status: "loading" } | { status: "error" } | { status: "ready"; categories: RequiredCategory[] };

export default function AdminSettingsPage() {
  const auth = useAuth();
  const { t } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });
  const [savingType, setSavingType] = useState<string | null>(null);

  useEffect(() => {
    getRequiredCategories()
      .then((categories) => setState({ status: "ready", categories }))
      .catch(() => setState({ status: "error" }));
  }, []);

  async function handleToggle(type: RequiredCategory["type"], required: boolean) {
    if (auth.status !== "authenticated" || state.status !== "ready") return;
    setSavingType(type);
    const previous = state.categories;
    setState({
      status: "ready",
      categories: previous.map((c) => (c.type === type ? { ...c, required } : c)),
    });
    try {
      await updateRequiredCategory(type, required, auth.accessToken);
    } catch {
      setState({ status: "ready", categories: previous });
      window.alert(t.admin.settings.updateErrorFallback);
    } finally {
      setSavingType(null);
    }
  }

  return (
    <>
      <BackButton fallbackHref="/admin" />
      <h1 className="text-xl font-semibold">{t.admin.settings.title}</h1>
      <p className="text-sm text-muted-foreground">{t.admin.settings.description}</p>

      {state.status === "loading" && (
        <p className="p-4 text-center text-muted-foreground">{t.admin.settings.loading}</p>
      )}
      {state.status === "error" && (
        <p className="p-4 text-center text-destructive">{t.admin.settings.loadErrorFallback}</p>
      )}

      {state.status === "ready" && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            {state.categories.map((category) => {
              const Icon = CATEGORY_ICONS[category.type];
              return (
                <label
                  key={category.type}
                  className="flex cursor-pointer items-center justify-between gap-2 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    {t.categories[category.type]}
                  </span>
                  <input
                    type="checkbox"
                    checked={category.required}
                    disabled={savingType === category.type}
                    onChange={(e) => handleToggle(category.type, e.target.checked)}
                    className="size-4"
                  />
                </label>
              );
            })}
          </CardContent>
        </Card>
      )}
    </>
  );
}
