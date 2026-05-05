import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/shared/config/index';
import { prisma } from '@/shared/lib/prisma';
import { updateProject, deleteProject } from '../../../actions';
import { AdminTagSelector } from '../../../tag-selector';
import { PageHeader } from '@/shared/ui/page-header';
import {
    Button,
    CheckboxField,
    ConfirmSubmitButton,
    Field,
    FormActions,
    TiptapEditor,
    ImageUpload,
    TextArea,
    TextInput,
} from '@/shared/ui';
import { ActionForm } from '../../../action-form';
import { AutoSlugField } from '../../../slug-field';

export default async function EditProjectPage({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
    const { id, locale } = await params;
    const t = await getTranslations('admin');

    const project = await prisma.project.findUnique({
        where: { id },
        select: {
            id: true,
            coverImage: true,
            repoUrl: true,
            demoUrl: true,
            published: true,
            order: true,
            translations: {
                where: { locale },
                select: {
                    title: true,
                    slug: true,
                    description: true,
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

    if (!project) notFound();
    const translation = project.translations[0] ?? null;

    const updateProjectWithId = updateProject.bind(null, project.id, locale);
    const deleteProjectWithId = deleteProject.bind(null, project.id, locale);

    return (
        <div className='page-container page-x fade-in'>
            <div className='py-14 max-w-2xl'>
                <PageHeader title={t('projectsForm.editTitle')} size='md' />
                <p className='mb-2 text-sm text-faint'>{t('translationHint', { locale: locale.toUpperCase() })}</p>
                {!translation ? <p className='mb-5 text-sm text-accent'>{t('translationMissing')}</p> : null}

                <ActionForm action={updateProjectWithId} className='flex flex-col gap-5'>
                    {/* Обложка */}
                    <ImageUpload name='coverImage' defaultValue={project.coverImage ?? undefined} />

                    {/* Название */}
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

                    {/* Описание */}
                    <Field label={t('fields.description')} htmlFor='description'>
                        <TextArea
                            id='description'
                            name='description'
                            rows={3}
                            defaultValue={translation?.description ?? ''}
                        />
                    </Field>

                    {/* Ссылки */}
                    <div className='grid sm:grid-cols-2 gap-4'>
                        <Field label={t('fields.repository')} htmlFor='repoUrl'>
                            <TextInput
                                id='repoUrl'
                                name='repoUrl'
                                type='url'
                                defaultValue={project.repoUrl ?? ''}
                                placeholder='https://github.com/...'
                            />
                        </Field>
                        <Field label={t('fields.demo')} htmlFor='demoUrl'>
                            <TextInput
                                id='demoUrl'
                                name='demoUrl'
                                type='url'
                                defaultValue={project.demoUrl ?? ''}
                                placeholder='https://...'
                            />
                        </Field>
                    </div>

                    {/* Порядок */}
                    <Field label={t('fields.order')} htmlFor='order' className='w-32'>
                        <TextInput id='order' name='order' type='number' defaultValue={project.order} min={0} />
                    </Field>

                    {/* Содержимое */}
                    <Field label={t('fields.content')}>
                        <TiptapEditor name='content' defaultValue={translation?.content ?? undefined} />
                    </Field>

                    <Field label={t('fields.tags')}>
                        <AdminTagSelector
                            fieldName='tagIds'
                            tags={tags}
                            defaultSelectedTagIds={project.tags.map((tag) => tag.tagId)}
                            selectedLabel={t('tags.selected')}
                            emptyLabel={t('tags.empty')}
                            availableLabel={t('tags.available')}
                            noAvailableLabel={t('tags.noneAvailable')}
                        />
                    </Field>

                    {/* Чекбокс */}
                    <CheckboxField name='published' defaultChecked={project.published} label={t('published')} />

                    <FormActions>
                        <Button type='submit' variant='primary' className='px-5'>
                            {t('save')}
                        </Button>
                    </FormActions>
                </ActionForm>

                {/* Удалить */}
                <form action={deleteProjectWithId} className='mt-10 pt-8 border-t border-border'>
                    <p className='text-sm text-muted mb-4'>{t('dangerZone')}</p>
                    <ConfirmSubmitButton
                        variant='danger'
                        title={t('confirmDeleteTitle')}
                        description={t('projectsForm.confirmDelete')}
                        cancelLabel={t('cancel')}
                        confirmLabel={t('projectsForm.delete')}
                    >
                        {t('projectsForm.delete')}
                    </ConfirmSubmitButton>
                </form>
            </div>
        </div>
    );
}
