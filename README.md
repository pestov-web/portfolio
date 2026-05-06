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

SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_SECURE="false"
SMTP_USER=""
SMTP_PASSWORD=""
CONTACT_EMAIL="you@example.com"
CONTACT_FROM_EMAIL="you@example.com"
CONTACT_FROM_NAME="Portfolio"
```

### 3. Поднять внешние сервисы

Для локального запуска нужны:

- PostgreSQL
- MinIO с созданным bucket `portfolio` или другим значением из `MINIO_BUCKET`

SMTP обязателен только для реальной отправки писем. Если SMTP-переменные и `CONTACT_EMAIL` не заданы, в dev-режиме сообщения из формы контактов просто логируются на сервере.

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
- `SMTP_HOST` — SMTP-сервер для формы контактов
- `SMTP_PORT` — SMTP-порт, обычно `587` или `465`
- `SMTP_SECURE` — `true` для implicit TLS, обычно нужно для `465`
- `SMTP_TLS_SERVERNAME` — имя сервера для TLS-проверки, полезно если `SMTP_HOST` задан IP-адресом
- `SMTP_USER`
- `SMTP_PASSWORD`
- `CONTACT_EMAIL` — адрес, на который приходят сообщения с формы контактов
- `CONTACT_FROM_EMAIL` — адрес отправителя для формы контактов
- `CONTACT_FROM_NAME` — имя отправителя, по умолчанию `Portfolio`

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

## CI/CD и прод-деплой

В репозитории есть два контура автоматизации:

- [ci.yml](.github/workflows/ci.yml) — проверка качества на push и pull request
- [deploy.yml](.github/workflows/deploy.yml) — production deploy на `main`

Production deploy устроен так:

1. GitHub Actions собирает Docker image приложения.
2. Image пушится в GHCR.
3. Self-hosted GitHub Actions runner на сервере `192.168.1.100` забирает job локально.
4. Runner кладёт [docker-compose.prod.yml](docker-compose.prod.yml) и [deploy/nginx.pestov-web.ru.conf](deploy/nginx.pestov-web.ru.conf) в deploy-каталог и пишет `.env.production`.
5. Сервер делает `docker compose pull`, затем `prisma migrate deploy`, затем перезапускает контейнер приложения на `127.0.0.1:3001`.
6. Публичный трафик до приложения доводит уже существующий системный nginx на сервере.

### Что нужно на сервере

На сервере должны быть установлены:

- Docker Engine
- Docker Compose plugin
- доступ пользователя `mwk` к Docker без `sudo`
- self-hosted GitHub Actions runner с label `portfolio-prod`

Нужно подготовить каталог:

```bash
mkdir -p /home/mwk/apps/portfolio/deploy
```

Для общих сервисов PostgreSQL и MinIO в репозитории теперь есть отдельный compose-файл [deploy/docker-compose.infra.yml](deploy/docker-compose.infra.yml). Он поднимает один общий PostgreSQL, один общий MinIO и создаёт:

- базы `portfolio` и `hype`
- bucket'ы `portfolio` и `hype`

Перед первым deploy приложения нужно один раз поднять инфраструктурный стек:

```bash
cd /home/mwk/apps/portfolio/deploy
cp .env.infra.example .env.infra
docker compose -f docker-compose.infra.yml up -d
```

Значения `POSTGRES_USER`, `POSTGRES_PASSWORD`, `MINIO_ROOT_USER` и `MINIO_ROOT_PASSWORD` из `deploy/.env.infra` должны быть согласованы с `DATABASE_URL`, `MINIO_ACCESS_KEY` и `MINIO_SECRET_KEY` в `PRODUCTION_ENV_FILE`.

После этого production compose приложения подключается к общей сети `shared-services` и может обращаться к сервисам по именам `postgres` и `minio`.

Так как приложение слушает только локальный `127.0.0.1:3001`, для публичного домена `pestov-web.ru` нужно также настроить:

- A-запись домена на внешний IP `80.82.38.194`
- проброс портов `80` и `443` с роутера на `192.168.1.100`

Без этого Let's Encrypt не сможет выпустить сертификат для системного nginx.

### GitHub Secrets

Для workflow deploy нужны secrets:

- `PRODUCTION_ENV_FILE` — полный текст production `.env.production`

Базовый шаблон production env лежит в [.env.production.example](.env.production.example).

`PRODUCTION_ENV_FILE` должен содержать production-значения как минимум для:

- `DATABASE_URL=postgresql://portfolio:<password>@postgres:5432/portfolio?schema=public`
- `NEXT_PUBLIC_APP_URL=https://pestov-web.ru`
- `BETTER_AUTH_URL=https://pestov-web.ru`
- `BETTER_AUTH_SECRET`
- OAuth secrets
- `MINIO_ENDPOINT=minio`
- `MINIO_PORT=9000`
- `MINIO_USE_SSL=false`
- `MINIO_ACCESS_KEY=minioadmin`
- `MINIO_SECRET_KEY=<password-from-deploy-.env.infra>`
- `MINIO_BUCKET=portfolio`
- `NEXT_PUBLIC_MINIO_BUCKET=portfolio`
- `SMTP_HOST=192.168.1.100`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `SMTP_TLS_SERVERNAME=mail.pestov-web.ru`
- `SMTP_USER=pw@pestov-web.ru`
- `SMTP_PASSWORD=<mail-password>`
- `CONTACT_EMAIL`
- `CONTACT_FROM_EMAIL=pw@pestov-web.ru`
- `CONTACT_FROM_NAME=Portfolio`

### Первый запуск

1. Установить self-hosted runner GitHub Actions на сервер `192.168.1.100` под пользователем `mwk` и повесить label `portfolio-prod`.
2. Один раз поднять инфраструктурный стек из [deploy/docker-compose.infra.yml](deploy/docker-compose.infra.yml) и заполнить `deploy/.env.infra`.
3. Добавить `PRODUCTION_ENV_FILE` в secrets репозитория.
4. После этого достаточно запушить изменения в `main` или вручную запустить workflow `Deploy` из GitHub Actions.

Пример установки runner:

```bash
mkdir -p ~/actions-runner && cd ~/actions-runner
curl -o actions-runner-linux-x64.tar.gz -L https://github.com/actions/runner/releases/latest/download/actions-runner-linux-x64.tar.gz
tar xzf actions-runner-linux-x64.tar.gz
./config.sh --url https://github.com/<owner>/<repo> --token <runner-token> --labels portfolio-prod --unattended
./run.sh
```

### Reverse proxy

На сервере уже работает системный nginx и он занимает `80` и `443`, поэтому отдельный Caddy-контур не нужен и будет конфликтовать с текущей инфраструктурой.

Для `pestov-web.ru` нужно один раз установить конфиг на сервере под root:

```bash
sudo cp /home/mwk/apps/portfolio/deploy/nginx.pestov-web.ru.conf /etc/nginx/sites-available/pestov-web.ru
sudo ln -s /etc/nginx/sites-available/pestov-web.ru /etc/nginx/sites-enabled/pestov-web.ru
sudo nginx -t
sudo systemctl reload nginx
```

Этот конфиг является bootstrap-вариантом: он проксирует HTTP-трафик на `127.0.0.1:3001` и безопасно включается даже до выпуска сертификата.

Если приложение ещё не поднято, nginx будет отдавать `502 Bad Gateway` — это ожидаемо, потому что upstream на `127.0.0.1:3001` пока не слушает.

После запуска приложения можно выпустить сертификат через Certbot для доменов `pestov-web.ru` и `www.pestov-web.ru`, а затем при желании перевести конфиг на HTTPS.

## Примечания

- Prisma client генерируется в `generated/prisma`
- для доступа к MinIO-файлам используется прокси-роут `/api/media/[...path]`
- загрузка файлов доступна только пользователям с ролью `ADMIN`
