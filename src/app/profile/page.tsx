"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/telegram-provider";
import { getProfile, getReferralStats } from "@/lib/api";
import type { ReferralStats, UserProfile } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Ожидание",
  COMPLETED: "Начислено",
  CANCELLED: "Отменено",
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; profile: UserProfile; stats: ReferralStats };

export default function ProfilePage() {
  const auth = useAuth();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    Promise.all([getProfile(auth.accessToken), getReferralStats(auth.accessToken)])
      .then(([profile, stats]) => setState({ status: "ready", profile, stats }))
      .catch((err) => {
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "Ошибка загрузки профиля",
        });
      });
  }, [auth]);

  if (auth.status === "loading") {
    return <p className="p-4 text-center">Загрузка...</p>;
  }

  if (auth.status !== "authenticated") {
    return (
      <p className="p-4 text-center text-zinc-400">
        Откройте приложение через Telegram, чтобы увидеть профиль
      </p>
    );
  }

  if (state.status === "loading") {
    return <p className="p-4 text-center">Загрузка профиля...</p>;
  }

  if (state.status === "error") {
    return <p className="p-4 text-center text-red-500">{state.message}</p>;
  }

  const { profile, stats } = state;
  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.username || "Без имени";

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 p-4">
      <Link href="/" className="text-sm text-zinc-400 underline">
        ← К конфигуратору
      </Link>

      <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
        <div className="text-lg font-semibold">{displayName}</div>
        {profile.username && <div className="text-sm text-zinc-400">@{profile.username}</div>}
      </div>

      <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
        <div className="text-sm text-zinc-500">Скидка за рефералов</div>
        <div className="text-2xl font-semibold">{stats.discountPercent}%</div>
        <div className="text-sm text-zinc-400">
          {stats.completedReferrals} из 7 приглашённых · осталось мест: {stats.remainingSlots}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-zinc-500">Приглашённые пользователи</div>
        {stats.referrals.length === 0 && (
          <p className="text-sm text-zinc-400">
            Пока никого — поделитесь ссылкой на свою сборку, чтобы пригласить друзей
          </p>
        )}
        {stats.referrals.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-black/10 p-3 text-sm dark:border-white/15"
          >
            <div>
              <div>{r.referredUser.firstName || r.referredUser.username || `Пользователь #${r.referredUserId}`}</div>
              <div className="text-zinc-400">через сборку «{r.build.name}»</div>
            </div>
            <span className="whitespace-nowrap text-zinc-400">{STATUS_LABELS[r.status] ?? r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
