import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const TOTAL_PAGES = 5;
const ITEMS_PER_PAGE = 10;

type Props = {
  params: Promise<{ page: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const pageNum = parseInt(page, 10);
  
  return {
    title: `Paginated Content - Page ${pageNum} | Crawler Test Suite`,
    description: `Page ${pageNum} of ${TOTAL_PAGES}. Test page for pagination meta tags and link rel="prev/next" extraction.`,
    alternates: {
      canonical: `https://example.com/test-crawl/pagination/${pageNum}`,
    },
    other: {
      'pagination:current': String(pageNum),
      'pagination:total': String(TOTAL_PAGES),
      'pagination:items-per-page': String(ITEMS_PER_PAGE),
      'pagination:total-items': String(TOTAL_PAGES * ITEMS_PER_PAGE),
      ...(pageNum > 1 && { 'pagination:prev': `https://example.com/test-crawl/pagination/${pageNum - 1}` }),
      ...(pageNum < TOTAL_PAGES && { 'pagination:next': `https://example.com/test-crawl/pagination/${pageNum + 1}` }),
    },
  };
}

export async function generateStaticParams() {
  return Array.from({ length: TOTAL_PAGES }, (_, i) => ({
    page: String(i + 1),
  }));
}

function generateItems(pageNum: number) {
  const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
  return Array.from({ length: ITEMS_PER_PAGE }, (_, i) => ({
    id: startIndex + i + 1,
    title: `Item ${startIndex + i + 1}`,
    description: `This is item number ${startIndex + i + 1} on page ${pageNum}. Each item represents a piece of content that would be paginated.`,
    date: new Date(2024, 0, TOTAL_PAGES * ITEMS_PER_PAGE - (startIndex + i)).toLocaleDateString(),
  }));
}

export default async function PaginationPage({ params }: Props) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);
  
  if (isNaN(pageNum) || pageNum < 1 || pageNum > TOTAL_PAGES) {
    notFound();
  }

  const items = generateItems(pageNum);
  const hasPrev = pageNum > 1;
  const hasNext = pageNum < TOTAL_PAGES;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-8">
          <Link href="/test-crawl" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Test Crawl Index
          </Link>
        </nav>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Paginated Content Test
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Page {pageNum} of {TOTAL_PAGES} • {ITEMS_PER_PAGE} items per page • {TOTAL_PAGES * ITEMS_PER_PAGE} total items
            </p>
          </header>

          {/* Pagination Meta Info */}
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h2 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Pagination Meta Tags
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <code className="text-blue-600">pagination:current</code>: {pageNum}
              </div>
              <div>
                <code className="text-blue-600">pagination:total</code>: {TOTAL_PAGES}
              </div>
              {hasPrev && (
                <div>
                  <code className="text-blue-600">pagination:prev</code>: /pagination/{pageNum - 1}
                </div>
              )}
              {hasNext && (
                <div>
                  <code className="text-blue-600">pagination:next</code>: /pagination/{pageNum + 1}
                </div>
              )}
            </div>
          </div>

          {/* Link rel="prev/next" demonstration */}
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <h2 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Link Tags (rel="prev/next")
            </h2>
            <pre className="text-xs text-green-700 dark:text-green-300 overflow-x-auto">
{hasPrev && `<link rel="prev" href="/test-crawl/pagination/${pageNum - 1}" />\n`}
{`<link rel="canonical" href="/test-crawl/pagination/${pageNum}" />\n`}
{hasNext && `<link rel="next" href="/test-crawl/pagination/${pageNum + 1}" />`}
            </pre>
          </div>

          {/* Content Items */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Items on This Page
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap ml-4">
                      {item.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pagination Controls */}
          <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
            {/* First Page */}
            <Link
              href="/test-crawl/pagination/1"
              className={`px-3 py-2 rounded ${pageNum === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'}`}
              aria-disabled={pageNum === 1}
            >
              ««
            </Link>

            {/* Previous */}
            {hasPrev ? (
              <Link
                href={`/test-crawl/pagination/${pageNum - 1}`}
                rel="prev"
                className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              >
                ← Prev
              </Link>
            ) : (
              <span className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed">
                ← Prev
              </span>
            )}

            {/* Page Numbers */}
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/test-crawl/pagination/${p}`}
                className={`px-4 py-2 rounded font-medium ${
                  p === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
                aria-current={p === pageNum ? 'page' : undefined}
              >
                {p}
              </Link>
            ))}

            {/* Next */}
            {hasNext ? (
              <Link
                href={`/test-crawl/pagination/${pageNum + 1}`}
                rel="next"
                className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              >
                Next →
              </Link>
            ) : (
              <span className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed">
                Next →
              </span>
            )}

            {/* Last Page */}
            <Link
              href={`/test-crawl/pagination/${TOTAL_PAGES}`}
              className={`px-3 py-2 rounded ${pageNum === TOTAL_PAGES ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'}`}
              aria-disabled={pageNum === TOTAL_PAGES}
            >
              »»
            </Link>
          </nav>
        </article>
      </div>
    </div>
  );
}
