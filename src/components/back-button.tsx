"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useLocale } from "@/components/locale-provider";
import { hasNavigatedInApp } from "@/lib/nav-history";

interface BackButtonProps {
  fallbackHref: string;
}

export function BackButton({ fallbackHref }: BackButtonProps) {
  const router = useRouter();
  const { t } = useLocale();

  function handleClick(e: MouseEvent) {
    if (hasNavigatedInApp()) {
      e.preventDefault();
      router.back();
    }
  }

  return (
    <Link href={fallbackHref} onClick={handleClick} className="text-sm text-muted-foreground underline">
      {t.common.back}
    </Link>
  );
}
