"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getComponents, saveBuild } from "@/lib/api";
import { isCompatible, type Selections } from "@/lib/compatibility";
import { formatPrice, specSummary } from "@/lib/format";
import { cn } from "@/lib/utils";
import { COMPONENT_TYPES, type Component, type ComponentType } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/icons";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
    Promise.all(COMPONENT_TYPES.map((type) => getComponents(type).then((list) => [type, list] as const)))
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
  const selectedCount = Object.keys(selections).length;
  const progressPercent = Math.round((selectedCount / COMPONENT_TYPES.length) * 100);

  function selectComponent(type: ComponentType, component: Component) {
    const next = pruneIncompatible({ ...selections, [type]: component });
    setSelections(next);
    setOpenCategory(COMPONENT_TYPES.find((t) => t !== type && !next[t]) ?? null);
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
    return <p className="p-4 text-center text-muted-foreground">{t.configurator.loading}</p>;
  }

  if (loadError) {
    return <p className="p-4 text-center text-destructive">{t.configurator.loadErrorFallback}</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <Card size="sm">
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            {progressPercent === 100 ? (
              <span className="flex items-center gap-1.5 font-medium text-success">
                <CheckCircle2 className="size-4" />
                {t.configurator.allSelected}
              </span>
            ) : (
              <span className="font-medium text-muted-foreground">
                {t.configurator.progressLabel(selectedCount, COMPONENT_TYPES.length)}
              </span>
            )}
            <span className="font-semibold text-primary">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardContent className="px-4 py-0">
          <Accordion
            value={openCategory ? [openCategory] : []}
            onValueChange={(value) => setOpenCategory((value[0] as ComponentType | undefined) ?? null)}
          >
            {COMPONENT_TYPES.map((type) => {
              const label = t.categories[type];
              const selected = selections[type];
              const options = (componentsByType[type] ?? []).filter((c) => isCompatible(type, c, selections));
              const Icon = CATEGORY_ICONS[type];

              return (
                <AccordionItem key={type} value={type}>
                  <AccordionTrigger>
                    <div className="flex w-full items-center gap-3 pr-2">
                      <Icon
                        className={cn(
                          "size-5 shrink-0 transition-colors",
                          selected ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          {label}
                        </div>
                        {selected ? (
                          <div className="truncate font-semibold">
                            {selected.brand} {selected.name}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">{t.configurator.notSelected}</div>
                        )}
                      </div>
                      {selected && (
                        <div className="flex shrink-0 items-center gap-1.5">
                          <CheckCircle2 className="size-4 text-success" />
                          <Badge variant="secondary" className="shrink-0">
                            {formatPrice(Number(selected.price), selected.currency, locale)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="flex flex-col gap-1">
                      {selected && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="justify-start"
                          onClick={() => deselectComponent(type)}
                        >
                          {t.configurator.removeSelection}
                        </Button>
                      )}
                      {options.length === 0 && (
                        <p className="p-2 text-sm text-muted-foreground">{t.configurator.noCompatibleOptions}</p>
                      )}
                      {options.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-lg p-2 text-left text-sm transition-colors hover:bg-muted",
                            selected?.id === c.id && "bg-accent text-accent-foreground",
                          )}
                          onClick={() => selectComponent(type, c)}
                        >
                          <span>
                            {c.brand} {c.name}
                            {specSummary(c, t) && (
                              <span className="text-muted-foreground"> · {specSummary(c, t)}</span>
                            )}
                          </span>
                          <span className="shrink-0 whitespace-nowrap">
                            {formatPrice(Number(c.price), c.currency, locale)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between">
          <span className="text-lg font-semibold">{t.common.total}</span>
          <span key={totalPrice} className="animate-in fade-in-0 zoom-in-95 text-lg font-semibold duration-300">
            {formatPrice(totalPrice, "UZS", locale)}
          </span>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-2 border-t-0 bg-transparent pt-0">
          {auth.status === "authenticated" ? (
            <Button
              type="button"
              size="lg"
              disabled={totalPrice === 0 || saveState.status === "saving"}
              onClick={handleSave}
              className="w-full"
            >
              {saveState.status === "saving" ? t.configurator.saving : t.configurator.save}
            </Button>
          ) : (
            <p className="text-center text-sm text-muted-foreground">{t.configurator.openInTelegram}</p>
          )}

          {saveState.status === "saved" && (
            <p className="text-center text-sm text-success">
              {t.configurator.saved} —{" "}
              <Link href={`/builds/${saveState.buildId}`} className="underline">
                {t.configurator.open}
              </Link>
            </p>
          )}
          {saveState.status === "error" && (
            <p className="text-center text-sm text-destructive">{t.configurator.saveErrorFallback}</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
