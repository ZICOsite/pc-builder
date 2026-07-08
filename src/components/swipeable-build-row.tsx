"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { Build } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Ширина открытой панели удаления и порог "срабатывания" свайпа — оба в px.
const SWIPE_OPEN_X = -80;
const SWIPE_ARM_THRESHOLD = -40;
// Движения меньше этого порога считаются тапом, а не свайпом (чтобы не мешать навигации)
const DRAG_CLICK_THRESHOLD = 8;
// За пределами [SWIPE_OPEN_X, 0] палец продолжает двигать панель, но с сопротивлением
// (rubber-band, как в iOS/Telegram) — множитель показывает, какая доля лишнего движения проходит
const RUBBER_BAND_FACTOR = 0.35;
// Быстрый флик распахивает/закрывает панель даже если палец не дошёл до порога расстояния
const FLING_VELOCITY = 0.6; // px/ms
// Плавное "энергичное" замедление без отскока — тот же тип кривой, что и нативные iOS-панели
const SNAP_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const SNAP_DURATION_MS = 260;

function applyRubberBand(raw: number): number {
  if (raw > 0) return raw * RUBBER_BAND_FACTOR;
  if (raw < SWIPE_OPEN_X) return SWIPE_OPEN_X + (raw - SWIPE_OPEN_X) * RUBBER_BAND_FACTOR;
  return raw;
}

interface SwipeableBuildRowProps {
  build: Build;
  totalPrice: number;
  discountedTotal: number;
  discountPercent: number;
  locale: Locale;
  itemsLabel: string;
  publicLabel: string;
  privateLabel: string;
  deleteLabel: string;
  onDelete: (id: string) => void;
}

export function SwipeableBuildRow({
  build,
  totalPrice,
  discountedTotal,
  discountPercent,
  locale,
  itemsLabel,
  publicLabel,
  privateLabel,
  deleteLabel,
  onDelete,
}: SwipeableBuildRowProps) {
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const baseOffset = useRef(0);
  const didDrag = useRef(false);
  const lastMoveTime = useRef(0);
  const lastMoveX = useRef(0);
  const velocity = useRef(0);

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    dragStartX.current = e.clientX;
    baseOffset.current = offset;
    didDrag.current = false;
    lastMoveTime.current = performance.now();
    lastMoveX.current = e.clientX;
    velocity.current = 0;
    setDragging(true);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > DRAG_CLICK_THRESHOLD) didDrag.current = true;

    const now = performance.now();
    const dt = now - lastMoveTime.current;
    if (dt > 0) velocity.current = (e.clientX - lastMoveX.current) / dt;
    lastMoveTime.current = now;
    lastMoveX.current = e.clientX;

    setOffset(applyRubberBand(baseOffset.current + delta));
  }

  function endDrag() {
    if (dragStartX.current === null) return;
    dragStartX.current = null;
    setDragging(false);
    setOffset((current) => {
      if (velocity.current < -FLING_VELOCITY) return SWIPE_OPEN_X;
      if (velocity.current > FLING_VELOCITY) return 0;
      return current <= SWIPE_ARM_THRESHOLD ? SWIPE_OPEN_X : 0;
    });
  }

  function handleRowClick() {
    if (didDrag.current) return;
    if (offset !== 0) {
      setOffset(0);
      return;
    }
    router.push(`/builds/${build.id}`);
  }

  const revealProgress = Math.max(0, Math.min(1, offset / SWIPE_OPEN_X));

  return (
    <div className="relative overflow-hidden rounded-xl">
      <button
        type="button"
        onClick={() => onDelete(build.id)}
        aria-label={deleteLabel}
        className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-destructive text-white"
      >
        <Trash2
          className="size-5"
          style={{
            opacity: revealProgress,
            transform: `scale(${0.6 + revealProgress * 0.4})`,
            transition: dragging ? "none" : `all ${SNAP_DURATION_MS}ms ${SNAP_EASING}`,
          }}
        />
      </button>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={handleRowClick}
        style={{
          transform: `translate3d(${offset}px, 0, 0)`,
          transition: dragging ? "none" : `transform ${SNAP_DURATION_MS}ms ${SNAP_EASING}`,
          touchAction: "pan-y",
          willChange: "transform",
        }}
        className="relative cursor-pointer bg-background"
      >
        <Card size="sm" className="transition-colors hover:bg-muted">
          <CardContent className="flex items-center justify-between gap-2">
            <div>
              <div className="font-medium">{build.name}</div>
              <div className="text-sm text-muted-foreground">{itemsLabel}</div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              {discountPercent > 0 && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(totalPrice, "UZS", locale)}
                </span>
              )}
              <span className="text-sm font-medium">{formatPrice(discountedTotal, "UZS", locale)}</span>
              <Badge variant={build.isPublic ? "secondary" : "outline"}>
                {build.isPublic ? publicLabel : privateLabel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
