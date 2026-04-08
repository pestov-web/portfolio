import { notFound } from "next/navigation";
import type { Locale } from "@/shared/config/i18n";
import { prisma } from "@/shared/lib/prisma";
import { updatePost, deletePost } from "../../../actions";
import { TiptapEditor } from "@/shared/ui";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, title: true, excerpt: true, content: true, published: true, restricted: true },
  });

  if (!post) notFound();

  // Серверные action с привязкой id
  const updatePostWithId = updatePost.bind(null, post.id);
  const deletePostWithId = deletePost.bind(null, post.id);

  return (
    <div className="page-container page-x fade-in">
      <div className="py-14 max-w-2xl">
        <h1 className="text-2xl font-bold mb-8">Редактировать пост</h1>

        <form action={updatePostWithId} className="flex flex-col gap-5">
          {/* Заголовок */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium">Заголовок</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={post.title}
              className="h-10 rounded-md border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors"
            />
          </div>

          {/* Анонс */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="excerpt" className="text-sm font-medium">Анонс</label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={post.excerpt ?? ""}
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors resize-none"
            />
          </div>

          {/* Содержимое */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Содержимое</span>
            <TiptapEditor name="content" defaultValue={post.content} />
          </div>

          {/* Чекбоксы */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="published" defaultChecked={post.published} className="accent-accent-vivid" />
              Опубликован
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="restricted" defaultChecked={post.restricted} className="accent-accent-vivid" />
              Только для друзей
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-accent-vivid text-white text-sm font-medium rounded-md hover:bg-accent-dim transition-colors"
            >
              Сохранить
            </button>
          </div>
        </form>

        {/* Удалить */}
        <form action={deletePostWithId} className="mt-10 pt-8 border-t border-border">
          <p className="text-sm text-muted mb-4">Опасная зона — удаление необратимо.</p>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500/30 rounded-md hover:bg-red-500/10 transition-colors"
          >
            Удалить пост
          </button>
        </form>
      </div>
    </div>
  );
}
