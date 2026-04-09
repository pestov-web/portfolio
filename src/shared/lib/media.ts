const DEFAULT_MINIO_BUCKET = process.env.NEXT_PUBLIC_MINIO_BUCKET ?? "portfolio";

export function toRenderableFileUrl(fileUrl: string | null | undefined): string {
  if (!fileUrl) {
    return "";
  }

  try {
    const parsedUrl = new URL(fileUrl);
    const prefix = `/${DEFAULT_MINIO_BUCKET}/`;

    if (!parsedUrl.pathname.startsWith(prefix)) {
      return fileUrl;
    }

    return `/api/media/${parsedUrl.pathname.slice(prefix.length)}`;
  } catch {
    return fileUrl;
  }
}