import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";

// Расширения, совпадающие с редактором
const extensions = [
  StarterKit,
  Image,
  Link.configure({ openOnClick: false }),
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
