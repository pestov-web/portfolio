"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { Image } from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { useTranslations } from "next-intl";
import { useRef, useState, type ChangeEvent } from "react";
import { useToast } from "@/shared/ui/toast";
import {
  BlockquoteIcon,
  BulletListIcon,
  CodeBlockIcon,
  CodeInlineIcon,
  EditorImageIcon,
  LinkIcon,
  OrderedListIcon,
  RedoIcon,
  UndoIcon,
} from "@/shared/ui/icons";
import { toRenderableFileUrl } from "@/shared/lib/media";
import { getToolButtonClassName, tiptapEditorClassNames } from "./tiptap-editor.styles";
import type { EditorContentState, TiptapEditorProps, ToolButtonProps } from "./tiptap-editor.types";

function ToolBtn({ onClick, active, title, children }: ToolButtonProps) {
  return (
    <button type="button" title={title} onClick={onClick} className={getToolButtonClassName(active)}>
      {children}
    </button>
  );
}

export function TiptapEditor({ name, defaultValue }: TiptapEditorProps) {
  const t = useTranslations("editor");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { showToast } = useToast();
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
        class: tiptapEditorClassNames.editorContent,
      },
    },
    onCreate({ editor: currentEditor }) {
      setSerializedContent(JSON.stringify(currentEditor.getJSON()));
    },
    onUpdate({ editor: currentEditor }) {
      setSerializedContent(JSON.stringify(currentEditor.getJSON()));
    },
    immediatelyRender: false,
  });

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
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
        throw new Error(data.error ?? t("uploadError"));
      }

      editor?.chain().focus().setImage({ src: toRenderableFileUrl(data.url) }).run();
    } catch (error) {
      showToast({
        description: error instanceof Error ? error.message : t("uploadError"),
        variant: "error",
      });
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const setLink = () => {
    const url = window.prompt(t("linkPrompt"));
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className={tiptapEditorClassNames.root}>
      <input type="hidden" name={name} value={serializedContent} readOnly />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleImageSelect}
      />

      <div className={tiptapEditorClassNames.toolbar}>
        <ToolBtn title={t("bold")} active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn title={t("italic")} active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolBtn>
        <ToolBtn title={t("code")} active={editor?.isActive("code")} onClick={() => editor?.chain().focus().toggleCode().run()}>
          <CodeInlineIcon />
        </ToolBtn>
        <div className={tiptapEditorClassNames.separator} />
        <ToolBtn title={t("heading2")} active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolBtn>
        <ToolBtn title={t("heading3")} active={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolBtn>
        <div className={tiptapEditorClassNames.separator} />
        <ToolBtn title={t("bulletList")} active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <BulletListIcon />
        </ToolBtn>
        <ToolBtn title={t("orderedList")} active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          <OrderedListIcon />
        </ToolBtn>
        <ToolBtn title={t("blockquote")} active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
          <BlockquoteIcon />
        </ToolBtn>
        <ToolBtn title={t("codeBlock")} active={editor?.isActive("codeBlock")} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
          <CodeBlockIcon />
        </ToolBtn>
        <div className={tiptapEditorClassNames.separator} />
        <ToolBtn title={t("link")} onClick={setLink}><LinkIcon /></ToolBtn>
        <ToolBtn title={t("image")} onClick={addImage}><EditorImageIcon /></ToolBtn>
        <div className={tiptapEditorClassNames.separator} />
        <ToolBtn title={t("undo")} onClick={() => editor?.chain().focus().undo().run()}>
          <UndoIcon />
        </ToolBtn>
        <ToolBtn title={t("redo")} onClick={() => editor?.chain().focus().redo().run()}>
          <RedoIcon />
        </ToolBtn>
      </div>

      <div className={tiptapEditorClassNames.editor}>
        <EditorContent editor={editor} />
      </div>
      {isUploadingImage ? <div className={tiptapEditorClassNames.status}>{t("uploadingImage")}</div> : null}
    </div>
  );
}

function getInitialEditorContent(defaultValue?: string): EditorContentState {
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

export { getToolButtonClassName, tiptapEditorClassNames } from "./tiptap-editor.styles";
export type { EditorContentState, TiptapEditorProps, ToolButtonProps } from "./tiptap-editor.types";