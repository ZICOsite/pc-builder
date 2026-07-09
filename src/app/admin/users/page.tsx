"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { getAdminUsers } from "@/lib/api";
import type { AdminUser } from "@/lib/types";
import { BackButton } from "@/components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type State = { status: "loading" } | { status: "error" } | { status: "ready"; users: AdminUser[] };

export default function AdminUsersPage() {
  const auth = useAuth();
  const { locale, t } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    getAdminUsers(auth.accessToken)
      .then((users) => setState({ status: "ready", users }))
      .catch(() => setState({ status: "error" }));
  }, [auth]);

  return (
    <>
      <BackButton fallbackHref="/admin" />
      <h1 className="text-xl font-semibold">{t.admin.users.title}</h1>

      {state.status === "loading" && (
        <p className="p-4 text-center text-muted-foreground">{t.admin.users.loading}</p>
      )}
      {state.status === "error" && (
        <p className="p-4 text-center text-destructive">{t.admin.users.loadErrorFallback}</p>
      )}
      {state.status === "ready" && state.users.length === 0 && (
        <p className="p-4 text-center text-muted-foreground">{t.admin.users.empty}</p>
      )}

      {state.status === "ready" && state.users.length > 0 && (
        <div className="flex flex-col gap-2">
          {state.users.map((user) => {
            const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || t.admin.users.unnamed;

            return (
              <Card key={user.id} size="sm">
                <CardContent className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.username ? `@${user.username}` : `ID ${user.telegramId}`}
                      </div>
                    </div>
                    {user.discountPercent > 0 && (
                      <Badge variant="secondary">
                        {t.admin.users.discountLabel} {user.discountPercent}%
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span>{t.admin.users.buildsLabel(user._count.builds)}</span>
                    <span>{t.admin.users.ordersLabel(user._count.orders)}</span>
                    <span>{t.admin.users.referralsLabel(user._count.referralsSent)}</span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {t.admin.users.joinedLabel}: {new Date(user.createdAt).toLocaleDateString(locale)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
