import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { auth } from '@/shared/auth/server/index';
import type { Locale } from '@/shared/config/index';
import { prisma } from '@/shared/lib/prisma';
import { Badge, Button, ConfirmSubmitButton, Field, ListRow, PageHeader, TextInput } from '@/shared/ui';
import { ActionForm } from '../action-form';
import { createTag, deleteTag, updateTag } from '../actions';
import { AutoSlugField } from '../slug-field';

export default async function AdminTagsPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations('admin');

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== 'ADMIN') notFound();

    const tags = await prisma.tag.findMany({
        orderBy: { name: 'asc' },
        select: {
            id: true,
            name: true,
            slug: true,
            _count: {
                select: {
                    posts: true,
                    projects: true,
                },
            },
        },
    });

    const createTagWithLocale = createTag.bind(null, locale);

    return (
        <div className='page-container page-x fade-in'>
            <div className='py-14'>
                <PageHeader
                    title={t('tagsPage.title')}
                    description={t('tagsPage.count', { count: tags.length })}
                    eyebrow={
                        <>
                            <span className='text-accent'>$</span> sudo tags --list
                        </>
                    }
                    size='md'
                />

                <ActionForm
                    action={createTagWithLocale}
                    className='mb-8 grid gap-3 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end'
                >
                    <Field label={t('tagsPage.nameLabel')} htmlFor='new-tag-name'>
                        <TextInput id='new-tag-name' name='name' type='text' required maxLength={80} />
                    </Field>
                    <Field label={t('fields.slug')} htmlFor='new-tag-slug'>
                        <AutoSlugField
                            id='new-tag-slug'
                            name='slug'
                            maxLength={80}
                            sourceFieldName='name'
                            generateLabel={t('generateSlug')}
                        />
                    </Field>
                    <Button type='submit' variant='primary' className='sm:min-w-32'>
                        {t('tagsPage.create')}
                    </Button>
                </ActionForm>

                {tags.length === 0 ? (
                    <p className='text-sm text-faint'>{t('tagsPage.empty')}</p>
                ) : (
                    <div className='flex flex-col gap-2'>
                        {tags.map((tag) => {
                            const updateTagWithId = updateTag.bind(null, tag.id, locale);
                            const deleteTagWithId = deleteTag.bind(null, tag.id, locale);
                            const usageCount = tag._count.posts + tag._count.projects;

                            return (
                                <ListRow key={tag.id} layout='responsive' padding='comfortable'>
                                    <div className='flex min-w-0 flex-1 flex-col gap-2'>
                                        <div className='flex flex-wrap items-center gap-2'>
                                            <Badge variant='accent'>{tag.name}</Badge>
                                            <span className='text-xs text-faint'>/{tag.slug}</span>
                                        </div>
                                        <p className='text-xs text-faint'>
                                            {t('tagsPage.usage', {
                                                total: usageCount,
                                                posts: tag._count.posts,
                                                projects: tag._count.projects,
                                            })}
                                        </p>
                                    </div>

                                    <div className='flex w-full flex-col gap-3 sm:w-auto sm:min-w-md'>
                                        <ActionForm
                                            action={updateTagWithId}
                                            className='grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center'
                                        >
                                            <TextInput
                                                name='name'
                                                type='text'
                                                defaultValue={tag.name}
                                                required
                                                maxLength={80}
                                                className='sm:min-w-64'
                                                aria-label={t('tagsPage.renameAriaLabel', { tag: tag.name })}
                                            />
                                            <AutoSlugField
                                                id={`tag-slug-${tag.id}`}
                                                name='slug'
                                                defaultValue={tag.slug}
                                                required
                                                maxLength={80}
                                                sourceFieldName='name'
                                                generateLabel={t('generateSlug')}
                                                ariaLabel={t('fields.slug')}
                                            />
                                            <Button type='submit' variant='secondary' size='sm'>
                                                {t('save')}
                                            </Button>
                                        </ActionForm>

                                        <form action={deleteTagWithId} className='sm:self-end'>
                                            <ConfirmSubmitButton
                                                variant='danger'
                                                size='sm'
                                                title={t('confirmDeleteTitle')}
                                                description={t('tagsPage.confirmDelete', { tag: tag.name })}
                                                cancelLabel={t('cancel')}
                                                confirmLabel={t('delete')}
                                            >
                                                {t('delete')}
                                            </ConfirmSubmitButton>
                                        </form>
                                    </div>
                                </ListRow>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
