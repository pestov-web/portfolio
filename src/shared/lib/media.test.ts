import { describe, expect, it } from "vitest";
import { toRenderableFileUrl } from "./media";

describe("toRenderableFileUrl", () => {
  it("converts managed MinIO URLs to local media proxy URLs", () => {
    expect(toRenderableFileUrl("http://localhost:9000/portfolio/uploads/cover.png")).toBe(
      "/api/media/uploads/cover.png"
    );
  });

  it("keeps foreign URLs unchanged", () => {
    expect(toRenderableFileUrl("https://example.com/image.png")).toBe("https://example.com/image.png");
  });
});