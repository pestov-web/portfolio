import type { Locale } from '@/shared/config/index';
import { getTranslations } from 'next-intl/server';
import { createProject } from '../../actions';
import { prisma } from '@/shared/lib/prisma';
import { PageHeader } from '@/shared/ui/page-header';
import { Button, CheckboxField, Field, FormActions, TiptapEditor, ImageUpload, TextArea, TextInput } from '@/shared/ui';
import { ActionForm } from '../../action-form';
import { AdminTagSelector } from '../../tag-selector';
import { AutoSlugField } from '../../slug-field';

export default async function NewProjectPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations('admin');
    const createProjectWithLocale = createProject.bind(null, locale);
    const tags = await prisma.tag.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    return (
        <div className='page-container page-x fade-in'>
            <div className='py-14 max-w-2xl'>
                <PageHeader title={t('projectsForm.newTitle')} size='md' />
                <p className='mb-5 text-sm text-faint'>{t('translationHint', { locale: locale.toUpperCase() })}</p>

                <ActionForm action={createProjectWithLocale} className='flex flex-col gap-5'>
                    {/* Обложка */}
                    <ImageUpload name='coverImage' />

                    {/* Название */}
                    <Field label={t('fields.title')} htmlFor='title'>
                        <TextInput id='title' name='title' type='text' required />
                    </Field>

                    <Field label={t('fields.slug')} htmlFor='slug'>
                        <AutoSlugField id='slug' sourceFieldName='title' generateLabel={t('generateSlug')} />
                    </Field>

                    {/* Описание */}
                    <Field label={t('fields.description')} htmlFor='description'>
                        <TextArea id='description' name='description' rows={3} />
                    </Field>

                    {/* Ссылки */}
                    <div className='grid sm:grid-cols-2 gap-4'>
                        <Field label={t('fields.repository')} htmlFor='repoUrl'>
                            <TextInput id='repoUrl' name='repoUrl' type='url' placeholder='https://github.com/...' />
                        </Field>
                        <Field label={t('fields.demo')} htmlFor='demoUrl'>
                            <TextInput id='demoUrl' name='demoUrl' type='url' placeholder='https://...' />
                        </Field>
                    </div>

                    {/* Порядок */}
                    <Field label={t('fields.order')} htmlFor='order' className='w-32'>
                        <TextInput id='order' name='order' type='number' defaultValue={0} min={0} />
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

                    {/* Чекбокс */}
                    <CheckboxField name='published' label={t('published')} />

                    <FormActions>
                        <Button type='submit' variant='primary' className='px-5'>
                            {t('projectsForm.create')}
                        </Button>
                    </FormActions>
                </ActionForm>
            </div>
        </div>
    );
}
