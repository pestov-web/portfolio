"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "@/shared/auth/index";
import { Button, TextArea } from "@/shared/ui";
import { addComment, deleteComment } from "../comment-actions";
import { commentsSectionClassNames } from "./comments-section.styles";
import type { CommentsSectionProps } from "./comments-section.types";

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

export function CommentsSection({ postId, comments, locale }: CommentsSectionProps) {
  const t = useTranslations("blog.comments");
  const { data: session } = useSession();

  const addCommentBound = addComment.bind(null, postId, locale);

  return (
    <section>
      <h2 className={commentsSectionClassNames.title}>{t("title")}</h2>

      {comments.length === 0 ? (
        <p className={commentsSectionClassNames.empty}>{t("empty")}</p>
      ) : (
        <div className={commentsSectionClassNames.list}>
          {comments.map((comment) => (
            <div key={comment.id} className={commentsSectionClassNames.item}>
              <div className={commentsSectionClassNames.avatar}>
                {comment.user.image ? (
                  <Image
                    src={comment.user.image}
                    alt={comment.user.name}
                    width={32}
                    height={32}
                    className={commentsSectionClassNames.avatarImage}
                  />
                ) : (
                  <div className={commentsSectionClassNames.avatarFallback}>
                    {comment.user.name[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <div className={commentsSectionClassNames.content}>
                <div className={commentsSectionClassNames.meta}>
                  <span className={commentsSectionClassNames.author}>{comment.user.name}</span>
                  <time className={commentsSectionClassNames.time} dateTime={comment.createdAt.toISOString()}>
                    {formatRelative(new Date(comment.createdAt), locale)}
                  </time>
                </div>
                <p className={commentsSectionClassNames.text}>{comment.content}</p>
              </div>

              {session && (session.user.id === comment.user.id || session.user.role === "ADMIN") ? (
                <form action={deleteComment.bind(null, comment.id, locale)} className={commentsSectionClassNames.deleteForm}>
                  <button type="submit" title={t("delete")} className={commentsSectionClassNames.deleteButton}>
                    ✕
                  </button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {session ? (
        <form action={addCommentBound} className={commentsSectionClassNames.form}>
          <TextArea
            name="content"
            rows={3}
            required
            maxLength={2000}
            placeholder={t("placeholder")}
            className={commentsSectionClassNames.textarea}
          />
          <Button type="submit" variant="primary" className={commentsSectionClassNames.submit}>
            {t("submit")}
          </Button>
        </form>
      ) : (
        <p className={commentsSectionClassNames.loginRequired}>{t("loginRequired")}</p>
      )}
    </section>
  );
}

export { commentsSectionClassNames } from "./comments-section.styles";
export type { CommentItem, CommentsSectionProps } from "./comments-section.types";