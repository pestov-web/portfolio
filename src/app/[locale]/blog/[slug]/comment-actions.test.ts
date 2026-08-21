import { beforeEach, describe, expect, it, vi } from "vitest";

const { createCommentMock, findPostMock, getSessionMock, revalidatePathMock } = vi.hoisted(() => ({
  createCommentMock: vi.fn(),
  findPostMock: vi.fn(),
  getSessionMock: vi.fn(),
  revalidatePathMock: vi.fn(),
}));

vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: string) => key),
}));
vi.mock("@/shared/auth/index.server", () => ({
  auth: { api: { getSession: getSessionMock } },
}));
vi.mock("@/shared/lib/prisma", () => ({
  prisma: {
    post: { findUnique: findPostMock },
    comment: { create: createCommentMock, findUnique: vi.fn(), delete: vi.fn() },
  },
}));

import { addComment } from "./comment-actions";

function commentForm(content = "A useful comment") {
  const formData = new FormData();
  formData.set("content", content);
  return formData;
}

describe("addComment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue({ user: { id: "user-id", role: "USER" } });
  });

  it("creates a comment on an accessible published post", async () => {
    findPostMock.mockResolvedValue({
      published: true,
      restricted: false,
      translations: [{ slug: "published-post" }],
    });

    await expect(addComment("post-id", "en", undefined, commentForm())).resolves.toEqual({
      error: null,
      submittedAt: expect.any(Number),
    });
    expect(createCommentMock).toHaveBeenCalledWith({
      data: { content: "A useful comment", postId: "post-id", userId: "user-id" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/en/blog/published-post");
  });

  it.each([
    ["a draft", { published: false, restricted: false }],
    ["a missing post", null],
    ["a restricted post for a regular user", { published: true, restricted: true }],
  ])("rejects comments on %s", async (_case, post) => {
    findPostMock.mockResolvedValue(post ? { ...post, translations: [] } : null);

    await expect(addComment("post-id", "en", undefined, commentForm())).resolves.toEqual({
      error: "errors.unavailable",
      submittedAt: null,
    });
    expect(createCommentMock).not.toHaveBeenCalled();
  });

  it("allows a friend to comment on a restricted published post", async () => {
    getSessionMock.mockResolvedValue({ user: { id: "friend-id", role: "FRIEND" } });
    findPostMock.mockResolvedValue({ published: true, restricted: true, translations: [] });

    await addComment("post-id", "en", undefined, commentForm());

    expect(createCommentMock).toHaveBeenCalled();
  });
});
