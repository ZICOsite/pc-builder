"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getComponentBrands, getComponentsPage } from "@/lib/api";
import { formatPrice, specSummary } from "@/lib/format";
import { COMPONENT_TYPES, type Component, type ComponentType } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/icons";
import { useLocale } from "@/components/locale-provider";
import { BackButton } from "@/components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "@/components/product-dialog";

const PAGE_SIZE = 30;
const SEARCH_DEBOUNCE_MS = 300;

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; items: Component[]; total: number };

type SortOrder = "asc" | "desc";

function isComponentType(value: string): value is ComponentType {
  return (COMPONENT_TYPES as string[]).includes(value);
}

export default function CatalogCategoryPage() {
  const { type } = useParams<{ type: string }>();
  const { locale, t } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });
  const [brands, setBrands] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [brandFilter, setBrandFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Component | null>(null);

  const componentType = isComponentType(type) ? type : null;

  useEffect(() => {
    if (!componentType) return;
    setSearch("");
    setDebouncedSearch("");
    setSortOrder("asc");
    setBrandFilter("ALL");
    setPage(1);
    getComponentBrands(componentType)
      .then(setBrands)
      .catch(() => setBrands([]));
  }, [componentType]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!componentType) return;
    setState({ status: "loading" });
    getComponentsPage(componentType, {
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      brand: brandFilter === "ALL" ? undefined : brandFilter,
      sortOrder,
    })
      .then(({ items, total }) => setState({ status: "ready", items, total }))
      .catch(() => setState({ status: "error" }));
  }, [componentType, page, debouncedSearch, brandFilter, sortOrder]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleBrandClick(brand: string) {
    setBrandFilter(brand);
    setPage(1);
  }

  function handleSortToggle() {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  }

  if (!componentType) {
    return <p className="p-4 text-center text-destructive">{t.catalog.notFound}</p>;
  }

  const Icon = CATEGORY_ICONS[componentType];
  const hasActiveFilters = debouncedSearch.trim().length > 0 || brandFilter !== "ALL";
  const totalPages = state.status === "ready" ? Math.max(1, Math.ceil(state.total / PAGE_SIZE)) : 1;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <BackButton fallbackHref="/" />

      <div className="flex items-center gap-2">
        <Icon className="size-6 text-primary" />
        <h1 className="text-xl font-semibold">{t.categories[componentType]}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t.catalog.searchPlaceholder}
            className="pl-8"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title={sortOrder === "asc" ? t.catalog.sortPriceAsc : t.catalog.sortPriceDesc}
          onClick={handleSortToggle}
        >
          {sortOrder === "asc" ? <ArrowUpNarrowWide /> : <ArrowDownWideNarrow />}
        </Button>
      </div>

      {brands.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            type="button"
            size="sm"
            variant={brandFilter === "ALL" ? "default" : "outline"}
            className="shrink-0"
            onClick={() => handleBrandClick("ALL")}
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
              onClick={() => handleBrandClick(brand)}
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
        <p className="p-4 text-center text-muted-foreground">
          {hasActiveFilters ? t.catalog.noResults : t.catalog.empty}
        </p>
      )}

      {state.status === "ready" && state.items.length > 0 && (
        <div className="flex flex-col gap-2">
          {state.items.map((item) => (
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

      {state.status === "ready" && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft />
          </Button>
          <span className="text-sm text-muted-foreground">{t.configurator.pageOf(page, totalPages)}</span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <ProductDialog component={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
