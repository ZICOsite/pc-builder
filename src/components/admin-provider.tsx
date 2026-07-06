"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/components/telegram-provider";
import { getProfile } from "@/lib/api";

export type AdminState = { status: "loading" | "not-admin" | "admin" };

const AdminContext = createContext<AdminState>({ status: "loading" });

export function useAdminStatus(): AdminState {
  return useContext(AdminContext);
}

export function useIsAdmin() {
  return useContext(AdminContext).status === "admin";
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [state, setState] = useState<AdminState>({ status: "loading" });

  useEffect(() => {
    if (auth.status !== "authenticated") {
      setState({ status: auth.status === "loading" ? "loading" : "not-admin" });
      return;
    }
    getProfile(auth.accessToken)
      .then((profile) => setState({ status: profile.isAdmin ? "admin" : "not-admin" }))
      .catch(() => setState({ status: "not-admin" }));
  }, [auth]);

  return <AdminContext.Provider value={state}>{children}</AdminContext.Provider>;
}
