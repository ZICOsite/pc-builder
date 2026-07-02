"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { getProfile, getReferralStats } from "@/lib/api";
import type { ReferralStats, UserProfile } from "@/lib/types";

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
    return <p className="p-4 text-center">{t.profile.loading}</p>;
  }

  if (auth.status !== "authenticated") {
    return <p className="p-4 text-center text-zinc-400">{t.profile.openInTelegram}</p>;
  }

  if (state.status === "loading") {
    return <p className="p-4 text-center">{t.profile.loadingProfile}</p>;
  }

  if (state.status === "error") {
    return <p className="p-4 text-center text-red-500">{t.profile.loadErrorFallback}</p>;
  }

  const { profile, stats } = state;
  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.username || t.profile.noName;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 p-4">
      <Link href="/" className="text-sm text-zinc-400 underline">
        {t.common.backToConfigurator}
      </Link>

      <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
        <div className="text-lg font-semibold">{displayName}</div>
        {profile.username && <div className="text-sm text-zinc-400">@{profile.username}</div>}
      </div>

      <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
        <div className="text-sm text-zinc-500">{t.profile.discountTitle}</div>
        <div className="text-2xl font-semibold">{stats.discountPercent}%</div>
        <div className="text-sm text-zinc-400">
          {t.profile.referralsProgress(stats.completedReferrals, stats.remainingSlots)}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-zinc-500">{t.profile.invitedTitle}</div>
        {stats.referrals.length === 0 && (
          <p className="text-sm text-zinc-400">{t.profile.noReferralsYet}</p>
        )}
        {stats.referrals.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-black/10 p-3 text-sm dark:border-white/15"
          >
            <div>
              <div>{r.referredUser.firstName || r.referredUser.username || t.profile.unknownUser(r.referredUserId)}</div>
              <div className="text-zinc-400">{t.profile.viaBuild(r.build.name)}</div>
            </div>
            <span className="whitespace-nowrap text-zinc-400">{t.profile.status[r.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
