"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ApiError, getBuild, shareBuild } from "@/lib/api";
import { formatPrice, specSummary } from "@/lib/format";
import type { Build } from "@/lib/types";
import { useAuth } from "@/components/telegram-provider";

type State =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "forbidden" }
  | { status: "error"; message: string }
  | { status: "ready"; build: Build };

export default function BuildPage() {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const [state, setState] = useState<State>({ status: "loading" });
  const [shareState, setShareState] = useState<"idle" | "sharing" | "copied" | "error">("idle");

  useEffect(() => {
    const accessToken = auth.status === "authenticated" ? auth.accessToken : undefined;
    getBuild(id, accessToken)
      .then((build) => setState({ status: "ready", build }))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setState({ status: "not-found" });
        else if (err instanceof ApiError && err.status === 403) setState({ status: "forbidden" });
        else setState({ status: "error", message: err instanceof Error ? err.message : "Ошибка загрузки" });
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
    return <p className="p-4 text-center">Загрузка сборки...</p>;
  }

  if (state.status === "not-found") {
    return <p className="p-4 text-center text-red-500">Сборка не найдена</p>;
  }

  if (state.status === "forbidden") {
    return <p className="p-4 text-center text-red-500">Эта сборка приватная</p>;
  }

  if (state.status === "error") {
    return <p className="p-4 text-center text-red-500">{state.message}</p>;
  }

  const { build } = state;
  const isOwner = auth.status === "authenticated" && auth.userId === build.userId;
  const totalPrice = build.totalPrice ? Number(build.totalPrice) : 0;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2 p-4">
      <Link href="/" className="text-sm text-zinc-400 underline">
        ← К конфигуратору
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
            {specSummary(item.component) && (
              <div className="text-sm text-zinc-400">{specSummary(item.component)}</div>
            )}
          </div>
          <span className="whitespace-nowrap text-sm">
            {formatPrice(Number(item.component.price) * item.quantity, item.component.currency)}
          </span>
        </div>
      ))}

      <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/15">
        <span className="text-lg font-semibold">Итого</span>
        <span className="text-lg font-semibold">{formatPrice(totalPrice, "UZS")}</span>
      </div>

      {isOwner && (
        <button
          type="button"
          onClick={handleShare}
          disabled={shareState === "sharing"}
          className="mt-2 rounded-full bg-foreground px-5 py-3 text-background disabled:opacity-40"
        >
          {shareState === "sharing"
            ? "Публикация..."
            : shareState === "copied"
              ? "Ссылка скопирована ✅"
              : build.isPublic
                ? "Скопировать ссылку"
                : "Поделиться"}
        </button>
      )}
      {shareState === "error" && (
        <p className="text-center text-sm text-red-500">Не удалось скопировать ссылку</p>
      )}
    </div>
  );
}
