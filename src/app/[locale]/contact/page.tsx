"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

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
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted">{t("description")}</p>
        </div>

        {state === "success" ? (
          <div className="glass p-6 text-center">
            <p className="text-accent font-medium">{tf("success")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Имя */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                {tf("name")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                {tf("email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors"
              />
            </div>

            {/* Сообщение */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium">
                {tf("message")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors resize-none"
              />
            </div>

            {state === "error" && (
              <p className="text-sm text-red-500">{tf("error")}</p>
            )}

            <button
              type="submit"
              disabled={state === "loading"}
              className="h-10 px-5 bg-accent-vivid text-white text-sm font-medium rounded-md hover:bg-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start"
            >
              {state === "loading" ? "..." : tf("submit")}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
