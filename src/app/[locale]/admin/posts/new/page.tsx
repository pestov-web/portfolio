import type { Locale } from "@/shared/config/i18n";
import { createPost } from "../../actions";
import { TiptapEditor, ImageUpload } from "@/shared/ui";

export default async function NewPostPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const createPostWithLocale = createPost.bind(null, locale);

  return (
    <div className="page-container page-x fade-in">
      <div className="py-14 max-w-2xl">
        <h1 className="text-2xl font-bold mb-8">Новый пост</h1>

        <form action={createPostWithLocale} className="flex flex-col gap-5">
          {/* Обложка */}
          <ImageUpload name="coverImage" />

          {/* Заголовок */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium">Заголовок</label>
            <input
              id="title"
              name="title"
              type="text"
              required
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
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors resize-none"
            />
          </div>

          {/* Содержимое */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Содержимое</span>
            <TiptapEditor name="content" />
          </div>

          {/* Чекбоксы */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="published" className="accent-accent-vivid" />
              Опубликован
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="restricted" className="accent-accent-vivid" />
              Только для друзей
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-accent-vivid text-white text-sm font-medium rounded-md hover:bg-accent-dim transition-colors"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
