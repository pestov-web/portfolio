"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/shared/auth/server/index";
import { prisma } from "@/shared/lib/prisma";

export async function addComment(postId: string, locale: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const content = String(formData.get("content") ?? "").trim();
  if (content.length < 1 || content.length > 2000) {
    return;
  }

  await prisma.comment.create({
    data: {
      content,
      postId,
      userId: session.user.id,
    },
  });

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { slug: true } });
  if (post) {
    revalidatePath(`/${locale}/blog/${post.slug}`);
  }
}

export async function deleteComment(commentId: string, locale: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: { select: { slug: true } } },
  });

  if (!comment) {
    return;
  }

  const isOwner = comment.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return;
  }

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/${locale}/blog/${comment.post.slug}`);
}