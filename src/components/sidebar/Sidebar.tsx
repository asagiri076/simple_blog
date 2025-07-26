import { Category } from '@/types/microcms';
import { CategoryWithCount } from '@/lib/data/prebuiltData';
import TagListSidebar from '@/components/sidebar/TagListSidebar';
import StaticPageLinks from '@/components/sidebar/StaticPageLinks';

interface SidebarProps {
  categories: Category[] | CategoryWithCount[];
}

export default function Sidebar({ categories }: SidebarProps) {
  return (
    <aside className="w-full lg:w-80 space-y-6">
      <TagListSidebar categories={categories} />
      <StaticPageLinks />
    </aside>
  );
}