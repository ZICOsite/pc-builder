"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { deleteComponent, getAdminComponents } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { Component } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type State = { status: "loading" } | { status: "error" } | { status: "ready"; items: Component[] };

export default function AdminComponentsPage() {
  const auth = useAuth();
  const { locale, t } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    getAdminComponents(auth.accessToken)
      .then((items) => setState({ status: "ready", items }))
      .catch(() => setState({ status: "error" }));
  }, [auth]);

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
      <Link href="/admin" className="text-sm text-muted-foreground underline">
        {t.admin.backToDashboard}
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.admin.componentsTitle}</h1>
        <Button render={<Link href="/admin/components/new" />} nativeButton={false} size="sm">
          {t.admin.addComponent}
        </Button>
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

      {state.status === "ready" && (
        <div className="flex flex-col gap-2">
          {state.items.map((item) => (
            <Card key={item.id} size="sm">
              <CardContent className="flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {t.categories[item.type]}
                    </span>
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
      )}
    </>
  );
}
