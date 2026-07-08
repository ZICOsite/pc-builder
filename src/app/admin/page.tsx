"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { getAdminDashboard } from "@/lib/api";
import type { AdminDashboard } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type State = { status: "loading" } | { status: "error" } | { status: "ready"; data: AdminDashboard };

export default function AdminDashboardPage() {
  const auth = useAuth();
  const { t } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    getAdminDashboard(auth.accessToken)
      .then((data) => setState({ status: "ready", data }))
      .catch(() => setState({ status: "error" }));
  }, [auth]);

  return (
    <>
      <h1 className="text-xl font-semibold">{t.admin.dashboardTitle}</h1>

      {state.status === "loading" && (
        <p className="p-4 text-center text-muted-foreground">{t.admin.loading}</p>
      )}
      {state.status === "error" && (
        <p className="p-4 text-center text-destructive">{t.admin.loadErrorFallback}</p>
      )}

      {state.status === "ready" && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Card size="sm">
              <CardContent className="flex flex-col items-center gap-1 text-center">
                <span className="text-2xl font-semibold">{state.data.totalComponents}</span>
                <span className="text-xs text-muted-foreground">{t.admin.totalComponents}</span>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardContent className="flex flex-col items-center gap-1 text-center">
                <span className="text-2xl font-semibold">{state.data.totalUsers}</span>
                <span className="text-xs text-muted-foreground">{t.admin.totalUsers}</span>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardContent className="flex flex-col items-center gap-1 text-center">
                <span className="text-2xl font-semibold">{state.data.totalBuilds}</span>
                <span className="text-xs text-muted-foreground">{t.admin.totalBuilds}</span>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardContent className="flex flex-col items-center gap-1 text-center">
                <span className="text-2xl font-semibold">{state.data.pendingOrders}</span>
                <span className="text-xs text-muted-foreground">{t.admin.totalPendingOrders}</span>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent>
              <div className="mb-2 text-sm font-medium text-muted-foreground">{t.admin.lowStockTitle}</div>
              {state.data.lowStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.admin.noLowStock}</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {state.data.lowStock.map((item) => {
                    const Icon = CATEGORY_ICONS[item.type];
                    const criticalThreshold = Math.max(1, Math.floor(state.data.lowStockThreshold / 3));
                    const isCritical = item.stock <= criticalThreshold;
                    return (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Icon className={isCritical ? "size-4 text-destructive" : "size-4 text-warning"} />
                          {item.name}
                        </span>
                        <span className={isCritical ? "text-destructive" : "text-warning"}>{item.stock}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex flex-col gap-2">
        <Button render={<Link href="/admin/components" />} nativeButton={false} size="lg" className="w-full">
          {t.admin.manageComponents}
        </Button>
        <Button
          render={<Link href="/admin/orders" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="w-full"
        >
          {t.admin.manageOrders}
          {state.status === "ready" && state.data.pendingOrders > 0 && (
            <Badge variant="destructive" className="ml-1">
              {state.data.pendingOrders}
            </Badge>
          )}
        </Button>
        <Button
          render={<Link href="/admin/settings" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="w-full"
        >
          {t.admin.manageSettings}
        </Button>
      </div>
    </>
  );
}
