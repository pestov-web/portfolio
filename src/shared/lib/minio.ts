import { Client } from "minio";

// Singleton MinIO клиента
const globalForMinio = globalThis as unknown as {
  minio: Client | undefined;
};

function createMinioClient() {
  return new Client({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: parseInt(process.env.MINIO_PORT ?? "9000"),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
  });
}

function getMinioClient() {
  if (!globalForMinio.minio) {
    globalForMinio.minio = createMinioClient();
  }

  return globalForMinio.minio;
}

export const MINIO_BUCKET = process.env.MINIO_BUCKET!;

type MinioUrlConfig = {
  bucket?: string;
  endpoint?: string;
  port?: string;
  useSSL?: boolean;
};

function getMinioUrlConfig(config?: MinioUrlConfig) {
  return {
    bucket: config?.bucket ?? MINIO_BUCKET,
    endpoint: config?.endpoint ?? process.env.MINIO_ENDPOINT!,
    port: config?.port ?? (process.env.MINIO_PORT ?? "9000"),
    useSSL: config?.useSSL ?? (process.env.MINIO_USE_SSL === "true"),
  };
}

// Загружает файл в MinIO и возвращает публичный URL
export async function uploadFile(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  await getMinioClient().putObject(MINIO_BUCKET, filename, buffer, buffer.length, {
    "Content-Type": contentType,
  });

  const { useSSL, endpoint, port, bucket } = getMinioUrlConfig();
  const protocol = useSSL ? "https" : "http";

  return `${protocol}://${endpoint}:${port}/${bucket}/${filename}`;
}

// Удаляет файл из MinIO
export async function deleteFile(filename: string): Promise<void> {
  await getMinioClient().removeObject(MINIO_BUCKET, filename);
}

export function extractMinioObjectNameFromUrl(
  fileUrl: string,
  config?: MinioUrlConfig
): string | null {
  try {
    const url = new URL(fileUrl);
    const { bucket, endpoint, port, useSSL } = getMinioUrlConfig(config);
    const expectedProtocol = useSSL ? "https:" : "http:";

    if (
      url.hostname !== endpoint ||
      url.port !== String(port) ||
      url.protocol !== expectedProtocol
    ) {
      return null;
    }

    const prefix = `/${bucket}/`;
    if (!url.pathname.startsWith(prefix)) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(prefix.length));
  } catch {
    return null;
  }
}

export async function deleteUploadedFileByUrl(fileUrl: string | null | undefined): Promise<void> {
  if (!fileUrl) {
    return;
  }

  const objectName = extractMinioObjectNameFromUrl(fileUrl);
  if (!objectName) {
    return;
  }

  try {
    await deleteFile(objectName);
  } catch {
    // Ошибка очистки не должна ломать пользовательскую операцию.
  }
}
