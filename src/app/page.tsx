"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";
import { CATEGORY_ICONS } from "@/lib/icons";
import { COMPONENT_TYPES } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { t } = useLocale();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t.home.title}</h1>
        <p className="text-sm text-muted-foreground">{t.home.subtitle}</p>
      </div>

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
