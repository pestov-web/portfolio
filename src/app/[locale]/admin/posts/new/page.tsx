import type { Locale } from '@/shared/config/index';
import { getTranslations } from 'next-intl/server';
import { createPost } from '../../actions';
import { prisma } from '@/shared/lib/prisma';
import { Button, CheckboxField, Field, FormActions, PageHeader, TextArea, TextInput } from '@/shared/ui';
import { TiptapEditor } from '@/shared/ui/tiptap-editor';
import { ImageUpload } from '@/shared/ui/image-upload';
import { ActionForm } from '../../action-form';
import { AutoSlugField } from '../../slug-field';
import { AdminTagSelector } from '../../tag-selector';

export default async function NewPostPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations('admin');
    const createPostWithLocale = createPost.bind(null, locale);
    const tags = await prisma.tag.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    return (
        <div className='page-container page-x fade-in'>
            <div className='py-14 max-w-2xl'>
                <PageHeader title={t('postsForm.newTitle')} size='md' />
                <p className='mb-5 text-sm text-faint'>{t('translationHint', { locale: locale.toUpperCase() })}</p>

                <ActionForm action={createPostWithLocale} className='flex flex-col gap-5'>
                    {/* Обложка */}
                    <ImageUpload name='coverImage' />

                    {/* Заголовок */}
                    <Field label={t('fields.title')} htmlFor='title'>
                        <TextInput id='title' name='title' type='text' required />
                    </Field>

                    <Field label={t('fields.slug')} htmlFor='slug'>
                        <AutoSlugField id='slug' sourceFieldName='title' generateLabel={t('generateSlug')} />
                    </Field>

                    {/* Анонс */}
                    <Field label={t('fields.excerpt')} htmlFor='excerpt'>
                        <TextArea id='excerpt' name='excerpt' rows={3} />
                    </Field>

                    {/* Содержимое */}
                    <Field label={t('fields.content')}>
                        <TiptapEditor name='content' />
                    </Field>

                    <Field label={t('fields.tags')}>
                        <AdminTagSelector
                            fieldName='tagIds'
                            tags={tags}
                            selectedLabel={t('tags.selected')}
                            emptyLabel={t('tags.empty')}
                            availableLabel={t('tags.available')}
                            noAvailableLabel={t('tags.noneAvailable')}
                        />
                    </Field>

                    {/* Чекбоксы */}
                    <div className='flex gap-6'>
                        <CheckboxField name='published' label={t('published')} />
                        <CheckboxField name='restricted' label={t('restricted')} />
                    </div>

                    <FormActions>
                        <Button type='submit' variant='primary' className='px-5'>
                            {t('postsForm.create')}
                        </Button>
                    </FormActions>
                </ActionForm>
            </div>
        </div>
    );
}
