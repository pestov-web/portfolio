// Тип для краткого представления проекта (карточка в списке)
export type ProjectPreview = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  tags: { tag: { name: string; slug: string } }[];
};
