"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordVisit } from "@/lib/nav-history";

export function NavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordVisit();
  }, [pathname]);

  return null;
}
