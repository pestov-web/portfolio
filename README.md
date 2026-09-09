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
- Prisma 7 + SQLite
- Better Auth
- next-intl
- Tiptap
- MinIO
- Vitest + ESLint + Steiger

## Архитектура

Проект организован вокруг App Router и FSD-подхода:

- `src/app` — маршруты, layout'ы, API routes и page-level компоненты
- `src/entities` — переиспользуемые модели и карточки домена (`post`, `project`)
- `src/shared` — конфиг, инфраструктурные утилиты, auth и общие UI-примитивы
- `src/widgets` — составные блоки интерфейса вроде header/footer
- `prisma` — схема БД, сиды и инфраструктура Prisma
- `messages` — словари локализации
- `generated/prisma` — сгенерированный Prisma client

## Быстрый старт

### Локальный стенд целиком в Docker

```bash
docker compose -f docker-compose.local.yml up -d --build
# Один раз для новой локальной БД:
docker compose -f docker-compose.local.yml --profile seed run --rm seed
```

Сайт: http://localhost:3100/ru. Консоль MinIO: http://localhost:9101
(логин `portfolio-local`, пароль `portfolio-local-storage`).

Стенд использует отдельные Docker volumes и не читает `.env.local` или production-секреты.
Порты доступны только на localhost. Учётные данные в Compose предназначены исключительно
для локальной разработки. OAuth и отправка почты не настроены; вход по паролю в текущем
приложении не включён, даже для пользователей из seed.

```bash
docker compose -f docker-compose.local.yml logs -f app
# Остановка с сохранением БД и медиа:
docker compose -f docker-compose.local.yml down
```

### 1. Установить зависимости

```bash
pnpm install
```

### 2. Создать `.env.local`

Минимальный пример:

```env
DATABASE_URL="file:./portfolio.db"

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

- SQLite: файл создаётся миграциями, отдельный сервер не нужен
- MinIO с созданным bucket `portfolio` или другим значением из `MINIO_BUCKET`

Resend обязателен только для реальной отправки писем. Если `RESEND_API_KEY` и `CONTACT_EMAIL` не заданы, в dev-режиме сообщения из формы контактов просто логируются на сервере.

### 4. Сгенерировать Prisma client и синхронизировать схему

```bash
pnpm exec prisma generate
pnpm db:migrate
```

### 5. Заполнить базу тестовыми данными

```bash
pnpm seed
```

Seed создаёт тестовые аккаунты (вход по паролю сейчас не включён):

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
pnpm prisma:generate  # генерация Prisma Client
pnpm db:migrate  # инициализация SQLite (WAL) и применение миграций
pnpm exec playwright test  # браузерные регрессии (после build, миграций и seed)
pnpm seed        # сидирование базы тестовыми данными
```

## Переменные окружения

### Обязательные

- `DATABASE_URL` — путь к SQLite, например `file:./portfolio.db`
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

## CI/CD и прод-деплой

В репозитории есть два контура автоматизации:

- [ci.yml](.github/workflows/ci.yml) — проверка качества на push и pull request
- [deploy.yml](.github/workflows/deploy.yml) — production deploy на `main`

Production deploy устроен так:

1. Push в `main` запускает Deploy, который сначала вызывает переиспользуемый CI: FSD, ESLint, TypeScript, unit/integration tests, build и браузерные проверки Playwright + axe. Pull requests проверяются отдельно на GitHub-hosted runner.
2. Только после успешного CI собирается image и публикуется в GHCR с тегом `sha-<полный SHA коммита>`. Ручной Deploy также проходит CI; production доступен только для `main`.
3. Self-hosted GitHub Actions runner на сервере `192.168.1.100` забирает job локально.
4. Runner кладёт [docker-compose.prod.yml](docker-compose.prod.yml) и [deploy/nginx.pestov-web.ru.conf](deploy/nginx.pestov-web.ru.conf) в deploy-каталог и пишет `.env.production`.
5. Сервер сохраняет конфигурацию релиза в `backups/release-*`, скачивает image, останавливает текущий SQLite writer и копирует весь `/data` в backup. Затем выполняет `pnpm db:migrate`, запускает приложение на `127.0.0.1:3001` и ждёт healthcheck с обращением к БД.
6. Публичный трафик до приложения доводит уже существующий системный nginx на сервере.
7. Последняя проверка требует ответ `{"status":"ok"}` от `https://pestov-web.ru/api/health`: редирект на другой сайт не считается успешным деплоем. Выполняющийся деплой не отменяется новым push.

Если миграция или healthcheck не прошли, job завершается ошибкой. Автоматического отката БД нет: сначала изучите backup и совместимость схемы со старым образом. После остановки writer ошибка может оставить сайт недоступным до ручного восстановления. Backups содержат секреты и пользовательские данные: храните их с правами только владельца, не публикуйте как CI artifacts и отдельно организуйте внешнее хранение/ротацию.

### Production infrastructure

- Runner `dev-portfolio-prod` установлен отдельно в `/home/mwk/actions-runner-portfolio`, label `portfolio-prod`, systemd service запускается от `mwk`.
- Приложение размещается в `/home/mwk/apps/portfolio`. TLS-конфигурация `deploy/nginx.pestov-web.ru.conf` проксирует домен на `127.0.0.1:3001`.
- Отдельный MinIO запускается через `deploy/docker-compose.storage.yml`, имеет собственный volume и alias `portfolio-minio` в сети `shared-services`.
- Файл `.env.storage` на сервере содержит отдельные credentials MinIO и overrides URL/SQLite. Workflow добавляет его после `PRODUCTION_ENV_FILE`; не коммитьте этот файл. Он также нужен для запуска storage compose. OAuth и почтовые секреты берутся из GitHub secret.
- Nginx и runner не переустанавливаются при каждом deploy. Сервисы и данные других проектов не используются и не удаляются.

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

Исторический [deploy/docker-compose.infra.yml](deploy/docker-compose.infra.yml) обслуживает также другие проекты. Его PostgreSQL больше не нужен portfolio; не удаляйте общий сервис или его volumes. Этот стек создаёт:

- базы `portfolio` и `hype`
- bucket'ы `portfolio` и `hype`

Перед первым deploy приложения нужно один раз поднять инфраструктурный стек:

```bash
cd /home/mwk/apps/portfolio/deploy
cp .env.infra.example .env.infra
docker compose -f docker-compose.infra.yml up -d
```

Значения `MINIO_ROOT_USER` и `MINIO_ROOT_PASSWORD` должны быть согласованы с `MINIO_ACCESS_KEY` и `MINIO_SECRET_KEY` в `PRODUCTION_ENV_FILE`. SQLite хранится отдельно в volume `sqlite_data`.

Production compose подключается к сети `shared-services` для доступа к `minio`. База находится в `/data/portfolio.db`; app и migrate используют один volume. Запускайте одну реплику приложения на одном Docker-хосте.

Так как приложение слушает только локальный `127.0.0.1:3001`, для публичного домена `pestov-web.ru` нужно также настроить:

- A-запись домена на внешний IP `80.82.38.194`
- проброс портов `80` и `443` с роутера на `192.168.1.100`

Без этого Let's Encrypt не сможет выпустить сертификат для системного nginx.

### GitHub Secrets

Для workflow deploy нужны secrets:

- `PRODUCTION_ENV_FILE` — полный текст production `.env.production`

Базовый шаблон production env лежит в [.env.production.example](.env.production.example).

`PRODUCTION_ENV_FILE` должен содержать production-значения как минимум для:

- `DATABASE_URL=file:/data/portfolio.db`
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
- `RESEND_API_KEY`
- `CONTACT_EMAIL`

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

- Переход на SQLite рассчитан на чистую БД, перенос данных из PostgreSQL не выполняется.
- Активные миграции: `prisma/migrations-sqlite`; старые PostgreSQL-миграции сохранены в `prisma/migrations` только как история.
- Перед production deploy обновите `PRODUCTION_ENV_FILE`. Не запускайте старый образ PostgreSQL-приложения с SQLite-конфигурацией.
- Для резервной копии SQLite остановите app, скопируйте весь `/data` из контейнера в отдельный каталог резервных копий и запустите app. Не копируйте только файл БД во время записи. Не удаляйте volume через `down -v`.
- Prisma client генерируется в `generated/prisma`
- для доступа к MinIO-файлам используется прокси-роут `/api/media/[...path]`
- загрузка файлов доступна только пользователям с ролью `ADMIN`
