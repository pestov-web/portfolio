import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/auth/server/index";
import { headers } from "next/headers";
import { uploadFile } from "@/shared/lib/minio";
import { randomUUID } from "crypto";
import { extname } from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 МБ

export async function POST(req: NextRequest) {
  // Только ADMIN
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Недопустимый тип файла" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Файл слишком большой (макс. 10 МБ)" }, { status: 400 });
  }

  const ext = extname(file.name) || ".jpg";
  const objectName = `uploads/${randomUUID()}${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const url = await uploadFile(buffer, objectName, file.type);

  return NextResponse.json({ url });
}
