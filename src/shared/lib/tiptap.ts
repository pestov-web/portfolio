import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";

// Расширения, совпадающие с редактором (Link входит в StarterKit v3)
const extensions = [
  StarterKit.configure({ link: { openOnClick: false } }),
  Image,
];

// Парсим Tiptap JSON → HTML на сервере (без клиентского JS)
export function renderTiptap(json: string): string {
  try {
    const doc = JSON.parse(json) as object;
    return generateHTML(doc, extensions);
  } catch {
    return "";
  }
}
