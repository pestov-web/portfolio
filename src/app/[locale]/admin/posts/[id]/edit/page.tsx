import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/shared/config/index';
import { prisma } from '@/shared/lib/prisma';
import { updatePost, deletePost } from '../../../actions';
import { AdminTagSelector } from '../../../tag-selector';

import {
    Button,
    CheckboxField,
    Field,
    FormActions,
    PageHeader,
    TextArea,
    TextInput,
} from '@/shared/ui';
import { ConfirmSubmitButton } from '@/shared/ui/confirm-submit-button';
import { TiptapEditor } from '@/shared/ui/tiptap-editor';
import { ImageUpload } from '@/shared/ui/image-upload';
import { ActionForm } from '../../../action-form';
import { AutoSlugField } from '../../../slug-field';

export default async function EditPostPage({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
    const { id, locale } = await params;
    const t = await getTranslations('admin');

    const post = await prisma.post.findUnique({
        where: { id },
        select: {
            id: true,
            coverImage: true,
            published: true,
            restricted: true,
            translations: {
                where: { locale },
                select: {
                    title: true,
                    slug: true,
                    excerpt: true,
                    content: true,
                },
            },
            tags: {
                select: {
                    tagId: true,
                },
            },
        },
    });

    const tags = await prisma.tag.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    if (!post) notFound();
    const translation = post.translations[0] ?? null;

    // Серверные action с привязкой id
    const updatePostWithId = updatePost.bind(null, post.id, locale);
    const deletePostWithId = deletePost.bind(null, post.id, locale);

    return (
        <div className='page-container page-x fade-in'>
            <div className='py-14 max-w-2xl'>
                <PageHeader title={t('postsForm.editTitle')} size='md' />
                <p className='mb-2 text-sm text-faint'>{t('translationHint', { locale: locale.toUpperCase() })}</p>
                {!translation ? <p className='mb-5 text-sm text-accent'>{t('translationMissing')}</p> : null}

                <ActionForm action={updatePostWithId} className='flex flex-col gap-5'>
                    {/* Обложка */}
                    <ImageUpload name='coverImage' defaultValue={post.coverImage ?? undefined} />

                    {/* Заголовок */}
                    <Field label={t('fields.title')} htmlFor='title'>
                        <TextInput
                            id='title'
                            name='title'
                            type='text'
                            required
                            defaultValue={translation?.title ?? ''}
                        />
                    </Field>

                    <Field label={t('fields.slug')} htmlFor='slug'>
                        <AutoSlugField
                            id='slug'
                            name='slug'
                            required
                            defaultValue={translation?.slug ?? ''}
                            sourceFieldName='title'
                            generateLabel={t('generateSlug')}
                        />
                    </Field>

                    {/* Анонс */}
                    <Field label={t('fields.excerpt')} htmlFor='excerpt'>
                        <TextArea id='excerpt' name='excerpt' rows={3} defaultValue={translation?.excerpt ?? ''} />
                    </Field>

                    {/* Содержимое */}
                    <Field label={t('fields.content')}>
                        <TiptapEditor name='content' defaultValue={translation?.content ?? undefined} />
                    </Field>

                    <Field label={t('fields.tags')}>
                        <AdminTagSelector
                            fieldName='tagIds'
                            tags={tags}
                            defaultSelectedTagIds={post.tags.map((tag) => tag.tagId)}
                            selectedLabel={t('tags.selected')}
                            emptyLabel={t('tags.empty')}
                            availableLabel={t('tags.available')}
                            noAvailableLabel={t('tags.noneAvailable')}
                        />
                    </Field>

                    {/* Чекбоксы */}
                    <div className='flex gap-6'>
                        <CheckboxField name='published' defaultChecked={post.published} label={t('published')} />
                        <CheckboxField name='restricted' defaultChecked={post.restricted} label={t('restricted')} />
                    </div>

                    <FormActions>
                        <Button type='submit' variant='primary' className='px-5'>
                            {t('save')}
                        </Button>
                    </FormActions>
                </ActionForm>

                {/* Удалить */}
                <form action={deletePostWithId} className='mt-10 pt-8 border-t border-border'>
                    <p className='text-sm text-muted mb-4'>{t('dangerZone')}</p>
                    <ConfirmSubmitButton
                        variant='danger'
                        title={t('confirmDeleteTitle')}
                        description={t('postsForm.confirmDelete')}
                        cancelLabel={t('cancel')}
                        confirmLabel={t('postsForm.delete')}
                    >
                        {t('postsForm.delete')}
                    </ConfirmSubmitButton>
                </form>
            </div>
        </div>
    );
}
