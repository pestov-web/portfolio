import { describe, expect, it } from "vitest";
import { renderTiptap } from "./tiptap";

describe("renderTiptap", () => {
  it("keeps supported rich content", () => {
    const html = renderTiptap(JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "OpenAI", marks: [{ type: "link", attrs: { href: "https://openai.com" } }] },
          ],
        },
      ],
    }));

    expect(html).toContain('href="https://openai.com"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("removes unsafe URL schemes from links", () => {
    const html = renderTiptap(JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "unsafe", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] },
          ],
        },
      ],
    }));

    expect(html).not.toContain("javascript:");
    expect(html).toContain("unsafe");
  });
});
