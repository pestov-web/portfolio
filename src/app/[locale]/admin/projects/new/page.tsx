import type { Locale } from "@/shared/config/i18n";
import { createProject } from "../../actions";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await params;

  return (
    <div className="page-container page-x fade-in">
      <div className="py-14 max-w-2xl">
        <h1 className="text-2xl font-bold mb-8">Новый проект</h1>

        <form action={createProject} className="flex flex-col gap-5">
          {/* Название */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium">Название</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="h-10 rounded-md border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors"
            />
          </div>

          {/* Описание */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium">Описание</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors resize-none"
            />
          </div>

          {/* Ссылки */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="repoUrl" className="text-sm font-medium">Репозиторий</label>
              <input
                id="repoUrl"
                name="repoUrl"
                type="url"
                placeholder="https://github.com/..."
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="demoUrl" className="text-sm font-medium">Демо</label>
              <input
                id="demoUrl"
                name="demoUrl"
                type="url"
                placeholder="https://..."
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors"
              />
            </div>
          </div>

          {/* Порядок */}
          <div className="flex flex-col gap-1.5 w-32">
            <label htmlFor="order" className="text-sm font-medium">Порядок</label>
            <input
              id="order"
              name="order"
              type="number"
              defaultValue={0}
              min={0}
              className="h-10 rounded-md border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors"
            />
          </div>

          {/* Чекбокс */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="published" className="accent-accent-vivid" />
            Опубликован
          </label>

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
