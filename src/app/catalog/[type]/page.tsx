"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search } from "lucide-react";
import { getComponents } from "@/lib/api";
import { formatPrice, specSummary } from "@/lib/format";
import { COMPONENT_TYPES, type Component, type ComponentType } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/icons";
import { useLocale } from "@/components/locale-provider";
import { BackButton } from "@/components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "@/components/product-dialog";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; items: Component[] };

type SortOrder = "asc" | "desc";

function isComponentType(value: string): value is ComponentType {
  return (COMPONENT_TYPES as string[]).includes(value);
}

export default function CatalogCategoryPage() {
  const { type } = useParams<{ type: string }>();
  const { locale, t } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [brandFilter, setBrandFilter] = useState<string>("ALL");
  const [selected, setSelected] = useState<Component | null>(null);

  const componentType = isComponentType(type) ? type : null;

  useEffect(() => {
    if (!componentType) return;
    setState({ status: "loading" });
    setSearch("");
    setBrandFilter("ALL");
    getComponents(componentType)
      .then((items) => setState({ status: "ready", items }))
      .catch(() => setState({ status: "error" }));
  }, [componentType]);

  const brands = useMemo(() => {
    if (state.status !== "ready") return [];
    return Array.from(new Set(state.items.map((item) => item.brand))).sort((a, b) => a.localeCompare(b));
  }, [state]);

  const visibleItems = useMemo(() => {
    if (state.status !== "ready") return [];
    const query = search.trim().toLowerCase();
    const filtered = state.items.filter((item) => {
      const matchesQuery = !query || `${item.brand} ${item.name}`.toLowerCase().includes(query);
      const matchesBrand = brandFilter === "ALL" || item.brand === brandFilter;
      return matchesQuery && matchesBrand;
    });
    return [...filtered].sort((a, b) =>
      sortOrder === "asc" ? Number(a.price) - Number(b.price) : Number(b.price) - Number(a.price),
    );
  }, [state, search, sortOrder, brandFilter]);

  if (!componentType) {
    return <p className="p-4 text-center text-destructive">{t.catalog.notFound}</p>;
  }

  const Icon = CATEGORY_ICONS[componentType];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <BackButton fallbackHref="/" />

      <div className="flex items-center gap-2">
        <Icon className="size-6 text-primary" />
        <h1 className="text-xl font-semibold">{t.categories[componentType]}</h1>
      </div>

      {state.status === "ready" && state.items.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.catalog.searchPlaceholder}
              className="pl-8"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            title={sortOrder === "asc" ? t.catalog.sortPriceAsc : t.catalog.sortPriceDesc}
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          >
            {sortOrder === "asc" ? <ArrowUpNarrowWide /> : <ArrowDownWideNarrow />}
          </Button>
        </div>
      )}

      {brands.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            type="button"
            size="sm"
            variant={brandFilter === "ALL" ? "default" : "outline"}
            className="shrink-0"
            onClick={() => setBrandFilter("ALL")}
          >
            {t.catalog.allBrands}
          </Button>
          {brands.map((brand) => (
            <Button
              key={brand}
              type="button"
              size="sm"
              variant={brandFilter === brand ? "default" : "outline"}
              className="shrink-0"
              onClick={() => setBrandFilter(brand)}
            >
              {brand}
            </Button>
          ))}
        </div>
      )}

      {state.status === "loading" && (
        <p className="p-4 text-center text-muted-foreground">{t.catalog.loading}</p>
      )}
      {state.status === "error" && (
        <p className="p-4 text-center text-destructive">{t.catalog.loadErrorFallback}</p>
      )}
      {state.status === "ready" && state.items.length === 0 && (
        <p className="p-4 text-center text-muted-foreground">{t.catalog.empty}</p>
      )}
      {state.status === "ready" && state.items.length > 0 && visibleItems.length === 0 && (
        <p className="p-4 text-center text-muted-foreground">{t.catalog.noResults}</p>
      )}

      {visibleItems.length > 0 && (
        <div className="flex flex-col gap-2">
          {visibleItems.map((item) => (
            <button key={item.id} type="button" className="text-left" onClick={() => setSelected(item)}>
              <Card size="sm" className="transition-colors hover:bg-muted">
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
            </button>
          ))}
        </div>
      )}

      <ProductDialog component={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
