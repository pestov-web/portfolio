"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { useRef } from "react";

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
  const hiddenRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
    ],
    content: defaultValue ? (JSON.parse(defaultValue) as object) : undefined,
    editorProps: {
      attributes: {
        class: "prose min-h-[12rem] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate({ editor: ed }) {
      if (hiddenRef.current) {
        hiddenRef.current.value = JSON.stringify(ed.getJSON());
      }
    },
    immediatelyRender: false,
  });

  const addImage = () => {
    const url = window.prompt("URL изображения:");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = window.prompt("URL ссылки:");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-col border border-border rounded-md overflow-hidden">
      {/* Скрытый input для передачи JSON в form */}
      <input
        ref={hiddenRef}
        type="hidden"
        name={name}
        defaultValue={defaultValue ?? "{}"}
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
      <div className="bg-surface min-h-[12rem]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
