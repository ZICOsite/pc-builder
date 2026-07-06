"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { getProfile, getReferralStats } from "@/lib/api";
import type { ReferralStats, UserProfile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; profile: UserProfile; stats: ReferralStats };

export default function ProfilePage() {
  const auth = useAuth();
  const { t } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    Promise.all([getProfile(auth.accessToken), getReferralStats(auth.accessToken)])
      .then(([profile, stats]) => setState({ status: "ready", profile, stats }))
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

  const { profile, stats } = state;
  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.username || t.profile.noName;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <Link href="/" className="text-sm text-muted-foreground underline">
        {t.common.backToConfigurator}
      </Link>

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
