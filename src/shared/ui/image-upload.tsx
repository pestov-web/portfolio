"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toRenderableFileUrl } from "@/shared/lib/media";

type Props = {
  name: string;
  defaultValue?: string;
  label?: string;
};

export function ImageUpload({ name, defaultValue, label = "Обложка" }: Props) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [preview, setPreview] = useState(toRenderableFileUrl(defaultValue));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Локальный превью
    setPreview(URL.createObjectURL(file));
    setError("");
    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Ошибка загрузки");
      }

      setUrl(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
      setPreview(toRenderableFileUrl(url));
    } finally {
      setLoading(false);
    }
  }

  function handleRemove() {
    setUrl("");
    setPreview("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>

      {/* Скрытое поле — несёт итоговый URL в формдату */}
      <input type="hidden" name={name} value={url} />

      {preview ? (
        <div className="relative w-full max-w-sm">
          <div className="relative aspect-video w-full rounded-md overflow-hidden border border-border bg-surface">
            <Image
              src={preview}
              alt="Превью обложки"
              fill
              unoptimized
              className="object-cover"
            />
            {loading && (
              <div className="absolute inset-0 bg-bg/70 flex items-center justify-center text-xs text-muted">
                Загрузка…
              </div>
            )}
          </div>
          {!loading && (
            <button
              type="button"
              onClick={handleRemove}
              className="mt-1.5 text-xs text-muted hover:text-red-500 transition-colors"
            >
              Удалить изображение
            </button>
          )}
        </div>
      ) : (
        <label className="flex items-center justify-center w-full max-w-sm aspect-video rounded-md border-2 border-dashed border-border bg-surface hover:border-accent-vivid hover:bg-subtle transition-colors cursor-pointer">
          <div className="flex flex-col items-center gap-1 text-muted text-sm select-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Выбрать изображение</span>
            <span className="text-xs text-faint">JPEG, PNG, WebP, GIF — до 10 МБ</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={handleChange}
            className="sr-only"
          />
        </label>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
