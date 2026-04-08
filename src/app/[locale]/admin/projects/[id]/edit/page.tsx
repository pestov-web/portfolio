import { notFound } from "next/navigation";
import type { Locale } from "@/shared/config/index";
import { prisma } from "@/shared/lib/prisma";
import { updateProject, deleteProject } from "../../../actions";
import { TiptapEditor, ImageUpload } from "@/shared/ui";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { id, locale } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true, title: true, description: true, content: true,
      coverImage: true, repoUrl: true, demoUrl: true, published: true, order: true,
    },
  });

  if (!project) notFound();

  const updateProjectWithId = updateProject.bind(null, project.id, locale);
  const deleteProjectWithId = deleteProject.bind(null, project.id, locale);

  return (
    <div className="page-container page-x fade-in">
      <div className="py-14 max-w-2xl">
        <h1 className="text-2xl font-bold mb-8">Редактировать проект</h1>

        <form action={updateProjectWithId} className="flex flex-col gap-5">
          {/* Обложка */}
          <ImageUpload name="coverImage" defaultValue={project.coverImage ?? undefined} />

          {/* Название */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium">Название</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={project.title}
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
              defaultValue={project.description ?? ""}
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
                defaultValue={project.repoUrl ?? ""}
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
                defaultValue={project.demoUrl ?? ""}
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
              defaultValue={project.order}
              min={0}
              className="h-10 rounded-md border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors"
            />
          </div>

          {/* Содержимое */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Содержимое</span>
            <TiptapEditor name="content" defaultValue={project.content ?? undefined} />
          </div>

          {/* Чекбокс */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="published" defaultChecked={project.published} className="accent-accent-vivid" />
            Опубликован
          </label>

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
        <form action={deleteProjectWithId} className="mt-10 pt-8 border-t border-border">
          <p className="text-sm text-muted mb-4">Опасная зона — удаление необратимо.</p>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500/30 rounded-md hover:bg-red-500/10 transition-colors"
          >
            Удалить проект
          </button>
        </form>
      </div>
    </div>
  );
}
