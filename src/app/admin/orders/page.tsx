"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { getAdminOrders, updateOrderStatus } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { BackButton } from "@/components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type State = { status: "loading" } | { status: "error" } | { status: "ready"; orders: Order[] };

const STATUS_BADGE_VARIANT: Record<OrderStatus, "default" | "secondary" | "outline"> = {
  PENDING: "default",
  COMPLETED: "secondary",
  CANCELLED: "outline",
};

export default function AdminOrdersPage() {
  const auth = useAuth();
  const { locale, t } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    getAdminOrders(auth.accessToken)
      .then((orders) => setState({ status: "ready", orders }))
      .catch(() => setState({ status: "error" }));
  }, [auth]);

  async function handleStatusChange(id: number, status: OrderStatus) {
    if (auth.status !== "authenticated") return;
    setUpdatingId(id);
    try {
      const updated = await updateOrderStatus(id, status, auth.accessToken);
      setState((prev) =>
        prev.status === "ready"
          ? { status: "ready", orders: prev.orders.map((o) => (o.id === id ? updated : o)) }
          : prev,
      );
    } catch {
      window.alert(t.admin.orders.updateErrorFallback);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <BackButton fallbackHref="/admin" />
      <h1 className="text-xl font-semibold">{t.admin.orders.title}</h1>

      {state.status === "loading" && (
        <p className="p-4 text-center text-muted-foreground">{t.admin.orders.loading}</p>
      )}
      {state.status === "error" && (
        <p className="p-4 text-center text-destructive">{t.admin.orders.loadErrorFallback}</p>
      )}
      {state.status === "ready" && state.orders.length === 0 && (
        <p className="p-4 text-center text-muted-foreground">{t.admin.orders.empty}</p>
      )}

      {state.status === "ready" && state.orders.length > 0 && (
        <div className="flex flex-col gap-2">
          {state.orders.map((order) => {
            const totalPrice = Number(order.totalPrice);
            const discountedTotal =
              order.discountPercent > 0 ? Math.round(totalPrice * (1 - order.discountPercent / 100)) : totalPrice;
            const buyerName =
              [order.buyer.firstName, order.buyer.lastName].filter(Boolean).join(" ") ||
              order.buyer.username ||
              `ID ${order.buyer.telegramId}`;

            return (
              <Card key={order.id} size="sm">
                <CardContent className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{order.buildName}</div>
                      <div className="text-sm text-muted-foreground">
                        {t.admin.orders.itemsCount(order.itemsSnapshot.length)}
                      </div>
                    </div>
                    <Badge variant={STATUS_BADGE_VARIANT[order.status]}>{t.admin.orders.status[order.status]}</Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {t.admin.orders.buyerLabel}: {buyerName}
                    {order.buyer.username && ` (@${order.buyer.username})`}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium">
                    {formatPrice(discountedTotal, order.currency, locale)}
                    {order.discountPercent > 0 && (
                      <span className="text-xs font-normal text-muted-foreground">
                        {t.admin.orders.discountNote(order.discountPercent)}
                      </span>
                    )}
                  </div>

                  {order.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={updatingId === order.id}
                        onClick={() => handleStatusChange(order.id, "COMPLETED")}
                      >
                        {updatingId === order.id ? t.admin.orders.updating : t.admin.orders.markCompleted}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={updatingId === order.id}
                        onClick={() => handleStatusChange(order.id, "CANCELLED")}
                      >
                        {t.admin.orders.markCancelled}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
