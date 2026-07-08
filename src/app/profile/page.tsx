"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { getMyBuilds, getProfile, getReferralStats } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { Build, ReferralStats, UserProfile } from "@/lib/types";
import { BackButton } from "@/components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; profile: UserProfile; stats: ReferralStats; builds: Build[] };

export default function ProfilePage() {
  const auth = useAuth();
  const { locale, t } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    Promise.all([getProfile(auth.accessToken), getReferralStats(auth.accessToken), getMyBuilds(auth.accessToken)])
      .then(([profile, stats, builds]) => setState({ status: "ready", profile, stats, builds }))
      .catch(() => setState({ status: "error" }));
  }, [auth]);

  if (auth.status === "loading") {
    return <p className="p-4 text-center text-muted-foreground">{t.profile.loading}</p>;
  }

  if (auth.status !== "authenticated") {
    return <p className="p-4 text-center text-muted-foreground">{t.profile.openInTelegram}</p>;
  }

  if (state.status === "loading") {
    return <p className="p-4 text-center text-muted-foreground">{t.profile.loadingProfile}</p>;
  }

  if (state.status === "error") {
    return <p className="p-4 text-center text-destructive">{t.profile.loadErrorFallback}</p>;
  }

  const { profile, stats, builds } = state;
  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.username || t.profile.noName;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <BackButton fallbackHref="/" />

      <Card>
        <CardContent>
          <div className="text-lg font-semibold">{displayName}</div>
          {profile.username && <div className="text-sm text-muted-foreground">@{profile.username}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="text-sm text-muted-foreground">{t.profile.discountTitle}</div>
          <div className="text-2xl font-semibold">{stats.discountPercent}%</div>
          <div className="text-sm text-muted-foreground">
            {t.profile.referralsProgress(stats.completedReferrals, stats.remainingSlots)}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">{t.profile.myBuildsTitle}</div>
        {builds.length === 0 && <p className="text-sm text-muted-foreground">{t.profile.noBuilds}</p>}
        {builds.map((build) => {
          const totalPrice = Number(build.totalPrice);
          const discountedTotal =
            stats.discountPercent > 0 ? Math.round(totalPrice * (1 - stats.discountPercent / 100)) : totalPrice;
          return (
            <Link key={build.id} href={`/builds/${build.id}`}>
              <Card size="sm" className="transition-colors hover:bg-muted">
                <CardContent className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{build.name}</div>
                    <div className="text-sm text-muted-foreground">{t.profile.itemsCount(build.items.length)}</div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {stats.discountPercent > 0 && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(totalPrice, "UZS", locale)}
                      </span>
                    )}
                    <span className="text-sm font-medium">{formatPrice(discountedTotal, "UZS", locale)}</span>
                    <Badge variant={build.isPublic ? "secondary" : "outline"}>
                      {build.isPublic ? t.profile.publicBadge : t.profile.privateBadge}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">{t.profile.invitedTitle}</div>
        {stats.referrals.length === 0 && (
          <p className="text-sm text-muted-foreground">{t.profile.noReferralsYet}</p>
        )}
        {stats.referrals.map((r) => (
          <Card key={r.id} size="sm">
            <CardContent className="flex items-center justify-between gap-2">
              <div>
                <div>{r.referredUser.firstName || r.referredUser.username || t.profile.unknownUser(r.referredUserId)}</div>
                <div className="text-sm text-muted-foreground">{t.profile.viaBuild(r.build.name)}</div>
              </div>
              <span className="whitespace-nowrap text-sm text-muted-foreground">{t.profile.status[r.status]}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
