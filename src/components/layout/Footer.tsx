import { siteConfig } from '@/lib/config/site';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600 text-sm">
          <p>{siteConfig.copyright}</p>
        </div>
      </div>
    </footer>
  );
}