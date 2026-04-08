import { NextRequest, NextResponse } from "next/server";
import { getFileData } from "@/shared/lib/minio";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const objectName = path.join("/");

  try {
    const { buffer, contentType } = await getFileData(objectName);

    return new NextResponse(Uint8Array.from(buffer), {
      headers: {
        "Content-Type": contentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}