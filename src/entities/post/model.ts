// Тип для краткого представления поста (карточка в списке)
export type PostPreview = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  restricted: boolean;
  createdAt: Date;
  tags: { tag: { name: string; slug: string } }[];
};
