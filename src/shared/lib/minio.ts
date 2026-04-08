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

export const minio = globalForMinio.minio ?? createMinioClient();

if (process.env.NODE_ENV !== "production") {
  globalForMinio.minio = minio;
}

export const MINIO_BUCKET = process.env.MINIO_BUCKET!;

// Загружает файл в MinIO и возвращает публичный URL
export async function uploadFile(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  await minio.putObject(MINIO_BUCKET, filename, buffer, buffer.length, {
    "Content-Type": contentType,
  });

  const useSSL = process.env.MINIO_USE_SSL === "true";
  const protocol = useSSL ? "https" : "http";
  const endpoint = process.env.MINIO_ENDPOINT!;
  const port = process.env.MINIO_PORT ?? "9000";

  return `${protocol}://${endpoint}:${port}/${MINIO_BUCKET}/${filename}`;
}

// Удаляет файл из MinIO
export async function deleteFile(filename: string): Promise<void> {
  await minio.removeObject(MINIO_BUCKET, filename);
}
