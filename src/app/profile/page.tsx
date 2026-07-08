"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { deleteBuild, getMyBuilds, getProfile, getReferralStats } from "@/lib/api";
import type { Build, ReferralStats, UserProfile } from "@/lib/types";
import { BackButton } from "@/components/back-button";
import { SwipeableBuildRow } from "@/components/swipeable-build-row";
import { Card, CardContent } from "@/components/ui/card";

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

  async function handleDeleteBuild(buildId: string) {
    if (auth.status !== "authenticated") return;
    setState({ status: "ready", profile, stats, builds: builds.filter((b) => b.id !== buildId) });
    try {
      await deleteBuild(buildId, auth.accessToken);
    } catch {
      setState({ status: "ready", profile, stats, builds });
      window.alert(t.profile.deleteErrorFallback);
    }
  }

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
            <SwipeableBuildRow
              key={build.id}
              build={build}
              totalPrice={totalPrice}
              discountedTotal={discountedTotal}
              discountPercent={stats.discountPercent}
              locale={locale}
              itemsLabel={t.profile.itemsCount(build.items.length)}
              publicLabel={t.profile.publicBadge}
              privateLabel={t.profile.privateBadge}
              deleteLabel={t.profile.deleteBuild}
              onDelete={handleDeleteBuild}
            />
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
