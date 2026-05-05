'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/shared/auth/server/index';
import { prisma } from '@/shared/lib/prisma';

export type CommentActionState = {
    error: string | null;
    submittedAt: number | null;
};

export const initialCommentActionState: CommentActionState = {
    error: null,
    submittedAt: null,
};

export async function addComment(
    postId: string,
    locale: string,
    _state: CommentActionState | void,
    formData: FormData,
): Promise<CommentActionState> {
    const t = await getTranslations({ locale, namespace: 'blog.comments' });
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return { error: t('loginRequired'), submittedAt: null };
    }

    const content = String(formData.get('content') ?? '').trim();
    if (content.length < 1) {
        return { error: t('errors.required'), submittedAt: null };
    }

    if (content.length > 2000) {
        return { error: t('errors.tooLong'), submittedAt: null };
    }

    await prisma.comment.create({
        data: {
            content,
            postId,
            userId: session.user.id,
        },
    });

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { translations: { where: { locale }, select: { slug: true } } },
    });
    const translation = post?.translations[0];
    if (translation) {
        revalidatePath(`/${locale}/blog/${translation.slug}`);
    }

    return { error: null, submittedAt: Date.now() };
}

export async function deleteComment(commentId: string, locale: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return;
    }

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: { post: { select: { translations: { where: { locale }, select: { slug: true } } } } },
    });

    if (!comment) {
        return;
    }

    const isOwner = comment.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
        return;
    }

    await prisma.comment.delete({ where: { id: commentId } });
    const translation = comment.post.translations[0];
    if (translation) {
        revalidatePath(`/${locale}/blog/${translation.slug}`);
    }
}
