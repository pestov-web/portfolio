import { describe, expect, it } from "vitest";
import { createMemoryRateLimiter } from "./rate-limit";

describe("createMemoryRateLimiter", () => {
  it("blocks requests over the limit in the same window", () => {
    const limiter = createMemoryRateLimiter({ windowMs: 1_000, max: 2 });

    expect(limiter("ip", 0).success).toBe(true);
    expect(limiter("ip", 100).success).toBe(true);

    const blocked = limiter("ip", 200);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("resets counters after the window expires", () => {
    const limiter = createMemoryRateLimiter({ windowMs: 1_000, max: 1 });

    expect(limiter("ip", 0).success).toBe(true);
    expect(limiter("ip", 500).success).toBe(false);
    expect(limiter("ip", 1_100).success).toBe(true);
  });
});