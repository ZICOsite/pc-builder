"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ApiError, getBuild, getReferralLink, orderBuild, shareBuild } from "@/lib/api";
import { formatPrice, specSummary } from "@/lib/format";
import { missingCoreTypes } from "@/lib/compatibility";
import type { Build } from "@/lib/types";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type State =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "forbidden" }
  | { status: "error" }
  | { status: "ready"; build: Build };

export default function BuildPage() {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const { locale, t } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });
  const [shareState, setShareState] = useState<"idle" | "sharing" | "copied" | "error">("idle");
  const [orderState, setOrderState] = useState<"idle" | "ordering" | "ordered" | "error">("idle");

  useEffect(() => {
    const accessToken = auth.status === "authenticated" ? auth.accessToken : undefined;
    getBuild(id, accessToken)
      .then((build) => setState({ status: "ready", build }))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setState({ status: "not-found" });
        else if (err instanceof ApiError && err.status === 403) setState({ status: "forbidden" });
        else setState({ status: "error" });
      });
  }, [id, auth]);

  async function handleShare() {
    if (auth.status !== "authenticated" || state.status !== "ready") return;
    setShareState("sharing");
    try {
      const build = state.build.isPublic ? state.build : await shareBuild(state.build.id, auth.accessToken);
      setState({ status: "ready", build });
      await navigator.clipboard.writeText(getReferralLink(build.id));
      setShareState("copied");
    } catch {
      setShareState("error");
    }
  }

  async function handleOrder() {
    if (auth.status !== "authenticated" || state.status !== "ready") return;
    setOrderState("ordering");
    try {
      await orderBuild(state.build.id, auth.accessToken);
      setOrderState("ordered");
    } catch {
      setOrderState("error");
    }
  }

  if (state.status === "loading") {
    return <p className="p-4 text-center text-muted-foreground">{t.buildPage.loadingBuild}</p>;
  }

  if (state.status === "not-found") {
    return <p className="p-4 text-center text-destructive">{t.buildPage.notFound}</p>;
  }

  if (state.status === "forbidden") {
    return <p className="p-4 text-center text-destructive">{t.buildPage.forbidden}</p>;
  }

  if (state.status === "error") {
    return <p className="p-4 text-center text-destructive">{t.buildPage.loadErrorFallback}</p>;
  }

  const { build } = state;
  const isOwner = auth.status === "authenticated" && auth.userId === build.userId;
  const totalPrice = build.totalPrice ? Number(build.totalPrice) : 0;
  const discountPercent = isOwner ? (build.user?.discountPercent ?? 0) : 0;
  const discountedTotal = discountPercent > 0 ? Math.round(totalPrice * (1 - discountPercent / 100)) : totalPrice;
  const missing = missingCoreTypes(build.items);
  const isComplete = missing.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <BackButton fallbackHref="/" />
      <h1 className="text-xl font-semibold">{build.name}</h1>

      <div className="flex flex-col gap-2">
        {build.items.map((item) => (
          <Card key={item.id} size="sm">
            <CardContent className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm text-muted-foreground">
                  {item.component.brand} {item.component.name}
                </div>
                {specSummary(item.component, t) && (
                  <div className="text-sm text-muted-foreground">{specSummary(item.component, t)}</div>
                )}
              </div>
              <span className="shrink-0 whitespace-nowrap text-sm">
                {formatPrice(Number(item.component.price) * item.quantity, item.component.currency, locale)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex items-center justify-between">
          <span className="text-lg font-semibold">{t.common.total}</span>
          <div className="flex flex-col items-end">
            {discountPercent > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(totalPrice, "UZS", locale)}
              </span>
            )}
            <span className="text-lg font-semibold">{formatPrice(discountedTotal, "UZS", locale)}</span>
            {discountPercent > 0 && (
              <span className="text-xs text-success">{t.buildPage.discountApplied(discountPercent)}</span>
            )}
          </div>
        </CardContent>
        {isOwner && (
          <CardFooter className="flex-col items-stretch gap-2 border-t-0 bg-transparent pt-0">
            <Button
              type="button"
              size="lg"
              disabled={orderState === "ordering"}
              onClick={handleOrder}
              className="w-full"
            >
              {orderState === "ordering"
                ? t.buildPage.ordering
                : orderState === "ordered"
                  ? t.buildPage.ordered
                  : t.buildPage.placeOrder}
            </Button>
            {orderState === "error" && (
              <p className="text-center text-sm text-destructive">{t.buildPage.orderError}</p>
            )}
          </CardFooter>
        )}
        {isOwner && isComplete && (
          <CardFooter className="flex-col items-stretch gap-2 border-t-0 bg-transparent pt-0">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={shareState === "sharing"}
              onClick={handleShare}
              className="w-full"
            >
              {shareState === "sharing"
                ? t.buildPage.publishing
                : shareState === "copied"
                  ? t.buildPage.linkCopied
                  : build.isPublic
                    ? t.buildPage.copyLink
                    : t.buildPage.share}
            </Button>
            {shareState === "error" && (
              <p className="text-center text-sm text-destructive">{t.buildPage.copyError}</p>
            )}
          </CardFooter>
        )}
        {isOwner && !isComplete && (
          <CardFooter className="border-t-0 bg-transparent pt-0">
            <p className="text-center text-sm text-muted-foreground">
              {t.buildPage.incompleteBuild(missing.map((type) => t.categories[type]).join(", "))}
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
