"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { getAdminComponent, updateComponent } from "@/lib/api";
import { ComponentForm } from "@/components/admin/component-form";
import { BackButton } from "@/components/back-button";
import type { Component, ComponentInput } from "@/lib/types";

type State = { status: "loading" } | { status: "error" } | { status: "ready"; component: Component };

export default function EditComponentPage() {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    getAdminComponent(Number(id), auth.accessToken)
      .then((component) => setState({ status: "ready", component }))
      .catch(() => setState({ status: "error" }));
  }, [id, auth]);

  async function handleSubmit(input: ComponentInput) {
    if (auth.status !== "authenticated") return;
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await updateComponent(Number(id), input, auth.accessToken);
      router.push("/admin/components");
    } catch {
      setErrorMessage(t.admin.form.saveErrorFallback);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <BackButton fallbackHref="/admin/components" />
      <h1 className="text-xl font-semibold">{t.admin.editComponent}</h1>

      {state.status === "loading" && (
        <p className="p-4 text-center text-muted-foreground">{t.admin.loading}</p>
      )}
      {state.status === "error" && (
        <p className="p-4 text-center text-destructive">{t.admin.loadErrorFallback}</p>
      )}
      {state.status === "ready" && (
        <ComponentForm
          initial={state.component}
          submitting={submitting}
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/components")}
        />
      )}
    </>
  );
}
