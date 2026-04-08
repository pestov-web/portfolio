"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { useRef, useState } from "react";
import { toRenderableFileUrl } from "@/shared/lib/media";

type Props = {
  name: string;
  defaultValue?: string;
};

// Кнопка тулбара
function ToolBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "px-2 py-1 text-sm rounded transition-colors",
        active
          ? "bg-accent-vivid text-white"
          : "text-muted hover:text-fg hover:bg-subtle",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({ name, defaultValue }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const initialContent = getInitialEditorContent(defaultValue);
  const [serializedContent, setSerializedContent] = useState(initialContent.serialized);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Image,
    ],
    content: initialContent.document,
    editorProps: {
      attributes: {
        class: "prose min-h-48 px-4 py-3 focus:outline-none",
      },
    },
    onCreate({ editor: ed }) {
      setSerializedContent(JSON.stringify(ed.getJSON()));
    },
    onUpdate({ editor: ed }) {
      setSerializedContent(JSON.stringify(ed.getJSON()));
    },
    immediatelyRender: false,
  });

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Ошибка загрузки");
      }

      editor?.chain().focus().setImage({ src: toRenderableFileUrl(data.url) }).run();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Ошибка загрузки");
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const setLink = () => {
    const url = window.prompt("URL ссылки:");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-col border border-border rounded-md overflow-hidden">
      {/* Скрытый input для передачи JSON в form */}
      <input
        type="hidden"
        name={name}
        value={serializedContent}
        readOnly
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleImageSelect}
      />

      {/* Тулбар */}
      <div className="flex flex-wrap gap-0.5 border-b border-border bg-subtle px-2 py-1.5">
        <ToolBtn
          title="Bold"
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn
          title="Italic"
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolBtn>
        <ToolBtn
          title="Code"
          active={editor?.isActive("code")}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          {"</>"}
        </ToolBtn>
        <div className="w-px bg-border mx-1" />
        <ToolBtn
          title="H2"
          active={editor?.isActive("heading", { level: 2 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolBtn>
        <ToolBtn
          title="H3"
          active={editor?.isActive("heading", { level: 3 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolBtn>
        <div className="w-px bg-border mx-1" />
        <ToolBtn
          title="Bullet list"
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          •—
        </ToolBtn>
        <ToolBtn
          title="Ordered list"
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolBtn>
        <ToolBtn
          title="Blockquote"
          active={editor?.isActive("blockquote")}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </ToolBtn>
        <ToolBtn
          title="Code block"
          active={editor?.isActive("codeBlock")}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          {"{ }"}
        </ToolBtn>
        <div className="w-px bg-border mx-1" />
        <ToolBtn title="Link" onClick={setLink}>🔗</ToolBtn>
        <ToolBtn title="Image" onClick={addImage}>🖼</ToolBtn>
        <div className="w-px bg-border mx-1" />
        <ToolBtn
          title="Undo"
          onClick={() => editor?.chain().focus().undo().run()}
        >
          ↩
        </ToolBtn>
        <ToolBtn
          title="Redo"
          onClick={() => editor?.chain().focus().redo().run()}
        >
          ↪
        </ToolBtn>
      </div>

      {/* Редактор */}
      <div className="bg-surface min-h-48">
        <EditorContent editor={editor} />
      </div>
      {isUploadingImage ? (
        <div className="border-t border-border px-4 py-2 text-sm text-muted">
          Загрузка изображения...
        </div>
      ) : null}
    </div>
  );
}

function getInitialEditorContent(defaultValue?: string): {
  document: Record<string, unknown> | undefined;
  serialized: string;
} {
  if (!defaultValue) {
    return {
      document: undefined,
      serialized: "{}",
    };
  }

  try {
    const document = normalizeEditorContent(JSON.parse(defaultValue) as Record<string, unknown>);

    return {
      document,
      serialized: JSON.stringify(document),
    };
  } catch {
    return {
      document: undefined,
      serialized: "{}",
    };
  }
}

function normalizeEditorContent(value: Record<string, unknown>): Record<string, unknown> {
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
