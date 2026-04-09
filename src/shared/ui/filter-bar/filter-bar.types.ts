export type FilterBarItem = {
  label: string;
  href: string;
  isActive: boolean;
};

export type FilterBarProps = {
  title: string;
  items: FilterBarItem[];
};