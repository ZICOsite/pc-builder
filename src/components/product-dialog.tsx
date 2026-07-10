"use client";

import { useLocale } from "@/components/locale-provider";
import { YoutubeIcon } from "@/components/youtube-icon";
import { formatPrice, specDetails, youtubeSearchUrl } from "@/lib/format";
import type { Component } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface ProductDialogProps {
  component: Component | null;
  onOpenChange: (open: boolean) => void;
}

export function ProductDialog({ component, onOpenChange }: ProductDialogProps) {
  const { locale, t } = useLocale();

  if (!component) return null;
  const details = specDetails(component, t);

  return (
    <Dialog open={Boolean(component)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {component.brand} {component.name}
          </DialogTitle>
        </DialogHeader>

        {details.length > 0 && (
          <div className="flex flex-col gap-1">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">{detail.label}</span>
                <span className="text-right font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t.admin.form.priceLabel}</span>
          <span className="text-lg font-semibold">
            {formatPrice(Number(component.price), component.currency, locale)}
          </span>
        </div>

        <a
          href={youtubeSearchUrl(component)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border border-border p-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <YoutubeIcon className="size-4" />
          {t.catalog.searchOnYoutube}
        </a>
      </DialogContent>
    </Dialog>
  );
}
