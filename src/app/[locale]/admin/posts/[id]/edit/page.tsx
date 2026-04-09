import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/config/index";
import { prisma } from "@/shared/lib/prisma";
import { updatePost, deletePost } from "../../../actions";
import { PageHeader } from "@/shared/ui/page-header";
import { Button, CheckboxField, Field, FormActions, TiptapEditor, ImageUpload, TextArea, TextInput } from "@/shared/ui";
import { ActionForm } from "../../../action-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations("admin");

  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, title: true, excerpt: true, content: true, coverImage: true, published: true, restricted: true },
  });

  if (!post) notFound();

  // Серверные action с привязкой id
  const updatePostWithId = updatePost.bind(null, post.id, locale);
  const deletePostWithId = deletePost.bind(null, post.id, locale);

  return (
    <div className="page-container page-x fade-in">
      <div className="py-14 max-w-2xl">
        <PageHeader title={t("postsForm.editTitle")} size="md" />

        <ActionForm action={updatePostWithId} className="flex flex-col gap-5">
          {/* Обложка */}
          <ImageUpload name="coverImage" defaultValue={post.coverImage ?? undefined} />

          {/* Заголовок */}
          <Field label={t("fields.title")} htmlFor="title">
            <TextInput
              id="title"
              name="title"
              type="text"
              required
              defaultValue={post.title}
            />
          </Field>

          {/* Анонс */}
          <Field label={t("fields.excerpt")} htmlFor="excerpt">
            <TextArea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={post.excerpt ?? ""}
            />
          </Field>

          {/* Содержимое */}
          <Field label={t("fields.content")}>
            <TiptapEditor name="content" defaultValue={post.content} />
          </Field>

          {/* Чекбоксы */}
          <div className="flex gap-6">
            <CheckboxField name="published" defaultChecked={post.published} label={t("published")} />
            <CheckboxField name="restricted" defaultChecked={post.restricted} label={t("restricted")} />
          </div>

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
        <form action={deletePostWithId} className="mt-10 pt-8 border-t border-border">
          <p className="text-sm text-muted mb-4">{t("dangerZone")}</p>
          <Button
            type="submit"
            variant="danger"
          >
            {t("postsForm.delete")}
          </Button>
        </form>
      </div>
    </div>
  );
}
