import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/auth/server/index";
import { headers } from "next/headers";
import { uploadFile } from "@/shared/lib/minio";
import { randomUUID } from "crypto";
import { extname } from "path";
import { getOptionalFile, validateImageFile } from "@/shared/lib/upload";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = getOptionalFile(formData, "file");

  if (!file) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }

  try {
    validateImageFile(file);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    );
  }

  const ext = extname(file.name) || ".jpg";
  const objectName = `uploads/${randomUUID()}${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const url = await uploadFile(buffer, objectName, file.type);

  return NextResponse.json({ url });
}
