"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlaceholderIcon } from "@/shared/ui/icons";
import { toRenderableFileUrl } from "@/shared/lib/media";
import { imageUploadClassNames } from "./image-upload.styles";
import type { ImageUploadProps } from "./image-upload.types";

export function ImageUpload({ name, defaultValue, label }: ImageUploadProps) {
  const t = useTranslations("media");
  const [url, setUrl] = useState(defaultValue ?? "");
  const [preview, setPreview] = useState(toRenderableFileUrl(defaultValue));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setError("");
    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !json.url) {
        throw new Error(json.error ?? t("uploadError"));
      }

      setUrl(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("uploadError"));
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
    <div className={imageUploadClassNames.root}>
      <span className={imageUploadClassNames.label}>{label ?? t("cover")}</span>

      <input type="hidden" name={name} value={url} />

      {preview ? (
        <div className={imageUploadClassNames.previewWrapper}>
          <div className={imageUploadClassNames.previewFrame}>
            <Image
              src={preview}
              alt={t("previewAlt")}
              fill
              unoptimized
              className="object-cover"
            />
            {loading ? <div className={imageUploadClassNames.loadingOverlay}>{t("loading")}</div> : null}
          </div>
          {!loading ? (
            <button type="button" onClick={handleRemove} className={imageUploadClassNames.removeButton}>
              {t("removeImage")}
            </button>
          ) : null}
        </div>
      ) : (
        <label className={imageUploadClassNames.emptyLabel}>
          <div className={imageUploadClassNames.emptyContent}>
            <ImagePlaceholderIcon />
            <span>{t("selectImage")}</span>
            <span className={imageUploadClassNames.hint}>{t("formatsHint")}</span>
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

      {error ? <p className={imageUploadClassNames.error}>{error}</p> : null}
    </div>
  );
}

export { imageUploadClassNames } from "./image-upload.styles";
export type { ImageUploadProps } from "./image-upload.types";