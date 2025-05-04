'use client';

import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
};

export default function Pagination({ 
  currentPage, 
  totalPages, 
  basePath,
  searchParams = {}
}: PaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;
  
  // Create an array of page numbers to display
  const pageNumbers = [];
  const maxPagesToShow = 5;
  
  // Always show first page, last page, current page, and pages around current
  if (totalPages <= maxPagesToShow) {
    // Show all pages if there are fewer than maxPagesToShow
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always include page 1
    pageNumbers.push(1);
    
    // Calculate start and end of page range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after page 1 if needed
    if (startPage > 2) {
      pageNumbers.push(-1); // -1 represents ellipsis
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push(-2); // -2 represents ellipsis
    }
    
    // Always include last page
    pageNumbers.push(totalPages);
  }
  
  // Build URL with search params
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    
    // Add existing search params
    for (const [key, value] of Object.entries(searchParams)) {
      if (key !== 'page') {
        params.append(key, value);
      }
    }
    
    // Add page param
    params.append('page', page.toString());
    
    return `${basePath}?${params.toString()}`;
  };
  
  return (
    <nav className="flex justify-center mt-8" aria-label="Pagination">
      <ul className="flex space-x-1">
        {/* Previous page button */}
        {currentPage > 1 && (
          <li>
            <Link 
              href={getPageUrl(currentPage - 1)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Previous page"
            >
              &laquo;
            </Link>
          </li>
        )}
        
        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          // Render ellipsis
          if (page < 0) {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="px-3 py-2 text-sm">&hellip;</span>
              </li>
            );
          }
          
          // Render page number
          return (
            <li key={page}>
              <Link
                href={getPageUrl(page)}
                className={`px-3 py-2 border ${currentPage === page 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                } rounded-md text-sm font-medium`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </Link>
            </li>
          );
        })}
        
        {/* Next page button */}
        {currentPage < totalPages && (
          <li>
            <Link 
              href={getPageUrl(currentPage + 1)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Next page"
            >
              &raquo;
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}