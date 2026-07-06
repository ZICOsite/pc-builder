"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { formatPrice, specSummary } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Component, ComponentType } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 8;

type SortOrder = "asc" | "desc";

interface ComponentPickerDialogProps {
  type: ComponentType | null;
  options: Component[];
  selectedId?: number;
  onOpenChange: (open: boolean) => void;
  onSelect: (component: Component) => void;
}

export function ComponentPickerDialog({
  type,
  options,
  selectedId,
  onOpenChange,
  onSelect,
}: ComponentPickerDialogProps) {
  const { locale, t } = useLocale();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearch("");
    setSortOrder("asc");
    setPage(1);
  }, [type]);

  const filteredSorted = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? options.filter((c) => `${c.brand} ${c.name}`.toLowerCase().includes(query))
      : options;
    return [...filtered].sort((a, b) =>
      sortOrder === "asc" ? Number(a.price) - Number(b.price) : Number(b.price) - Number(a.price),
    );
  }, [options, search, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const page_ = Math.min(page, totalPages);
  const pageItems = filteredSorted.slice((page_ - 1) * PAGE_SIZE, page_ * PAGE_SIZE);

  return (
    <Dialog open={type !== null} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{type && t.categories[type]}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
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

        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {pageItems.length === 0 && (
            <p className="p-4 text-center text-sm text-muted-foreground">
              {options.length === 0 ? t.configurator.noCompatibleOptions : t.catalog.noResults}
            </p>
          )}
          {pageItems.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg p-2 text-left text-sm transition-colors hover:bg-muted",
                selectedId === c.id && "bg-accent text-accent-foreground",
              )}
            >
              <span>
                {c.brand} {c.name}
                {specSummary(c, t) && <span className="text-muted-foreground"> · {specSummary(c, t)}</span>}
              </span>
              <span className="shrink-0 whitespace-nowrap">{formatPrice(Number(c.price), c.currency, locale)}</span>
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-3">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={page_ <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft />
            </Button>
            <span className="text-sm text-muted-foreground">{t.configurator.pageOf(page_, totalPages)}</span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={page_ >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
