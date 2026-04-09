import type { ProjectPreview } from "../../model";

export type ProjectCardProps = {
  project: ProjectPreview;
  locale: string;
  viewProjectLabel: string;
  viewCodeLabel: string;
  viewDemoLabel: string;
};