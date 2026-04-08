import { describe, expect, it } from "vitest";
import { extractMinioObjectNameFromUrl } from "./minio";

describe("extractMinioObjectNameFromUrl", () => {
  it("extracts the object name for managed MinIO URLs", () => {
    expect(
      extractMinioObjectNameFromUrl(
        "http://localhost:9000/portfolio/uploads/cover.png",
        { bucket: "portfolio", endpoint: "localhost", port: "9000", useSSL: false }
      )
    ).toBe("uploads/cover.png");
  });

  it("returns null for foreign hosts", () => {
    expect(
      extractMinioObjectNameFromUrl(
        "https://example.com/portfolio/uploads/cover.png",
        { bucket: "portfolio", endpoint: "localhost", port: "9000", useSSL: false }
      )
    ).toBeNull();
  });
});