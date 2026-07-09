"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { CATEGORY_ICONS } from "@/lib/icons";
import { COMPONENT_TYPES, type Build } from "@/lib/types";
import { getMyBuilds, getRequiredCategories } from "@/lib/api";
import { missingCoreTypes } from "@/lib/compatibility";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ContinueBuildState = { status: "none" } | { status: "ready"; build: Build };

export default function Home() {
  const auth = useAuth();
  const { t } = useLocale();
  const [continueBuild, setContinueBuild] = useState<ContinueBuildState>({ status: "none" });

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    Promise.all([getMyBuilds(auth.accessToken), getRequiredCategories()])
      .then(([builds, categories]) => {
        const requiredTypes = categories.filter((c) => c.required).map((c) => c.type);
        const latest = builds[0];
        if (latest && missingCoreTypes(latest.items, requiredTypes).length > 0) {
          setContinueBuild({ status: "ready", build: latest });
        }
      })
      .catch(() => {});
  }, [auth]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t.home.title}</h1>
        <p className="text-sm text-muted-foreground">{t.home.subtitle}</p>
      </div>

      <Button render={<Link href="/configurator" />} nativeButton={false} size="lg" className="w-full">
        {t.home.buildCta}
      </Button>

      {continueBuild.status === "ready" && (
        <Link href={`/configurator?buildId=${continueBuild.build.id}`}>
          <Card className="transition-colors hover:bg-muted">
            <CardContent className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xs text-muted-foreground">{t.home.continueBuildLabel}</div>
                <div className="font-medium">{continueBuild.build.name}</div>
              </div>
              <span className="shrink-0 text-sm font-medium text-primary">{t.home.continueBuildAction}</span>
            </CardContent>
          </Card>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {COMPONENT_TYPES.map((type) => {
          const Icon = CATEGORY_ICONS[type];
          return (
            <Link key={type} href={`/catalog/${type}`}>
              <Card className="h-full transition-colors hover:bg-muted">
                <CardContent className="flex flex-col items-center gap-2 py-2 text-center">
                  <Icon className="size-8 text-primary" />
                  <span className="text-sm font-medium">{t.categories[type]}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
