import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from 'better-auth/crypto';
import { randomUUID } from 'crypto';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});
const db = new PrismaClient({ adapter });

// ─── Tiptap JSON-контент ──────────────────────────────────────────────────────
function doc(...children: object[]) {
    return JSON.stringify({ type: 'doc', content: children });
}

function paragraph(text: string) {
    return { type: 'paragraph', content: [{ type: 'text', text }] };
}

function heading(level: number, text: string) {
    return {
        type: 'heading',
        attrs: { level },
        content: [{ type: 'text', text }],
    };
}

function codeBlock(code: string) {
    return { type: 'codeBlock', attrs: { language: 'typescript' }, content: [{ type: 'text', text: code }] };
}

function bulletList(items: string[]) {
    return {
        type: 'bulletList',
        content: items.map((text) => ({
            type: 'listItem',
            content: [paragraph(text)],
        })),
    };
}

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🌱  Сидирование базы данных...');

    // Пользователи
    const adminId = randomUUID();
    const friendId = randomUUID();
    const userId = randomUUID();

    const adminPassword = await hashPassword('admin123');
    const friendPassword = await hashPassword('friend123');
    const userPassword = await hashPassword('user123');

    // Создаём пользователей
    const admin = await db.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            id: adminId,
            name: 'Admin',
            email: 'admin@example.com',
            emailVerified: true,
            role: 'ADMIN',
        },
    });

    const friend = await db.user.upsert({
        where: { email: 'friend@example.com' },
        update: {},
        create: {
            id: friendId,
            name: 'Friend User',
            email: 'friend@example.com',
            emailVerified: true,
            role: 'FRIEND',
        },
    });

    const regularUser = await db.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            id: userId,
            name: 'Regular User',
            email: 'user@example.com',
            emailVerified: true,
            role: 'USER',
        },
    });

    // Создаём accounts (credential) для каждого пользователя
    const accountPairs = [
        { userId: admin.id, password: adminPassword, email: admin.email },
        { userId: friend.id, password: friendPassword, email: friend.email },
        { userId: regularUser.id, password: userPassword, email: regularUser.email },
    ];

    for (const { userId: uid, password, email } of accountPairs) {
        const existing = await db.account.findFirst({
            where: { userId: uid, providerId: 'credential' },
        });
        if (!existing) {
            await db.account.create({
                data: {
                    id: randomUUID(),
                    accountId: uid,
                    providerId: 'credential',
                    userId: uid,
                    password,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
        }
        console.log(`  ✓ Пользователь ${email}`);
    }

    // Теги
    const tagNames = [
        { name: 'TypeScript', slug: 'typescript' },
        { name: 'React', slug: 'react' },
        { name: 'Next.js', slug: 'nextjs' },
        { name: 'Node.js', slug: 'nodejs' },
        { name: 'PostgreSQL', slug: 'postgresql' },
        { name: 'DevOps', slug: 'devops' },
    ];

    const tags: Record<string, string> = {};
    for (const tag of tagNames) {
        const t = await db.tag.upsert({
            where: { slug: tag.slug },
            update: {},
            create: { id: randomUUID(), ...tag },
        });
        tags[tag.slug] = t.id;
    }
    console.log(`  ✓ Теги (${tagNames.length})`);

    // ─── Посты ────────────────────────────────────────────────────────────────
    const posts = [
        {
            title: 'Почему я выбрал TypeScript для всех новых проектов',
            slug: 'why-typescript',
            excerpt:
                'Личный взгляд на то, почему строгая типизация экономит часы дебага и делает код самодокументируемым.',
            content: doc(
                heading(2, 'Зачем вообще TypeScript?'),
                paragraph(
                    'Когда я впервые попробовал TypeScript в 2019 году, мне казалось, что это просто лишний шаг перед запуском кода. ' +
                        'Через месяц работы в реальном проекте я уже не мог представить разработку без него.',
                ),
                heading(2, 'Что конкретно даёт типизация'),
                bulletList([
                    'Автодополнение и навигация по коду в IDE — это бесценно в больших кодовых базах',
                    'Ошибки находятся на этапе компиляции, а не в продакшене в 3 ночи',
                    'Рефакторинг становится безопасным — TypeScript покажет что сломалось',
                    'Самодокументирующийся код — типы лучше любых комментариев',
                ]),
                heading(2, 'Пример из реальной практики'),
                codeBlock(`// До TypeScript
function getUser(id) {
  return fetch(\`/api/users/\${id}\`).then(r => r.json());
}

// С TypeScript
interface User {
  id: string;
  name: string;
  email: string;
}

async function getUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json() as User;
}`),
                paragraph('Разница очевидна. Второй вариант явно говорит что принимает и что возвращает.'),
            ),
            published: true,
            restricted: false,
            tagSlugs: ['typescript', 'nodejs'],
        },
        {
            title: 'Next.js App Router: что изменилось в моём подходе',
            slug: 'nextjs-app-router',
            excerpt: 'Полгода работы с App Router — честные впечатления, боль и радость от Server Components.',
            content: doc(
                heading(2, 'Первые впечатления'),
                paragraph(
                    'App Router перевернул привычную модель разработки на Next.js. ' +
                        'Server Components, Server Actions, новая система кеширования — всё это требует пересмотра подходов.',
                ),
                heading(2, 'Server Components — главный сдвиг парадигмы'),
                paragraph(
                    'Теперь компоненты по умолчанию серверные. Это значит: запросы к БД прямо в компоненте, ' +
                        'никакого useEffect для загрузки данных, меньше JavaScript на клиенте.',
                ),
                codeBlock(`// Прямой запрос к БД в компоненте — это норма в App Router
async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return <PostList posts={posts} />;
}`),
                heading(2, 'Что ещё понравилось'),
                bulletList([
                    'Streaming и Suspense из коробки',
                    'Server Actions — удобная замена API routes для мутаций',
                    'Вложенные layouts без лишнего кода',
                ]),
            ),
            published: true,
            restricted: false,
            tagSlugs: ['nextjs', 'react', 'typescript'],
        },
        {
            title: 'Моя ежемесячная рабочая рутина',
            slug: 'monthly-workflow',
            excerpt: 'Только для друзей: как я организую рабочие процессы, инструменты и привычки.',
            content: doc(
                heading(2, 'Это закрытый пост'),
                paragraph(
                    'Здесь я пишу о личных рабочих привычках, которые не хочу выносить в публичный блог. ' +
                        'Проверка системы закрытого доступа для друзей.',
                ),
                heading(2, 'Инструменты'),
                bulletList([
                    'Linear для задач вместо Jira',
                    'Raycast как launcher + множество расширений',
                    'Obsidian для заметок и ведения дневника разработки',
                    'Warp terminal с AI-подсказками',
                ]),
            ),
            published: true,
            restricted: true,
            tagSlugs: ['devops'],
        },
        {
            title: 'Черновик: PostgreSQL tips',
            slug: 'postgres-tips-draft',
            excerpt: 'Всё что узнал о PostgreSQL за год активного использования.',
            content: doc(
                heading(2, 'Черновик'),
                paragraph('Этот пост ещё не готов к публикации. Он находится в черновике.'),
            ),
            published: false,
            restricted: false,
            tagSlugs: ['postgresql'],
        },
    ];

    for (const post of posts) {
        const existingPost = await db.postTranslation.findUnique({
            where: { locale_slug: { locale: 'ru', slug: post.slug } },
            select: { postId: true },
        });
        if (existingPost) continue;

        const created = await db.post.create({
            data: {
                id: randomUUID(),
                published: post.published,
                restricted: post.restricted,
                translations: {
                    create: {
                        locale: 'ru',
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        content: post.content,
                    },
                },
            },
        });

        for (const slug of post.tagSlugs) {
            if (tags[slug]) {
                await db.postTag.create({ data: { postId: created.id, tagId: tags[slug] } });
            }
        }
        console.log(
            `  ✓ Пост: "${post.title}" (${post.published ? (post.restricted ? 'закрытый' : 'опубликован') : 'черновик'})`,
        );
    }

    // ─── Проекты ──────────────────────────────────────────────────────────────
    const projects = [
        {
            title: 'Portfolio',
            slug: 'portfolio',
            description:
                'Этот сайт — персональное портфолио и блог, построенный на Next.js с App Router, Prisma и Better Auth.',
            content: doc(
                heading(2, 'Стек технологий'),
                bulletList([
                    'Next.js 16 с App Router и Server Components',
                    'TypeScript 5 — строгая типизация везде',
                    'Tailwind CSS 4 с CSS-переменными для дизайн-системы',
                    'Prisma 7 + PostgreSQL',
                    'Better Auth — аутентификация с OAuth',
                    'Tiptap — rich-text редактор',
                    'MinIO — S3-совместимое хранилище медиафайлов',
                    'next-intl — интернационализация (RU/EN)',
                ]),
                heading(2, 'Особенности'),
                paragraph(
                    'FSD (Feature-Sliced Design) архитектура, тёмная/светлая тема, ' +
                        'закрытые посты для друзей, полноценная CMS для управления контентом.',
                ),
            ),
            repoUrl: 'https://github.com/username/portfolio',
            demoUrl: null,
            published: true,
            order: 0,
            tagSlugs: ['nextjs', 'typescript', 'react', 'postgresql'],
        },
        {
            title: 'CLI инструмент для автоматизации деплоя',
            slug: 'deploy-cli',
            description:
                'Node.js CLI для автоматизации деплоя в Docker Swarm с поддержкой rollback и уведомлениями в Telegram.',
            content: doc(
                heading(2, 'О проекте'),
                paragraph(
                    'Написал этот инструмент когда устал от длинных bash-скриптов деплоя, ' +
                        'которые никто не понимал кроме меня. Теперь деплой — одна команда.',
                ),
                codeBlock(`npx deploy-cli push --env production --service api --notify telegram`),
                heading(2, 'Возможности'),
                bulletList([
                    'Автоматический rollback при неудачном healthcheck',
                    'Уведомления в Telegram о статусе деплоя',
                    'Поддержка нескольких окружений (staging, production)',
                    'Параллельный деплой нескольких сервисов',
                ]),
            ),
            repoUrl: 'https://github.com/username/deploy-cli',
            demoUrl: null,
            published: true,
            order: 1,
            tagSlugs: ['nodejs', 'typescript', 'devops'],
        },
        {
            title: 'PostgreSQL Query Analyzer',
            slug: 'pg-query-analyzer',
            description: 'Веб-интерфейс для анализа slow queries в PostgreSQL с визуализацией EXPLAIN ANALYZE.',
            content: doc(
                heading(2, 'Зачем это нужно'),
                paragraph(
                    'pg_stat_statements даёт данные, но их сложно читать. ' +
                        'Этот инструмент визуализирует план выполнения запроса и подсказывает что оптимизировать.',
                ),
                heading(2, 'Технологии'),
                bulletList([
                    'React + Vite на фронтенде',
                    'Node.js + pg на бэкенде',
                    'D3.js для визуализации дерева плана',
                ]),
            ),
            repoUrl: null,
            demoUrl: null,
            published: false,
            order: 2,
            tagSlugs: ['postgresql', 'react', 'nodejs'],
        },
    ];

    for (const project of projects) {
        const existing = await db.projectTranslation.findUnique({
            where: { locale_slug: { locale: 'ru', slug: project.slug } },
            select: { projectId: true },
        });
        if (existing) continue;

        const created = await db.project.create({
            data: {
                id: randomUUID(),
                repoUrl: project.repoUrl,
                demoUrl: project.demoUrl,
                published: project.published,
                order: project.order,
                translations: {
                    create: {
                        locale: 'ru',
                        title: project.title,
                        slug: project.slug,
                        description: project.description,
                        content: project.content,
                    },
                },
            },
        });

        for (const slug of project.tagSlugs) {
            if (tags[slug]) {
                await db.projectTag.create({ data: { projectId: created.id, tagId: tags[slug] } });
            }
        }
        console.log(`  ✓ Проект: "${project.title}" (${project.published ? 'опубликован' : 'черновик'})`);
    }

    // ─── Комментарии ──────────────────────────────────────────────────────────
    const publicPost = await db.postTranslation.findUnique({
        where: { locale_slug: { locale: 'ru', slug: 'why-typescript' } },
        select: { postId: true },
    });

    if (publicPost) {
        const existingComments = await db.comment.count({ where: { postId: publicPost.postId } });
        if (existingComments === 0) {
            await db.comment.createMany({
                data: [
                    {
                        id: randomUUID(),
                        content: 'Отличная статья! Сам перешёл на TypeScript два года назад и не жалею ни разу.',
                        postId: publicPost.postId,
                        userId: friend.id,
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
                        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
                    },
                    {
                        id: randomUUID(),
                        content:
                            'Согласен насчёт рефакторинга. Последний проект переписывал с JS на TS — TS нашёл 40+ скрытых багов.',
                        postId: publicPost.postId,
                        userId: regularUser.id,
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
                        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
                    },
                ],
            });
            console.log('  ✓ Комментарии к посту о TypeScript');
        }
    }

    console.log('\n✅  Готово! Тестовые аккаунты:');
    console.log('   admin@example.com   / admin123  (ADMIN)');
    console.log('   friend@example.com  / friend123 (FRIEND)');
    console.log('   user@example.com    / user123   (USER)');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => db.$disconnect());
