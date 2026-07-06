"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getComponents } from "@/lib/api";
import { formatPrice, specSummary } from "@/lib/format";
import { COMPONENT_TYPES, type Component, type ComponentType } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/icons";
import { useLocale } from "@/components/locale-provider";
import { Card, CardContent } from "@/components/ui/card";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; items: Component[] };

function isComponentType(value: string): value is ComponentType {
  return (COMPONENT_TYPES as string[]).includes(value);
}

export default function CatalogCategoryPage() {
  const { type } = useParams<{ type: string }>();
  const { locale, t } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });

  const componentType = isComponentType(type) ? type : null;

  useEffect(() => {
    if (!componentType) return;
    setState({ status: "loading" });
    getComponents(componentType)
      .then((items) => setState({ status: "ready", items }))
      .catch(() => setState({ status: "error" }));
  }, [componentType]);

  if (!componentType) {
    return <p className="p-4 text-center text-destructive">{t.catalog.notFound}</p>;
  }

  const Icon = CATEGORY_ICONS[componentType];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <Link href="/" className="text-sm text-muted-foreground underline">
        {t.catalog.backToCatalog}
      </Link>

      <div className="flex items-center gap-2">
        <Icon className="size-6 text-primary" />
        <h1 className="text-xl font-semibold">{t.categories[componentType]}</h1>
      </div>

      {state.status === "loading" && (
        <p className="p-4 text-center text-muted-foreground">{t.catalog.loading}</p>
      )}
      {state.status === "error" && (
        <p className="p-4 text-center text-destructive">{t.catalog.loadErrorFallback}</p>
      )}
      {state.status === "ready" && state.items.length === 0 && (
        <p className="p-4 text-center text-muted-foreground">{t.catalog.empty}</p>
      )}

      {state.status === "ready" && (
        <div className="flex flex-col gap-2">
          {state.items.map((item) => (
            <Card key={item.id} size="sm">
              <CardContent className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">
                    {item.brand} {item.name}
                  </div>
                  {specSummary(item, t) && (
                    <div className="text-sm text-muted-foreground">{specSummary(item, t)}</div>
                  )}
                </div>
                <span className="shrink-0 whitespace-nowrap text-sm font-medium">
                  {formatPrice(Number(item.price), item.currency, locale)}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
