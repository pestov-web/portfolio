import Link from "next/link";
import Image from "next/image";
import type { PostPreview } from "../model";
import { toRenderableFileUrl } from "@/shared/lib/media";

// Иконка замка — для закрытых постов
function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="7" width="10" height="8" rx="1" />
      <path d="M5 7V5a3 3 0 016 0v2" />
    </svg>
  );
}

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

type Props = {
  post: PostPreview;
  locale: string;
  readMoreLabel: string;
};

export function PostCard({ post, locale, readMoreLabel }: Props) {
  const href = `/${locale}/blog/${post.slug}`;

  return (
    <article className="glass flex flex-col overflow-hidden group">
      {/* Обложка */}
      {post.coverImage && (
        <div className="relative h-44 overflow-hidden">
          <Image
            src={toRenderableFileUrl(post.coverImage)}
            alt={post.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Теги + дата */}
        <div className="flex items-center justify-between gap-2 text-xs text-faint">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map(({ tag }) => (
              <Link
                key={tag.slug}
                href={`/${locale}/blog?tag=${tag.slug}`}
                className="px-2 py-0.5 rounded-full bg-subtle text-muted hover:text-accent no-underline transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
          <time dateTime={post.createdAt.toISOString()} className="shrink-0">
            {formatDate(post.createdAt, locale)}
          </time>
        </div>

        {/* Заголовок */}
        <h2 className="text-base font-semibold leading-snug line-clamp-2">
          <Link href={href} className="no-underline hover:text-accent transition-colors">
            {post.restricted && (
              <span className="inline-flex items-center mr-1.5 text-faint">
                <LockIcon />
              </span>
            )}
            {post.title}
          </Link>
        </h2>

        {/* Анонс */}
        {post.excerpt && (
          <p className="text-sm text-muted line-clamp-3 leading-relaxed flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Читать далее */}
        <Link
          href={href}
          className="mt-auto text-xs font-medium text-accent hover:text-accent-vivid no-underline transition-colors"
        >
          {readMoreLabel} →
        </Link>
      </div>
    </article>
  );
}
