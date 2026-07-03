"use client";

import { useEffect, useRef } from "react";
import { trackReferral } from "@/lib/api";
import { useAuth } from "@/components/telegram-provider";

const START_PARAM_KEY = "startapp";

export function ReferralTracker() {
  const auth = useAuth();
  const attempted = useRef(false);

  useEffect(() => {
    if (auth.status !== "authenticated" || attempted.current) return;

    const url = new URL(window.location.href);
    const buildId = url.searchParams.get(START_PARAM_KEY);
    if (!buildId) return;

    attempted.current = true;

    trackReferral(buildId, auth.accessToken)
      .catch(() => {
        // Ожидаемо: собственная ссылка, уже засчитанный реферал, приватная/несуществующая сборка.
      })
      .finally(() => {
        url.searchParams.delete(START_PARAM_KEY);
        window.history.replaceState({}, "", url.toString());
      });
  }, [auth]);

  return null;
}
