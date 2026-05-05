"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlaceholderIcon } from "@/shared/ui/icons";
import { toRenderableFileUrl } from "@/shared/lib/media";
import { imageUploadClassNames } from "./image-upload.styles";
import type { ImageUploadProps } from "./image-upload.types";

export function ImageUpload({ name, defaultValue, label, disabled = false }: ImageUploadProps) {
  const t = useTranslations("media");
  const [storedUrl, setStoredUrl] = useState(defaultValue ?? "");
  const [preview, setPreview] = useState(toRenderableFileUrl(defaultValue));
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }

    const nextPreview = URL.createObjectURL(file);
    setObjectUrl(nextPreview);
    setPreview(nextPreview);
    setStoredUrl("");
    setSelectedFileName(file.name);
    setError("");
  }

  function handleRemove() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }

    setStoredUrl("");
    setPreview("");
    setSelectedFileName("");
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  return (
    <div className={imageUploadClassNames.root}>
      <span className={imageUploadClassNames.label}>{label ?? t("cover")}</span>

      <input type="hidden" name={name} value={storedUrl} />
      <input
        ref={inputRef}
        type="file"
        name={`${name}File`}
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleChange}
        className="sr-only"
        disabled={disabled}
      />

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
          </div>
          <div className={imageUploadClassNames.actions}>
            <button type="button" onClick={openFilePicker} className={imageUploadClassNames.actionButton} disabled={disabled}>
              {t("selectImage")}
            </button>
            <button type="button" onClick={handleRemove} className={imageUploadClassNames.removeButton} disabled={disabled}>
              {t("removeImage")}
            </button>
            {selectedFileName ? (
              <span className={imageUploadClassNames.fileName}>{selectedFileName}</span>
            ) : null}
          </div>
        </div>
      ) : (
        <button type="button" className={imageUploadClassNames.emptyLabel} onClick={openFilePicker} disabled={disabled}>
          <div className={imageUploadClassNames.emptyContent}>
            <ImagePlaceholderIcon />
            <span>{t("selectImage")}</span>
            <span className={imageUploadClassNames.hint}>{t("formatsHint")}</span>
          </div>
        </button>
      )}

      {error ? <p className={imageUploadClassNames.error}>{error}</p> : null}
    </div>
  );
}

export { imageUploadClassNames } from "./image-upload.styles";
export type { ImageUploadProps } from "./image-upload.types";