"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button, TextArea } from "@/shared/ui";
import { addComment, initialCommentActionState } from "../comment-actions";
import { commentsSectionClassNames } from "./comments-section.styles";
import type { CommentFormProps } from "./comments-section.types";

export function CommentForm({ postId, locale, placeholder, submitLabel }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const addCommentBound = addComment.bind(null, postId, locale);
  const [state, formAction, pending] = useActionState(addCommentBound, initialCommentActionState);

  useEffect(() => {
    if (state.submittedAt) {
      formRef.current?.reset();
    }
  }, [state.submittedAt]);

  return (
    <form ref={formRef} action={formAction} className={commentsSectionClassNames.form}>
      <TextArea
        name="content"
        rows={3}
        required
        maxLength={2000}
        placeholder={placeholder}
        className={commentsSectionClassNames.textarea}
      />
      {state.error ? (
        <p className={commentsSectionClassNames.formError} aria-live="polite">{state.error}</p>
      ) : null}
      <Button type="submit" variant="primary" className={commentsSectionClassNames.submit} disabled={pending}>
        {pending ? "..." : submitLabel}
      </Button>
    </form>
  );
}