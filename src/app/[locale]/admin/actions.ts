"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/shared/config/auth";
import { headers } from "next/headers";

// Проверка прав модератора
async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    redirect("/ru/login");
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
export async function createPost(formData: FormData) {
  await requireAdmin();

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

  redirect("/ru/admin/posts");
}

// ─── Обновление поста ─────────────────────────────────────────────────────────
export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();

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

  redirect("/ru/admin/posts");
}

// ─── Удаление поста ───────────────────────────────────────────────────────────
export async function deletePost(id: string) {
  await requireAdmin();
  await prisma.post.delete({ where: { id } });
  redirect("/ru/admin/posts");
}

// ─── Создание проекта ─────────────────────────────────────────────────────────
export async function createProject(formData: FormData) {
  await requireAdmin();

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

  redirect("/ru/admin/projects");
}

// ─── Обновление проекта ───────────────────────────────────────────────────────
export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();

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

  redirect("/ru/admin/projects");
}

// ─── Удаление проекта ─────────────────────────────────────────────────────────
export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  redirect("/ru/admin/projects");
}

// ─── Изменение роли пользователя ──────────────────────────────────────────────
export async function updateUserRole(userId: string, formData: FormData) {
  await requireAdmin();

  const role = formData.get("role");
  if (role !== "USER" && role !== "FRIEND" && role !== "ADMIN") {
    throw new Error("Недопустимая роль");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  redirect("/ru/admin/users");
}
