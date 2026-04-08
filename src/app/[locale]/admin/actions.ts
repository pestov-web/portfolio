"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/shared/config/auth";
import { headers } from "next/headers";
import { deleteUploadedFileByUrl } from "@/shared/lib/minio";
import { localizePath } from "@/shared/lib/locale";
import type { Locale } from "@/shared/config/i18n";

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

// ─── Создание поста ───────────────────────────────────────────────────────────
export async function createPost(locale: Locale, formData: FormData) {
  await requireAdmin(locale);

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "{}") || "{}";
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const restricted = formData.get("restricted") === "on";
  const slug = toSlug(title) || `post-${Date.now()}`;

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      published,
      restricted,
    },
  });

  redirect(localizePath(locale, "/admin/posts"));
}

// ─── Обновление поста ─────────────────────────────────────────────────────────
export async function updatePost(id: string, locale: Locale, formData: FormData) {
  await requireAdmin(locale);

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { coverImage: true },
  });

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "{}") || "{}";
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const restricted = formData.get("restricted") === "on";

  await prisma.post.update({
    where: { id },
    data: { title, excerpt, content, coverImage, published, restricted },
  });

  if (existingPost?.coverImage && existingPost.coverImage !== coverImage) {
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
export async function createProject(locale: Locale, formData: FormData) {
  await requireAdmin(locale);

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "") || null;
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const repoUrl = String(formData.get("repoUrl") ?? "").trim() || null;
  const demoUrl = String(formData.get("demoUrl") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const order = Number(formData.get("order")) || 0;
  const slug = toSlug(title) || `project-${Date.now()}`;

  await prisma.project.create({
    data: {
      title,
      slug,
      description,
      content,
      coverImage,
      repoUrl,
      demoUrl,
      published,
      order,
    },
  });

  redirect(localizePath(locale, "/admin/projects"));
}

// ─── Обновление проекта ───────────────────────────────────────────────────────
export async function updateProject(id: string, locale: Locale, formData: FormData) {
  await requireAdmin(locale);

  const existingProject = await prisma.project.findUnique({
    where: { id },
    select: { coverImage: true },
  });

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "") || null;
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const repoUrl = String(formData.get("repoUrl") ?? "").trim() || null;
  const demoUrl = String(formData.get("demoUrl") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const order = Number(formData.get("order")) || 0;

  await prisma.project.update({
    where: { id },
    data: { title, description, content, coverImage, repoUrl, demoUrl, published, order },
  });

  if (existingProject?.coverImage && existingProject.coverImage !== coverImage) {
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
export async function updateUserRole(userId: string, locale: Locale, formData: FormData) {
  await requireAdmin(locale);

  const role = formData.get("role");
  if (role !== "USER" && role !== "FRIEND" && role !== "ADMIN") {
    throw new Error("Недопустимая роль");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  redirect(localizePath(locale, "/admin/users"));
}
