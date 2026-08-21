import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
    redirectMock,
    getSessionMock,
    createTagMock,
    updateTagMock,
    findTagsMock,
    createPostMock,
    updatePostMock,
    findPostMock,
    createProjectMock,
    updateProjectMock,
    findProjectMock,
    deleteUploadedFileByUrlMock,
} = vi.hoisted(() => ({
    redirectMock: vi.fn((path: string) => {
        throw new Error(`REDIRECT:${path}`);
    }),
    getSessionMock: vi.fn(),
    createTagMock: vi.fn(),
    updateTagMock: vi.fn(),
    findTagsMock: vi.fn(),
    createPostMock: vi.fn(),
    updatePostMock: vi.fn(),
    findPostMock: vi.fn(),
    createProjectMock: vi.fn(),
    updateProjectMock: vi.fn(),
    findProjectMock: vi.fn(),
    deleteUploadedFileByUrlMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    redirect: redirectMock,
}));

vi.mock('next/headers', () => ({
    headers: vi.fn(async () => new Headers()),
}));

vi.mock('next-intl/server', () => ({
    getTranslations: vi.fn(async () => (key: string, values?: Record<string, string | number>) => {
        if (key === 'fields.name') return 'Name';
        if (key === 'fields.title') return 'Title';
        if (key === 'fields.slug') return 'Slug';
        if (key === 'fields.excerpt') return 'Excerpt';
        if (key === 'fields.content') return 'Content';
        if (key === 'fields.description') return 'Description';
        if (key === 'fields.repository') return 'Repository';
        if (key === 'fields.demo') return 'Demo';
        if (key === 'fields.order') return 'Order';
        if (key === 'fields.cover') return 'Cover';
        if (key === 'usersPage.title') return 'Users';
        if (key === 'errors.requiredField') return `required:${values?.field}`;
        if (key === 'errors.tooLong') return `too-long:${values?.field}`;
        if (key === 'errors.invalidUrl') return `invalid-url:${values?.field}`;
        if (key === 'errors.invalidJson') return `invalid-json:${values?.field}`;
        if (key === 'errors.invalidOrder') return 'invalid-order';
        if (key === 'errors.invalidRole') return 'invalid-role';
        if (key === 'errors.invalidImageType') return 'invalid-image-type';
        if (key === 'errors.imageTooLarge') return 'image-too-large';
        if (key === 'errors.slugConflict') return 'slug-conflict';
        if (key === 'errors.tagConflict') return 'tag-conflict';

        return key;
    }),
}));

vi.mock('@/shared/auth/index.server', () => ({
    auth: {
        api: {
            getSession: getSessionMock,
        },
    },
}));

vi.mock('@/shared/lib/prisma', () => ({
    prisma: {
        tag: {
            create: createTagMock,
            findMany: findTagsMock,
            update: updateTagMock,
            delete: vi.fn(),
        },
        post: {
            create: createPostMock,
            update: updatePostMock,
            findUnique: findPostMock,
            delete: vi.fn(),
        },
        project: {
            create: createProjectMock,
            update: updateProjectMock,
            findUnique: findProjectMock,
            delete: vi.fn(),
        },
        user: {
            update: vi.fn(),
        },
    },
}));

vi.mock('@/shared/lib/minio', () => ({
    deleteUploadedFileByUrl: deleteUploadedFileByUrlMock,
    uploadFile: vi.fn(),
}));

import { createPost, createProject, createTag, updatePost, updateProject, updateTag } from './actions';

function createBasePostFormData() {
    const formData = new FormData();
    formData.set('title', 'Таврида Электрик');
    formData.set('content', JSON.stringify({ type: 'doc', content: [] }));
    return formData;
}

function createBaseProjectFormData() {
    const formData = new FormData();
    formData.set('title', 'Таврида Электрик');
    formData.set('order', '0');
    return formData;
}

describe('admin tag actions', () => {
    beforeEach(() => {
        getSessionMock.mockResolvedValue({ user: { role: 'ADMIN' } });
        createTagMock.mockReset();
        updateTagMock.mockReset();
        findTagsMock.mockReset();
        findTagsMock.mockResolvedValue([]);
        createPostMock.mockReset();
        updatePostMock.mockReset();
        findPostMock.mockReset();
        findPostMock.mockResolvedValue({ coverImage: null });
        createProjectMock.mockReset();
        updateProjectMock.mockReset();
        findProjectMock.mockReset();
        findProjectMock.mockResolvedValue({ coverImage: null });
        deleteUploadedFileByUrlMock.mockReset();
        redirectMock.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returns translated required error when tag name is missing', async () => {
        const formData = new FormData();
        formData.set('name', '   ');

        await expect(createTag('ru', undefined, formData)).resolves.toEqual({ error: 'required:Name' });
        expect(createTagMock).not.toHaveBeenCalled();
    });

    it('creates tag with transliterated slug and redirects back to tags list', async () => {
        const formData = new FormData();
        formData.set('name', 'Таврида Электрик');

        await expect(createTag('ru', undefined, formData)).rejects.toThrow('REDIRECT:/ru/admin/tags');

        expect(createTagMock).toHaveBeenCalledWith({
            data: {
                name: 'Таврида Электрик',
                slug: 'tavrida-elektrik',
            },
        });
    });

    it('returns translated conflict error when updating to an existing tag slug', async () => {
        const formData = new FormData();
        formData.set('name', 'Таврида Электрик');
        updateTagMock.mockRejectedValue({ code: 'P2002' });

        await expect(updateTag('tag-id', 'ru', undefined, formData)).resolves.toEqual({ error: 'tag-conflict' });

        expect(updateTagMock).toHaveBeenCalledWith({
            where: { id: 'tag-id' },
            data: {
                name: 'Таврида Электрик',
                slug: 'tavrida-elektrik',
            },
        });
    });
});

describe('admin post actions', () => {
    it('retries slug candidate on createPost unique conflict and redirects on success', async () => {
        const formData = createBasePostFormData();
        createPostMock.mockRejectedValueOnce({ code: 'P2002' }).mockResolvedValueOnce({ id: 'post-id' });

        await expect(createPost('ru', undefined, formData)).rejects.toThrow('REDIRECT:/ru/admin/posts');

        expect(createPostMock).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                data: expect.objectContaining({
                    published: false,
                    restricted: false,
                    translations: {
                        create: {
                            locale: 'ru',
                            title: 'Таврида Электрик',
                            slug: 'tavrida-elektrik',
                            excerpt: null,
                            content: JSON.stringify({ type: 'doc', content: [] }),
                        },
                    },
                }),
            }),
        );
        expect(createPostMock).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                data: expect.objectContaining({
                    translations: {
                        create: expect.objectContaining({
                            slug: 'tavrida-elektrik-2',
                        }),
                    },
                }),
            }),
        );
    });

    it('replaces post cover and cleans up previous uploaded file on updatePost', async () => {
        const formData = createBasePostFormData();
        formData.set('coverImage', 'https://cdn.example.com/new-cover.png');
        formData.set('published', 'on');
        findPostMock.mockResolvedValue({ coverImage: 'https://cdn.example.com/old-cover.png' });

        await expect(updatePost('post-id', 'ru', undefined, formData)).rejects.toThrow('REDIRECT:/ru/admin/posts');

        expect(updatePostMock).toHaveBeenCalledWith({
            where: { id: 'post-id' },
            data: expect.objectContaining({
                coverImage: 'https://cdn.example.com/new-cover.png',
                published: true,
                restricted: false,
                tags: {
                    deleteMany: {},
                    create: [],
                },
                translations: {
                    upsert: {
                        where: {
                            postId_locale: {
                                postId: 'post-id',
                                locale: 'ru',
                            },
                        },
                        update: {
                            title: 'Таврида Электрик',
                            slug: 'tavrida-elektrik',
                            excerpt: null,
                            content: JSON.stringify({ type: 'doc', content: [] }),
                        },
                        create: {
                            locale: 'ru',
                            title: 'Таврида Электрик',
                            slug: 'tavrida-elektrik',
                            excerpt: null,
                            content: JSON.stringify({ type: 'doc', content: [] }),
                        },
                    },
                },
            }),
        });
        expect(deleteUploadedFileByUrlMock).toHaveBeenCalledWith('https://cdn.example.com/old-cover.png');
    });
});

describe('admin project actions', () => {
    it('returns validation error when createProject receives invalid order', async () => {
        const formData = createBaseProjectFormData();
        formData.set('order', '-1');

        await expect(createProject('ru', undefined, formData)).resolves.toEqual({ error: 'invalid-order' });
        expect(createProjectMock).not.toHaveBeenCalled();
    });

    it('returns slug conflict when updateProject hits unique constraint', async () => {
        const formData = createBaseProjectFormData();
        updateProjectMock.mockRejectedValue({ code: 'P2002' });

        await expect(updateProject('project-id', 'ru', undefined, formData)).resolves.toEqual({
            error: 'slug-conflict',
        });

        expect(updateProjectMock).toHaveBeenCalledWith({
            where: { id: 'project-id' },
            data: expect.objectContaining({
                order: 0,
                tags: {
                    deleteMany: {},
                    create: [],
                },
                translations: {
                    upsert: {
                        where: {
                            projectId_locale: {
                                projectId: 'project-id',
                                locale: 'ru',
                            },
                        },
                        update: {
                            title: 'Таврида Электрик',
                            slug: 'tavrida-elektrik',
                            description: null,
                            content: null,
                        },
                        create: {
                            locale: 'ru',
                            title: 'Таврида Электрик',
                            slug: 'tavrida-elektrik',
                            description: null,
                            content: null,
                        },
                    },
                },
            }),
        });
    });
});
