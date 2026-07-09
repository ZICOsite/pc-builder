"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { getAdminStats } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { AdminStatsPoint, StatsRangeDays } from "@/lib/types";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

type State = { status: "loading" } | { status: "error" } | { status: "ready"; points: AdminStatsPoint[] };

const RANGES: StatsRangeDays[] = [7, 30, 90];

export default function AdminStatsPage() {
  const auth = useAuth();
  const { locale, t } = useLocale();
  const [range, setRange] = useState<StatsRangeDays>(30);
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    setState({ status: "loading" });
    getAdminStats(range, auth.accessToken)
      .then((points) => setState({ status: "ready", points }))
      .catch(() => setState({ status: "error" }));
  }, [auth, range]);

  function formatTick(date: string) {
    return new Date(date).toLocaleDateString(locale, { day: "numeric", month: "short" });
  }

  const revenueConfig: ChartConfig = { revenue: { label: t.admin.stats.revenueTitle, color: "var(--chart-1)" } };
  const ordersConfig: ChartConfig = { orders: { label: t.admin.stats.ordersTitle, color: "var(--chart-2)" } };
  const usersConfig: ChartConfig = { newUsers: { label: t.admin.stats.newUsersTitle, color: "var(--chart-3)" } };

  const tickInterval = state.status === "ready" ? Math.max(0, Math.ceil(state.points.length / 7) - 1) : 0;

  return (
    <>
      <BackButton fallbackHref="/admin" />
      <h1 className="text-xl font-semibold">{t.admin.stats.title}</h1>

      <div className="flex gap-2">
        {RANGES.map((r) => (
          <Button
            key={r}
            type="button"
            size="sm"
            variant={range === r ? "default" : "outline"}
            onClick={() => setRange(r)}
          >
            {t.admin.stats.rangeLabel[r]}
          </Button>
        ))}
      </div>

      {state.status === "loading" && (
        <p className="p-4 text-center text-muted-foreground">{t.admin.stats.loading}</p>
      )}
      {state.status === "error" && (
        <p className="p-4 text-center text-destructive">{t.admin.stats.loadErrorFallback}</p>
      )}

      {state.status === "ready" && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.admin.stats.revenueTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueConfig} className="aspect-auto h-48 w-full">
                <AreaChart data={state.points} margin={{ left: 20, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={tickInterval}
                    tickFormatter={formatTick}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => formatTick(String(value))}
                        formatter={(value) => formatPrice(Number(value), "UZS", locale)}
                      />
                    }
                  />
                  <Area
                    dataKey="revenue"
                    type="monotone"
                    fill="var(--color-revenue)"
                    fillOpacity={0.2}
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.admin.stats.ordersTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={ordersConfig} className="aspect-auto h-48 w-full">
                <BarChart data={state.points} margin={{ left: 20, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={tickInterval}
                    tickFormatter={formatTick}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent labelFormatter={(value) => formatTick(String(value))} />}
                  />
                  <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.admin.stats.newUsersTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={usersConfig} className="aspect-auto h-48 w-full">
                <BarChart data={state.points} margin={{ left: 20, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={tickInterval}
                    tickFormatter={formatTick}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent labelFormatter={(value) => formatTick(String(value))} />}
                  />
                  <Bar dataKey="newUsers" fill="var(--color-newUsers)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
