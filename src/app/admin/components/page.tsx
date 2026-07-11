"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Upload } from "lucide-react";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { deleteComponent, getAdminComponents } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { COMPONENT_TYPES, type Component, type ComponentType } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/icons";
import { BackButton } from "@/components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type State = { status: "loading" } | { status: "error" } | { status: "ready"; items: Component[] };

export default function AdminComponentsPage() {
  const auth = useAuth();
  const { locale, t } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ComponentType | "ALL">("ALL");

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    getAdminComponents(auth.accessToken)
      .then((items) => setState({ status: "ready", items }))
      .catch(() => setState({ status: "error" }));
  }, [auth]);

  const groups = useMemo(() => {
    if (state.status !== "ready") return [];
    const query = search.trim().toLowerCase();
    const filtered = state.items.filter((item) => {
      if (categoryFilter !== "ALL" && item.type !== categoryFilter) return false;
      if (!query) return true;
      return `${item.brand} ${item.name}`.toLowerCase().includes(query);
    });
    const byType = new Map<ComponentType, Component[]>();
    for (const item of filtered) {
      byType.set(item.type, [...(byType.get(item.type) ?? []), item]);
    }
    return COMPONENT_TYPES.map((type) => ({ type, items: byType.get(type) ?? [] })).filter(
      (group) => group.items.length > 0,
    );
  }, [state, search, categoryFilter]);

  async function handleDelete(id: number) {
    if (auth.status !== "authenticated") return;
    if (!window.confirm(t.admin.deleteConfirm)) return;

    setDeletingId(id);
    try {
      await deleteComponent(id, auth.accessToken);
      setState((prev) =>
        prev.status === "ready" ? { status: "ready", items: prev.items.filter((c) => c.id !== id) } : prev,
      );
    } catch {
      window.alert(t.admin.deleteErrorFallback);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <BackButton fallbackHref="/admin" />

      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">{t.admin.componentsTitle}</h1>
        <div className="flex shrink-0 gap-2">
          <Button render={<Link href="/admin/components/bulk-import" />} nativeButton={false} size="sm" variant="outline">
            <Upload className="size-4" />
            {t.admin.bulkImportButton}
          </Button>
          <Button render={<Link href="/admin/components/new" />} nativeButton={false} size="sm">
            {t.admin.addComponent}
          </Button>
        </div>
      </div>

      {state.status === "loading" && (
        <p className="p-4 text-center text-muted-foreground">{t.admin.loading}</p>
      )}
      {state.status === "error" && (
        <p className="p-4 text-center text-destructive">{t.admin.loadErrorFallback}</p>
      )}
      {state.status === "ready" && state.items.length === 0 && (
        <p className="p-4 text-center text-muted-foreground">{t.admin.emptyComponents}</p>
      )}

      {state.status === "ready" && state.items.length > 0 && (
        <>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.catalog.searchPlaceholder}
              className="pl-8"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              type="button"
              size="sm"
              variant={categoryFilter === "ALL" ? "default" : "outline"}
              className="shrink-0"
              onClick={() => setCategoryFilter("ALL")}
            >
              {t.admin.allCategories}
            </Button>
            {COMPONENT_TYPES.map((type) => {
              const Icon = CATEGORY_ICONS[type];
              return (
                <Button
                  key={type}
                  type="button"
                  size="sm"
                  variant={categoryFilter === type ? "default" : "outline"}
                  className="shrink-0"
                  onClick={() => setCategoryFilter(type)}
                >
                  <Icon className="size-4" />
                  {t.categories[type]}
                </Button>
              );
            })}
          </div>

          {groups.length === 0 && (
            <p className="p-4 text-center text-muted-foreground">{t.catalog.noResults}</p>
          )}

          <div className="flex flex-col gap-4">
            {groups.map((group) => {
              const Icon = CATEGORY_ICONS[group.type];
              return (
                <div key={group.type} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Icon className="size-4" />
                    {t.categories[group.type]}
                    <span className="text-xs">({group.items.length})</span>
                  </div>
                  {group.items.map((item) => (
                    <Card key={item.id} size="sm">
                      <CardContent className="flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            {!item.isActive && <Badge variant="outline">{t.admin.inactiveBadge}</Badge>}
                          </div>
                          <div className="font-medium">
                            {item.brand} {item.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(Number(item.price), item.currency, locale)} · {t.admin.form.stockLabel}:{" "}
                            {item.stock}
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col gap-1">
                          <Button
                            render={<Link href={`/admin/components/${item.id}`} />}
                            nativeButton={false}
                            variant="outline"
                            size="sm"
                          >
                            {t.admin.editComponent}
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === item.id}
                            onClick={() => handleDelete(item.id)}
                          >
                            {deletingId === item.id ? t.admin.deleting : t.admin.deleteAction}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
