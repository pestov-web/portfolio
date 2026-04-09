"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { PageHeader } from "@/shared/ui/page-header";
import { Button, Field, FormActions, SurfaceCard, TextArea, TextInput } from "@/shared/ui";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const t = useTranslations("contact");
  const tf = useTranslations("contact.form");
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");

    const form = e.currentTarget;
    const data = {
      name:    (form.elements.namedItem("name") as HTMLInputElement).value,
      email:   (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="page-container page-x fade-in">
      <section className="py-14 max-w-xl">
        <PageHeader
          title={t("title")}
          description={t("description")}
        />

        {state === "success" ? (
          <SurfaceCard padding="lg" className="text-center">
            <p className="text-accent font-medium">{tf("success")}</p>
          </SurfaceCard>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Имя */}
            <Field label={tf("name")} htmlFor="name">
              <TextInput
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full"
              />
            </Field>

            {/* Email */}
            <Field label={tf("email")} htmlFor="email">
              <TextInput
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full"
              />
            </Field>

            {/* Сообщение */}
            <Field label={tf("message")} htmlFor="message">
              <TextArea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full"
              />
            </Field>

            {state === "error" && (
              <p className="text-sm text-red-500">{tf("error")}</p>
            )}

            <FormActions className="pt-0">
              <Button
                type="submit"
                disabled={state === "loading"}
                variant="primary"
                className="h-10 px-5 self-start"
              >
                {state === "loading" ? "..." : tf("submit")}
              </Button>
            </FormActions>
          </form>
        )}
      </section>
    </div>
  );
}
