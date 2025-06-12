import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    if (page === 1) return basePath;
    return `${basePath}?page=${page}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(
        <Link
          key={1}
          href={getPageUrl(1)}
          className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          1
        </Link>
      );
      
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-3 py-2 text-sm text-gray-500">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={getPageUrl(i)}
          className={`px-3 py-2 text-sm border ${
            i === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </Link>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-3 py-2 text-sm text-gray-500">
            ...
          </span>
        );
      }
      
      pages.push(
        <Link
          key={totalPages}
          href={getPageUrl(totalPages)}
          className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  return (
    <nav className="flex justify-center mt-8">
      <div className="flex rounded-md shadow-sm">
        {currentPage > 1 && (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-l-md"
          >
            前へ
          </Link>
        )}
        
        {renderPageNumbers()}
        
        {currentPage < totalPages && (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-r-md"
          >
            次へ
          </Link>
        )}
      </div>
    </nav>
  );
}