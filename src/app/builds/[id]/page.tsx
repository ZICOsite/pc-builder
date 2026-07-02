"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ApiError, getBuild, shareBuild } from "@/lib/api";
import { formatPrice, specSummary } from "@/lib/format";
import type { Build } from "@/lib/types";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";

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
      await navigator.clipboard.writeText(window.location.href);
      setShareState("copied");
    } catch {
      setShareState("error");
    }
  }

  if (state.status === "loading") {
    return <p className="p-4 text-center">{t.buildPage.loadingBuild}</p>;
  }

  if (state.status === "not-found") {
    return <p className="p-4 text-center text-red-500">{t.buildPage.notFound}</p>;
  }

  if (state.status === "forbidden") {
    return <p className="p-4 text-center text-red-500">{t.buildPage.forbidden}</p>;
  }

  if (state.status === "error") {
    return <p className="p-4 text-center text-red-500">{t.buildPage.loadErrorFallback}</p>;
  }

  const { build } = state;
  const isOwner = auth.status === "authenticated" && auth.userId === build.userId;
  const totalPrice = build.totalPrice ? Number(build.totalPrice) : 0;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2 p-4">
      <Link href="/" className="text-sm text-zinc-400 underline">
        {t.common.backToConfigurator}
      </Link>
      <h1 className="text-xl font-semibold">{build.name}</h1>

      {build.items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-2 rounded-lg border border-black/10 p-3 dark:border-white/15"
        >
          <div>
            <div className="text-sm text-zinc-500">
              {item.component.brand} {item.component.name}
            </div>
            {specSummary(item.component, t) && (
              <div className="text-sm text-zinc-400">{specSummary(item.component, t)}</div>
            )}
          </div>
          <span className="whitespace-nowrap text-sm">
            {formatPrice(Number(item.component.price) * item.quantity, item.component.currency, locale)}
          </span>
        </div>
      ))}

      <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/15">
        <span className="text-lg font-semibold">{t.common.total}</span>
        <span className="text-lg font-semibold">{formatPrice(totalPrice, "UZS", locale)}</span>
      </div>

      {isOwner && (
        <button
          type="button"
          onClick={handleShare}
          disabled={shareState === "sharing"}
          className="mt-2 rounded-full bg-foreground px-5 py-3 text-background disabled:opacity-40"
        >
          {shareState === "sharing"
            ? t.buildPage.publishing
            : shareState === "copied"
              ? t.buildPage.linkCopied
              : build.isPublic
                ? t.buildPage.copyLink
                : t.buildPage.share}
        </button>
      )}
      {shareState === "error" && (
        <p className="text-center text-sm text-red-500">{t.buildPage.copyError}</p>
      )}
    </div>
  );
}
