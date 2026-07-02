"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getComponents, saveBuild } from "@/lib/api";
import { isCompatible, type Selections } from "@/lib/compatibility";
import { formatPrice, specSummary } from "@/lib/format";
import type { Component, ComponentType } from "@/lib/types";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";

const CATEGORY_TYPES: ComponentType[] = [
  "CPU",
  "MOTHERBOARD",
  "RAM",
  "GPU",
  "STORAGE",
  "PSU",
  "CASE",
  "COOLING",
];

function pruneIncompatible(selections: Selections): Selections {
  const next = { ...selections };
  for (let pass = 0; pass < 2; pass++) {
    for (const type of Object.keys(next) as ComponentType[]) {
      const component = next[type];
      if (component && !isCompatible(type, component, next)) {
        delete next[type];
      }
    }
  }
  return next;
}

export function Configurator() {
  const auth = useAuth();
  const { locale, t } = useLocale();
  const [componentsByType, setComponentsByType] = useState<Partial<Record<ComponentType, Component[]>>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selections, setSelections] = useState<Selections>({});
  const [openCategory, setOpenCategory] = useState<ComponentType | null>(null);
  const [saveState, setSaveState] = useState<
    { status: "idle" } | { status: "saving" } | { status: "saved"; buildId: string } | { status: "error" }
  >({ status: "idle" });

  useEffect(() => {
    Promise.all(CATEGORY_TYPES.map((type) => getComponents(type).then((list) => [type, list] as const)))
      .then((entries) => {
        setComponentsByType(Object.fromEntries(entries));
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const totalPrice = useMemo(
    () => Object.values(selections).reduce((sum, c) => sum + Number(c.price), 0),
    [selections],
  );

  function selectComponent(type: ComponentType, component: Component) {
    setSelections((prev) => pruneIncompatible({ ...prev, [type]: component }));
    setOpenCategory(null);
  }

  function deselectComponent(type: ComponentType) {
    setSelections((prev) => {
      const rest = { ...prev };
      delete rest[type];
      return pruneIncompatible(rest);
    });
  }

  async function handleSave() {
    if (auth.status !== "authenticated") return;
    const items = Object.values(selections).map((c) => ({ componentId: c.id, quantity: 1 }));
    if (items.length === 0) return;

    setSaveState({ status: "saving" });
    try {
      const build = await saveBuild(auth.accessToken, items);
      setSaveState({ status: "saved", buildId: build.id });
    } catch {
      setSaveState({ status: "error" });
    }
  }

  if (loading) {
    return <p className="p-4 text-center">{t.configurator.loading}</p>;
  }

  if (loadError) {
    return <p className="p-4 text-center text-red-500">{t.configurator.loadErrorFallback}</p>;
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2 p-4">
      {CATEGORY_TYPES.map((type) => {
        const label = t.categories[type];
        const selected = selections[type];
        const options = (componentsByType[type] ?? []).filter((c) => isCompatible(type, c, selections));
        const isOpen = openCategory === type;

        return (
          <div key={type} className="rounded-lg border border-black/10 dark:border-white/15">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 p-3 text-left"
              onClick={() => setOpenCategory(isOpen ? null : type)}
            >
              <div>
                <div className="text-sm text-zinc-500">{label}</div>
                {selected ? (
                  <div className="font-medium">{selected.brand} {selected.name}</div>
                ) : (
                  <div className="text-zinc-400">{t.configurator.notSelected}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selected && (
                  <span className="text-sm">{formatPrice(Number(selected.price), selected.currency, locale)}</span>
                )}
                <span className="text-zinc-400">{isOpen ? "▲" : "▼"}</span>
              </div>
            </button>

            {isOpen && (
              <div className="flex flex-col gap-1 border-t border-black/10 p-2 dark:border-white/15">
                {selected && (
                  <button
                    type="button"
                    className="rounded p-2 text-left text-sm text-red-500 hover:bg-black/5 dark:hover:bg-white/5"
                    onClick={() => deselectComponent(type)}
                  >
                    {t.configurator.removeSelection}
                  </button>
                )}
                {options.length === 0 && (
                  <p className="p-2 text-sm text-zinc-400">{t.configurator.noCompatibleOptions}</p>
                )}
                {options.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`flex items-center justify-between gap-2 rounded p-2 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5 ${
                      selected?.id === c.id ? "bg-black/5 dark:bg-white/10" : ""
                    }`}
                    onClick={() => selectComponent(type, c)}
                  >
                    <span>
                      {c.brand} {c.name}
                      {specSummary(c, t) && <span className="text-zinc-400"> · {specSummary(c, t)}</span>}
                    </span>
                    <span className="whitespace-nowrap">{formatPrice(Number(c.price), c.currency, locale)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/15">
        <span className="text-lg font-semibold">{t.common.total}</span>
        <span className="text-lg font-semibold">{formatPrice(totalPrice, "UZS", locale)}</span>
      </div>

      {auth.status === "authenticated" ? (
        <button
          type="button"
          disabled={totalPrice === 0 || saveState.status === "saving"}
          onClick={handleSave}
          className="mt-2 rounded-full bg-foreground px-5 py-3 text-background disabled:opacity-40"
        >
          {saveState.status === "saving" ? t.configurator.saving : t.configurator.save}
        </button>
      ) : (
        <p className="mt-2 text-center text-sm text-zinc-400">{t.configurator.openInTelegram}</p>
      )}

      {saveState.status === "saved" && (
        <p className="text-center text-sm text-green-600">
          {t.configurator.saved} —{" "}
          <Link href={`/builds/${saveState.buildId}`} className="underline">
            {t.configurator.open}
          </Link>
        </p>
      )}
      {saveState.status === "error" && (
        <p className="text-center text-sm text-red-500">{t.configurator.saveErrorFallback}</p>
      )}
    </div>
  );
}
