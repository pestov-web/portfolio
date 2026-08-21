import Link from "next/link";
import { ArrowRightIcon, LockIcon } from "@/shared/ui";
import { postCardClassNames } from "./post-card.styles";
import type { PostCardProps } from "./post-card.types";

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function PostCard({ post, locale, readMoreLabel }: PostCardProps) {
  const href = `/${locale}/blog/${post.slug}`;

  return (
    <article className={postCardClassNames.root}>
      <div className={postCardClassNames.meta}>
        <time dateTime={post.createdAt.toISOString()} className={postCardClassNames.date}>
          {formatDate(post.createdAt, locale)}
        </time>
        <div className={postCardClassNames.tags} translate="no">
          {post.tags.slice(0, 3).map(({ tag }) => (
            <Link
              key={tag.slug}
              href={`/${locale}/blog?tag=${tag.slug}`}
              className={postCardClassNames.tagLink}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>

      <div className={postCardClassNames.body}>
        <h2 className={postCardClassNames.title}>
          <Link href={href} className={postCardClassNames.titleLink}>
            {post.restricted ? (
              <span className={postCardClassNames.lock}>
                <LockIcon />
              </span>
            ) : null}
            {post.title}
          </Link>
        </h2>

        {post.excerpt ? <p className={postCardClassNames.excerpt}>{post.excerpt}</p> : null}

        <Link href={href} className={postCardClassNames.action}>
          {readMoreLabel} <ArrowRightIcon aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export { postCardClassNames } from "./post-card.styles";
export type { PostCardProps } from "./post-card.types";
