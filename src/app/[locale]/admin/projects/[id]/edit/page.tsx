import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/config/index";
import { prisma } from "@/shared/lib/prisma";
import { updateProject, deleteProject } from "../../../actions";
import { PageHeader } from "@/shared/ui/page-header";
import { Button, CheckboxField, Field, FormActions, TiptapEditor, ImageUpload, TextArea, TextInput } from "@/shared/ui";
import { ActionForm } from "../../../action-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations("admin");

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
        <PageHeader title={t("projectsForm.editTitle")} size="md" />

        <ActionForm action={updateProjectWithId} className="flex flex-col gap-5">
          {/* Обложка */}
          <ImageUpload name="coverImage" defaultValue={project.coverImage ?? undefined} />

          {/* Название */}
          <Field label={t("fields.title")} htmlFor="title">
            <TextInput
              id="title"
              name="title"
              type="text"
              required
              defaultValue={project.title}
            />
          </Field>

          {/* Описание */}
          <Field label={t("fields.description")} htmlFor="description">
            <TextArea
              id="description"
              name="description"
              rows={3}
              defaultValue={project.description ?? ""}
            />
          </Field>

          {/* Ссылки */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t("fields.repository")} htmlFor="repoUrl">
              <TextInput
                id="repoUrl"
                name="repoUrl"
                type="url"
                defaultValue={project.repoUrl ?? ""}
                placeholder="https://github.com/..."
              />
            </Field>
            <Field label={t("fields.demo")} htmlFor="demoUrl">
              <TextInput
                id="demoUrl"
                name="demoUrl"
                type="url"
                defaultValue={project.demoUrl ?? ""}
                placeholder="https://..."
              />
            </Field>
          </div>

          {/* Порядок */}
          <Field label={t("fields.order")} htmlFor="order" className="w-32">
            <TextInput
              id="order"
              name="order"
              type="number"
              defaultValue={project.order}
              min={0}
            />
          </Field>

          {/* Содержимое */}
          <Field label={t("fields.content")}>
            <TiptapEditor name="content" defaultValue={project.content ?? undefined} />
          </Field>

          {/* Чекбокс */}
          <CheckboxField name="published" defaultChecked={project.published} label={t("published")} />

          <FormActions>
            <Button
              type="submit"
              variant="primary"
              className="px-5"
            >
              {t("save")}
            </Button>
          </FormActions>
        </ActionForm>

        {/* Удалить */}
        <form action={deleteProjectWithId} className="mt-10 pt-8 border-t border-border">
          <p className="text-sm text-muted mb-4">{t("dangerZone")}</p>
          <Button
            type="submit"
            variant="danger"
          >
            {t("projectsForm.delete")}
          </Button>
        </form>
      </div>
    </div>
  );
}
