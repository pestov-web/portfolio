"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "@/shared/config/auth-client";
import { addComment, deleteComment } from "../actions";

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  user: { id: string; name: string; image: string | null };
};

type Props = {
  postId: string;
  comments: Comment[];
  locale: string;
};

function formatRelative(date: Date, locale: string) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  const rtf = new Intl.RelativeTimeFormat(locale === "ru" ? "ru" : "en", { numeric: "auto" });
  if (minutes < 60) return rtf.format(-minutes, "minute");
  if (hours < 24) return rtf.format(-hours, "hour");
  return rtf.format(-days, "day");
}

export function CommentsSection({ postId, comments, locale }: Props) {
  const t = useTranslations("blog.comments");
  const { data: session } = useSession();

  const addCommentBound = addComment.bind(null, postId, locale);

  return (
    <section>
      <h2 className="text-lg font-semibold accent-line mb-6">{t("title")}</h2>

      {/* Список комментариев */}
      {comments.length === 0 ? (
        <p className="text-sm text-faint mb-6">{t("empty")}</p>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {/* Аватар */}
              <div className="shrink-0 size-8 rounded-full bg-subtle overflow-hidden">
                {comment.user.image ? (
                  <Image
                    src={comment.user.image}
                    alt={comment.user.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <div className="size-8 flex items-center justify-center text-xs font-medium text-faint">
                    {comment.user.name[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Тело комментария */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium leading-none">{comment.user.name}</span>
                  <time className="text-xs text-faint" dateTime={comment.createdAt.toISOString()}>
                    {formatRelative(new Date(comment.createdAt), locale)}
                  </time>
                </div>
                <p className="text-sm text-muted leading-relaxed break-words">{comment.content}</p>
              </div>

              {/* Удалить — только автор или ADMIN */}
              {session && (session.user.id === comment.user.id || session.user.role === "ADMIN") && (
                <form
                  action={deleteComment.bind(null, comment.id, locale)}
                  className="shrink-0"
                >
                  <button
                    type="submit"
                    title="Удалить"
                    className="text-faint hover:text-red-500 transition-colors text-xs"
                  >
                    ✕
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Форма добавления */}
      {session ? (
        <form action={addCommentBound} className="flex flex-col gap-3">
          <textarea
            name="content"
            rows={3}
            required
            maxLength={2000}
            placeholder={t("placeholder")}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid transition-colors resize-none"
          />
          <button
            type="submit"
            className="self-end px-4 py-2 bg-accent-vivid text-white text-sm font-medium rounded-md hover:bg-accent-dim transition-colors"
          >
            {t("submit")}
          </button>
        </form>
      ) : (
        <p className="text-sm text-faint">{t("loginRequired")}</p>
      )}
    </section>
  );
}
