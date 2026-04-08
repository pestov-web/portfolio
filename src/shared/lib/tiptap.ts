import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { toRenderableFileUrl } from "./media";

// Расширения, совпадающие с редактором (Link входит в StarterKit v3)
const extensions = [
  StarterKit.configure({ link: { openOnClick: false } }),
  Image,
];

// Парсим Tiptap JSON → HTML на сервере (без клиентского JS)
export function renderTiptap(json: string): string {
  try {
    const doc = normalizeTiptapDocument(JSON.parse(json) as Record<string, unknown>);
    return generateHTML(doc, extensions);
  } catch {
    return "";
  }
}

function normalizeTiptapDocument(value: Record<string, unknown>): Record<string, unknown> {
  return rewriteNode(value);
}

function rewriteNode(node: Record<string, unknown>): Record<string, unknown> {
  const normalizedNode = { ...node };

  if (node.type === "image" && isRecord(node.attrs) && typeof node.attrs.src === "string") {
    normalizedNode.attrs = {
      ...node.attrs,
      src: toRenderableFileUrl(node.attrs.src),
    };
  }

  if (Array.isArray(node.content)) {
    normalizedNode.content = node.content.map((item) => (isRecord(item) ? rewriteNode(item) : item));
  }

  return normalizedNode;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
