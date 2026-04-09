"use server";

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/shared/auth/server/index";
import type { Locale } from "@/shared/config/index";
import { headers } from "next/headers";
import { deleteUploadedFileByUrl, uploadFile } from "@/shared/lib/minio";
import { localizePath } from "@/shared/lib/locale";
import { getOptionalFile, validateImageFile } from "@/shared/lib/upload";
import { randomUUID } from "crypto";
import { extname } from "path";
import type { AdminActionState } from "./action-state";

type ValidationResult<T> =
  | { value: T; error: null }
  | { value: null; error: string };

type AdminActionMessages = {
  fields: {
    title: string;
    excerpt: string;
    content: string;
    description: string;
    repository: string;
    demo: string;
    order: string;
    cover: string;
    role: string;
  };
  requiredField: (field: string) => string;
  tooLong: (field: string) => string;
  invalidUrl: (field: string) => string;
  invalidJson: (field: string) => string;
  invalidOrder: string;
  invalidRole: string;
  invalidImageType: string;
  imageTooLarge: string;
};

function ok<T>(value: T): ValidationResult<T> {
  return { value, error: null };
}

function fail<T>(error: string): ValidationResult<T> {
  return { value: null, error };
}

function toActionState(error: string): AdminActionState {
  return { error };
}

// Проверка прав модератора
async function requireAdmin(locale: Locale) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    redirect(localizePath(locale, "/login"));
  }
  return session;
}

// Из заголовка генерируем slug
function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function getAdminActionMessages(locale: Locale): Promise<AdminActionMessages> {
  const t = await getTranslations({ locale, namespace: "admin" });

  return {
    fields: {
      title: t("fields.title"),
      excerpt: t("fields.excerpt"),
      content: t("fields.content"),
      description: t("fields.description"),
      repository: t("fields.repository"),
      demo: t("fields.demo"),
      order: t("fields.order"),
      cover: t("fields.cover"),
      role: t("usersPage.title"),
    },
    requiredField: (field) => t("errors.requiredField", { field }),
    tooLong: (field) => t("errors.tooLong", { field }),
    invalidUrl: (field) => t("errors.invalidUrl", { field }),
    invalidJson: (field) => t("errors.invalidJson", { field }),
    invalidOrder: t("errors.invalidOrder"),
    invalidRole: t("errors.invalidRole"),
    invalidImageType: t("errors.invalidImageType"),
    imageTooLarge: t("errors.imageTooLarge"),
  };
}

function requireString(formData: FormData, field: string, label: string, messages: AdminActionMessages, maxLength = 500): ValidationResult<string> {
  const value = String(formData.get(field) ?? "").trim();

  if (!value) {
    return fail(messages.requiredField(label));
  }

  if (value.length > maxLength) {
    return fail(messages.tooLong(label));
  }

  return ok(value);
}

function getOptionalString(formData: FormData, label: string, field: string, messages: AdminActionMessages, maxLength = 5_000): ValidationResult<string | null> {
  const value = String(formData.get(field) ?? "").trim();

  if (!value) {
    return ok(null);
  }

  if (value.length > maxLength) {
    return fail(messages.tooLong(label));
  }

  return ok(value);
}

function getOptionalUrl(formData: FormData, label: string, field: string, messages: AdminActionMessages): ValidationResult<string | null> {
  const value = getOptionalString(formData, label, field, messages, 2_000);

  if (value.error) {
    return value;
  }

  if (!value.value) {
    return ok(null);
  }

  try {
    const url = new URL(value.value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return fail(messages.invalidUrl(label));
    }

    return ok(url.toString());
  } catch {
    return fail(messages.invalidUrl(label));
  }
}

function getRequiredEditorContent(formData: FormData, label: string, field: string, messages: AdminActionMessages): ValidationResult<string> {
  const value = String(formData.get(field) ?? "{}").trim() || "{}";

  try {
    JSON.parse(value);
    return ok(value);
  } catch {
    return fail(messages.invalidJson(label));
  }
}

function getOptionalEditorContent(formData: FormData, label: string, field: string, messages: AdminActionMessages): ValidationResult<string | null> {
  const value = String(formData.get(field) ?? "").trim();

  if (!value) {
    return ok(null);
  }

  try {
    JSON.parse(value);
    return ok(value);
  } catch {
    return fail(messages.invalidJson(label));
  }
}

function getOrder(formData: FormData, messages: AdminActionMessages): ValidationResult<number> {
  const rawValue = String(formData.get("order") ?? "0").trim();
  const value = Number(rawValue);

  if (!Number.isInteger(value) || value < 0) {
    return fail(messages.invalidOrder);
  }

  return ok(value);
}

async function resolveCoverImage(formData: FormData, fieldName: string, messages: AdminActionMessages): Promise<ValidationResult<string | null>> {
  const existingUrl = getOptionalUrl(formData, messages.fields.cover, fieldName, messages);
  if (existingUrl.error) {
    return existingUrl;
  }

  const file = getOptionalFile(formData, `${fieldName}File`);

  if (!file) {
    return ok(existingUrl.value);
  }

  try {
    validateImageFile(file, {
      invalidType: messages.invalidImageType,
      tooLarge: messages.imageTooLarge,
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : messages.invalidImageType);
  }

  const extension = extname(file.name) || ".jpg";
  const objectName = `uploads/${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  return ok(await uploadFile(buffer, objectName, file.type));
}

// ─── Создание поста ───────────────────────────────────────────────────────────
export async function createPost(locale: Locale, _state: AdminActionState | void, formData: FormData): Promise<AdminActionState> {
  await requireAdmin(locale);
  const messages = await getAdminActionMessages(locale);

  const title = requireString(formData, "title", messages.fields.title, messages, 200);
  if (title.error) return toActionState(title.error);

  const excerpt = getOptionalString(formData, messages.fields.excerpt, "excerpt", messages, 500);
  if (excerpt.error) return toActionState(excerpt.error);

  const content = getRequiredEditorContent(formData, messages.fields.content, "content", messages);
  if (content.error) return toActionState(content.error);

  const coverImage = await resolveCoverImage(formData, "coverImage", messages);
  if (coverImage.error) return toActionState(coverImage.error);

  const published = formData.get("published") === "on";
  const restricted = formData.get("restricted") === "on";
  const titleValue = title.value ?? "";
  const slug = toSlug(titleValue) || `post-${Date.now()}`;

  await prisma.post.create({
    data: {
      title: titleValue,
      slug,
      excerpt: excerpt.value,
      content: content.value ?? "{}",
      coverImage: coverImage.value,
      published,
      restricted,
    },
  });

  redirect(localizePath(locale, "/admin/posts"));
}

// ─── Обновление поста ─────────────────────────────────────────────────────────
export async function updatePost(id: string, locale: Locale, _state: AdminActionState | void, formData: FormData): Promise<AdminActionState> {
  await requireAdmin(locale);
  const messages = await getAdminActionMessages(locale);

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { coverImage: true },
  });

  const title = requireString(formData, "title", messages.fields.title, messages, 200);
  if (title.error) return toActionState(title.error);

  const excerpt = getOptionalString(formData, messages.fields.excerpt, "excerpt", messages, 500);
  if (excerpt.error) return toActionState(excerpt.error);

  const content = getRequiredEditorContent(formData, messages.fields.content, "content", messages);
  if (content.error) return toActionState(content.error);

  const coverImage = await resolveCoverImage(formData, "coverImage", messages);
  if (coverImage.error) return toActionState(coverImage.error);

  const published = formData.get("published") === "on";
  const restricted = formData.get("restricted") === "on";
  const titleValue = title.value ?? "";

  await prisma.post.update({
    where: { id },
    data: {
      title: titleValue,
      excerpt: excerpt.value,
      content: content.value ?? "{}",
      coverImage: coverImage.value,
      published,
      restricted,
    },
  });

  if (existingPost?.coverImage && existingPost.coverImage !== coverImage.value) {
    await deleteUploadedFileByUrl(existingPost.coverImage);
  }

  redirect(localizePath(locale, "/admin/posts"));
}

// ─── Удаление поста ───────────────────────────────────────────────────────────
export async function deletePost(id: string, locale: Locale) {
  await requireAdmin(locale);

  const post = await prisma.post.findUnique({
    where: { id },
    select: { coverImage: true },
  });

  await prisma.post.delete({ where: { id } });

  await deleteUploadedFileByUrl(post?.coverImage);
  redirect(localizePath(locale, "/admin/posts"));
}

// ─── Создание проекта ─────────────────────────────────────────────────────────
export async function createProject(locale: Locale, _state: AdminActionState | void, formData: FormData): Promise<AdminActionState> {
  await requireAdmin(locale);
  const messages = await getAdminActionMessages(locale);

  const title = requireString(formData, "title", messages.fields.title, messages, 200);
  if (title.error) return toActionState(title.error);

  const description = getOptionalString(formData, messages.fields.description, "description", messages, 1_000);
  if (description.error) return toActionState(description.error);

  const content = getOptionalEditorContent(formData, messages.fields.content, "content", messages);
  if (content.error) return toActionState(content.error);

  const coverImage = await resolveCoverImage(formData, "coverImage", messages);
  if (coverImage.error) return toActionState(coverImage.error);

  const repoUrl = getOptionalUrl(formData, messages.fields.repository, "repoUrl", messages);
  if (repoUrl.error) return toActionState(repoUrl.error);

  const demoUrl = getOptionalUrl(formData, messages.fields.demo, "demoUrl", messages);
  if (demoUrl.error) return toActionState(demoUrl.error);

  const published = formData.get("published") === "on";
  const order = getOrder(formData, messages);
  if (order.error) return toActionState(order.error);

  const titleValue = title.value ?? "";
  const slug = toSlug(titleValue) || `project-${Date.now()}`;

  await prisma.project.create({
    data: {
      title: titleValue,
      slug,
      description: description.value,
      content: content.value,
      coverImage: coverImage.value,
      repoUrl: repoUrl.value,
      demoUrl: demoUrl.value,
      published,
      order: order.value ?? 0,
    },
  });

  redirect(localizePath(locale, "/admin/projects"));
}

// ─── Обновление проекта ───────────────────────────────────────────────────────
export async function updateProject(id: string, locale: Locale, _state: AdminActionState | void, formData: FormData): Promise<AdminActionState> {
  await requireAdmin(locale);
  const messages = await getAdminActionMessages(locale);

  const existingProject = await prisma.project.findUnique({
    where: { id },
    select: { coverImage: true },
  });

  const title = requireString(formData, "title", messages.fields.title, messages, 200);
  if (title.error) return toActionState(title.error);

  const description = getOptionalString(formData, messages.fields.description, "description", messages, 1_000);
  if (description.error) return toActionState(description.error);

  const content = getOptionalEditorContent(formData, messages.fields.content, "content", messages);
  if (content.error) return toActionState(content.error);

  const coverImage = await resolveCoverImage(formData, "coverImage", messages);
  if (coverImage.error) return toActionState(coverImage.error);

  const repoUrl = getOptionalUrl(formData, messages.fields.repository, "repoUrl", messages);
  if (repoUrl.error) return toActionState(repoUrl.error);

  const demoUrl = getOptionalUrl(formData, messages.fields.demo, "demoUrl", messages);
  if (demoUrl.error) return toActionState(demoUrl.error);

  const published = formData.get("published") === "on";
  const order = getOrder(formData, messages);
  if (order.error) return toActionState(order.error);
  const titleValue = title.value ?? "";

  await prisma.project.update({
    where: { id },
    data: {
      title: titleValue,
      description: description.value,
      content: content.value,
      coverImage: coverImage.value,
      repoUrl: repoUrl.value,
      demoUrl: demoUrl.value,
      published,
      order: order.value ?? 0,
    },
  });

  if (existingProject?.coverImage && existingProject.coverImage !== coverImage.value) {
    await deleteUploadedFileByUrl(existingProject.coverImage);
  }

  redirect(localizePath(locale, "/admin/projects"));
}

// ─── Удаление проекта ─────────────────────────────────────────────────────────
export async function deleteProject(id: string, locale: Locale) {
  await requireAdmin(locale);

  const project = await prisma.project.findUnique({
    where: { id },
    select: { coverImage: true },
  });

  await prisma.project.delete({ where: { id } });

  await deleteUploadedFileByUrl(project?.coverImage);
  redirect(localizePath(locale, "/admin/projects"));
}

// ─── Изменение роли пользователя ──────────────────────────────────────────────
export async function updateUserRole(userId: string, locale: Locale, _state: AdminActionState | void, formData: FormData): Promise<AdminActionState> {
  await requireAdmin(locale);
  const messages = await getAdminActionMessages(locale);

  const role = formData.get("role");
  if (role !== "USER" && role !== "FRIEND" && role !== "ADMIN") {
    return toActionState(messages.invalidRole);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  redirect(localizePath(locale, "/admin/users"));
}
