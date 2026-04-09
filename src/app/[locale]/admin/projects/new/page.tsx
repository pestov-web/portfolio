import type { Locale } from "@/shared/config/index";
import { getTranslations } from "next-intl/server";
import { createProject } from "../../actions";
import { PageHeader } from "@/shared/ui/page-header";
import { Button, CheckboxField, Field, FormActions, TiptapEditor, ImageUpload, TextArea, TextInput } from "@/shared/ui";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin");
  const createProjectWithLocale = createProject.bind(null, locale);

  return (
    <div className="page-container page-x fade-in">
      <div className="py-14 max-w-2xl">
        <PageHeader title={t("projectsForm.newTitle")} size="md" />

        <form action={createProjectWithLocale} className="flex flex-col gap-5">
          {/* Обложка */}
          <ImageUpload name="coverImage" />

          {/* Название */}
          <Field label={t("fields.title")} htmlFor="title">
            <TextInput
              id="title"
              name="title"
              type="text"
              required
            />
          </Field>

          {/* Описание */}
          <Field label={t("fields.description")} htmlFor="description">
            <TextArea
              id="description"
              name="description"
              rows={3}
            />
          </Field>

          {/* Ссылки */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t("fields.repository")} htmlFor="repoUrl">
              <TextInput
                id="repoUrl"
                name="repoUrl"
                type="url"
                placeholder="https://github.com/..."
              />
            </Field>
            <Field label={t("fields.demo")} htmlFor="demoUrl">
              <TextInput
                id="demoUrl"
                name="demoUrl"
                type="url"
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
              defaultValue={0}
              min={0}
            />
          </Field>

          {/* Содержимое */}
          <Field label={t("fields.content")}>
            <TiptapEditor name="content" />
          </Field>

          {/* Чекбокс */}
          <CheckboxField name="published" label={t("published")} />

          <FormActions>
            <Button
              type="submit"
              variant="primary"
              className="px-5"
            >
              {t("projectsForm.create")}
            </Button>
          </FormActions>
        </form>
      </div>
    </div>
  );
}
