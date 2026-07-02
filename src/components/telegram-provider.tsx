"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { init, isTMA, retrieveRawInitData } from "@telegram-apps/sdk-react";
import { loginWithTelegram } from "@/lib/api";

const TOKEN_STORAGE_KEY = "pcforge_access_token";

type AuthState =
  | { status: "loading" }
  | { status: "not-tma" }
  | { status: "authenticated"; accessToken: string; userId: number }
  | { status: "error"; message: string };

const AuthContext = createContext<AuthState>({ status: "loading" });

export function useAuth() {
  return useContext(AuthContext);
}

function decodeUserId(accessToken: string): number {
  const payload = JSON.parse(atob(accessToken.split(".")[1])) as { sub: number };
  return payload.sub;
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" });
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    async function authenticate() {
      if (!isTMA()) {
        setState({ status: "not-tma" });
        return;
      }

      try {
        init();

        const initDataRaw = retrieveRawInitData();
        if (!initDataRaw) {
          setState({ status: "error", message: "Не удалось получить данные Telegram" });
          return;
        }

        const { accessToken } = await loginWithTelegram(initDataRaw);
        localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
        setState({ status: "authenticated", accessToken, userId: decodeUserId(accessToken) });
      } catch (err) {
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "Ошибка авторизации",
        });
      }
    }

    void authenticate();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
