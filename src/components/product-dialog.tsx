"use client";

import { useLocale } from "@/components/locale-provider";
import { formatPrice, specDetails } from "@/lib/format";
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
      </DialogContent>
    </Dialog>
  );
}
