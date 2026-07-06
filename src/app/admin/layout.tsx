"use client";

import type { ReactNode } from "react";
import { useAdminStatus } from "@/components/admin-provider";
import { useLocale } from "@/components/locale-provider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { status } = useAdminStatus();
  const { t } = useLocale();

  if (status === "loading") {
    return <p className="p-4 text-center text-muted-foreground">{t.admin.loading}</p>;
  }

  if (status === "not-admin") {
    return <p className="p-4 text-center text-destructive">{t.admin.forbidden}</p>;
  }

  return <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">{children}</div>;
}
