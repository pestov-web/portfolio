export type CommentItem = {
  id: string;
  content: string;
  createdAt: Date;
  user: { id: string; name: string; image: string | null };
};

export type CommentsSectionProps = {
  postId: string;
  comments: CommentItem[];
  locale: string;
};