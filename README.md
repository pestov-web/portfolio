# Portfolio

Персональный сайт-портфолио с блогом, проектами, комментариями, локализацией и закрытой админкой.

Проект построен на Next.js App Router и включает полноценную CMS-часть: публикацию постов и проектов, загрузку изображений, OAuth-авторизацию, контактную форму и разграничение доступа по ролям.

## Возможности

- RU/EN локализация через next-intl с префиксами маршрутов `/ru` и `/en`
- публичные страницы: главная, блог, проекты, контактная форма
- детальные страницы постов и проектов
- комментарии к постам для авторизованных пользователей
- закрытые посты для ролей `FRIEND` и `ADMIN`
- админка для управления постами, проектами и пользователями
- OAuth через GitHub, Google и Yandex на Better Auth
- загрузка медиафайлов в MinIO
- отправка сообщений с формы контактов через Resend
- светлая и тёмная тема

## Стек

- Next.js 16.2.2
- React 19
- TypeScript 5
- Tailwind CSS 4
- Prisma 7 + PostgreSQL
- Better Auth
- next-intl
- Tiptap
- MinIO
- Vitest + ESLint + Steiger

## Архитектура

Проект организован вокруг App Router и FSD-подхода:

- `src/app` — маршруты, layout'ы, API routes и page-level компоненты
- `src/entities` — сущности домена (`post`, `project`, `user`)
- `src/features` — прикладные сценарии
- `src/shared` — конфиг, утилиты, auth и общие UI-примитивы
- `src/widgets` — составные блоки интерфейса вроде header/footer
- `prisma` — схема БД, сиды и инфраструктура Prisma
- `messages` — словари локализации
- `generated/prisma` — сгенерированный Prisma client

## Быстрый старт

### 1. Установить зависимости

```bash
pnpm install
```

### 2. Создать `.env.local`

Минимальный пример:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio?schema=public"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:3000"

AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_YANDEX_ID=""
AUTH_YANDEX_SECRET=""

MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_USE_SSL="false"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="portfolio"
NEXT_PUBLIC_MINIO_BUCKET="portfolio"

RESEND_API_KEY=""
CONTACT_EMAIL="you@example.com"
```

### 3. Поднять внешние сервисы

Для локального запуска нужны:

- PostgreSQL
- MinIO с созданным bucket `portfolio` или другим значением из `MINIO_BUCKET`

Resend обязателен только для реальной отправки писем. Если `RESEND_API_KEY` и `CONTACT_EMAIL` не заданы, в dev-режиме сообщения из формы контактов просто логируются на сервере.

### 4. Сгенерировать Prisma client и синхронизировать схему

```bash
pnpm exec prisma generate
pnpm exec prisma db push
```

### 5. Заполнить базу тестовыми данными

```bash
pnpm seed
```

После сида будут доступны тестовые аккаунты:

- `admin@example.com` / `admin123`
- `friend@example.com` / `friend123`
- `user@example.com` / `user123`

### 6. Запустить проект

```bash
pnpm dev
```

Приложение будет доступно по адресу `http://localhost:3000`.

## Основные маршруты

- `/ru` и `/en` — главная
- `/:locale/blog` — список постов
- `/:locale/blog/:slug` — страница поста
- `/:locale/projects` — список проектов
- `/:locale/projects/:slug` — страница проекта
- `/:locale/contact` — форма контактов
- `/:locale/login` — вход
- `/:locale/admin` — админка

## Роли и доступ

- `USER` — базовый пользователь
- `FRIEND` — доступ к закрытым постам
- `ADMIN` — доступ к админке, загрузке файлов и управлению контентом

Проверка защищённых маршрутов выполняется в `proxy.ts`, а сессионная модель построена на Better Auth + Prisma adapter.

## Скрипты

```bash
pnpm dev         # запуск dev-сервера
pnpm build       # production build
pnpm start       # запуск production-сборки
pnpm lint        # eslint
pnpm test        # vitest run
pnpm test:watch  # vitest watch
pnpm fsd:check   # проверка архитектурных ограничений Steiger
pnpm seed        # сидирование базы тестовыми данными
```

## Переменные окружения

### Обязательные

- `DATABASE_URL` — строка подключения к PostgreSQL
- `NEXT_PUBLIC_APP_URL` — публичный base URL приложения
- `BETTER_AUTH_URL` — base URL Better Auth
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`
- `AUTH_YANDEX_ID` / `AUTH_YANDEX_SECRET`
- `MINIO_ENDPOINT`
- `MINIO_PORT`
- `MINIO_USE_SSL`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_BUCKET`

### Опциональные

- `NEXT_PUBLIC_MINIO_BUCKET` — bucket для клиентских URL, по умолчанию `portfolio`
- `RESEND_API_KEY` — нужен для отправки email из контактной формы
- `CONTACT_EMAIL` — адрес, на который приходят сообщения с формы контактов

## Что уже есть в сид-данных

- 3 пользователя с разными ролями
- несколько тегов
- опубликованные, закрытые и черновые посты
- опубликованные и черновые проекты
- комментарии к одному из публичных постов

## Проверка перед деплоем

```bash
pnpm lint
pnpm test
pnpm build
```

## Примечания

- Prisma client генерируется в `generated/prisma`
- для доступа к MinIO-файлам используется прокси-роут `/api/media/[...path]`
- загрузка файлов доступна только пользователям с ролью `ADMIN`
- если хочешь отключить часть OAuth-провайдеров локально, сейчас это нужно делать в коде, а не только через env
