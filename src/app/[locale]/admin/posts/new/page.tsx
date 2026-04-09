import type { Locale } from "@/shared/config/index";
import { getTranslations } from "next-intl/server";
import { createPost } from "../../actions";
import { PageHeader } from "@/shared/ui/page-header";
import { Button, CheckboxField, Field, FormActions, TiptapEditor, ImageUpload, TextArea, TextInput } from "@/shared/ui";

export default async function NewPostPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin");
  const createPostWithLocale = createPost.bind(null, locale);

  return (
    <div className="page-container page-x fade-in">
      <div className="py-14 max-w-2xl">
        <PageHeader title={t("postsForm.newTitle")} size="md" />

        <form action={createPostWithLocale} className="flex flex-col gap-5">
          {/* Обложка */}
          <ImageUpload name="coverImage" />

          {/* Заголовок */}
          <Field label={t("fields.title")} htmlFor="title">
            <TextInput
              id="title"
              name="title"
              type="text"
              required
            />
          </Field>

          {/* Анонс */}
          <Field label={t("fields.excerpt")} htmlFor="excerpt">
            <TextArea
              id="excerpt"
              name="excerpt"
              rows={3}
            />
          </Field>

          {/* Содержимое */}
          <Field label={t("fields.content")}>
            <TiptapEditor name="content" />
          </Field>

          {/* Чекбоксы */}
          <div className="flex gap-6">
            <CheckboxField name="published" label={t("published")} />
            <CheckboxField name="restricted" label={t("restricted")} />
          </div>

          <FormActions>
            <Button
              type="submit"
              variant="primary"
              className="px-5"
            >
              {t("postsForm.create")}
            </Button>
          </FormActions>
        </form>
      </div>
    </div>
  );
}
