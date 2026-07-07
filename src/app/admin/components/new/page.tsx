"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { createComponent } from "@/lib/api";
import { ComponentForm } from "@/components/admin/component-form";
import { BackButton } from "@/components/back-button";
import type { ComponentInput } from "@/lib/types";

export default function NewComponentPage() {
  const auth = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleSubmit(input: ComponentInput) {
    if (auth.status !== "authenticated") return;
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await createComponent(input, auth.accessToken);
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
      <h1 className="text-xl font-semibold">{t.admin.addComponent}</h1>
      <ComponentForm
        submitting={submitting}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/components")}
      />
    </>
  );
}
