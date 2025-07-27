import Link from 'next/link';
import { siteConfig } from '@/lib/config/site';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-gray-950 hover:text-gray-700">
            {siteConfig.title}
          </Link>
        </div>
      </div>
    </header>
  );
}