'use client';

import Link from 'next/link';

const subPages = [
  {
    href: '/test-crawl/basic-meta',
    title: 'Basic Meta Tags',
    description: 'Page with standard HTML meta tags (title, description, keywords, author)',
  },
  {
    href: '/test-crawl/opengraph',
    title: 'Open Graph Meta Tags',
    description: 'Page with Open Graph protocol meta tags for social sharing',
  },
  {
    href: '/test-crawl/twitter-cards',
    title: 'Twitter Card Meta Tags',
    description: 'Page with Twitter Card meta tags for Twitter sharing',
  },
  {
    href: '/test-crawl/article',
    title: 'Article Page',
    description: 'Blog article with article-specific meta tags and structured content',
  },
  {
    href: '/test-crawl/product',
    title: 'Product Page',
    description: 'E-commerce product page with product schema and meta tags',
  },
  {
    href: '/test-crawl/structured-data',
    title: 'JSON-LD Structured Data',
    description: 'Page with rich JSON-LD structured data for search engines',
  },
  {
    href: '/test-crawl/custom-meta',
    title: 'Custom Meta Tags',
    description: 'Page with custom application-specific meta tags',
  },
  {
    href: '/test-crawl/deep-links',
    title: 'Deep Links Page',
    description: 'Page with many internal and external links for crawl testing',
  },
  {
    href: '/test-crawl/multimedia',
    title: 'Multimedia Content',
    description: 'Page with images, videos, and media-related meta tags',
  },
  {
    href: '/test-crawl/pagination/1',
    title: 'Paginated Content',
    description: 'Multi-page content with pagination meta tags',
  },
];

export default function TestCrawlIndex() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🕷️ Crawler Test Pages
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            A collection of test pages with various meta tags and content types for testing web crawlers
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                {page.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{page.description}</p>
            </Link>
          ))}
        </div>

        <section className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Available Meta Tag Types
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Standard HTML Meta</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                <li>title, description, keywords</li>
                <li>author, robots, viewport</li>
                <li>charset, content-type</li>
                <li>canonical, alternate</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Open Graph (og:)</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                <li>og:title, og:description</li>
                <li>og:image, og:url, og:type</li>
                <li>og:site_name, og:locale</li>
                <li>og:article:*, og:product:*</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Twitter Cards</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                <li>twitter:card, twitter:site</li>
                <li>twitter:title, twitter:description</li>
                <li>twitter:image, twitter:creator</li>
                <li>twitter:player (for video)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Custom Application</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                <li>application-name, theme-color</li>
                <li>Custom data-* attributes</li>
                <li>App-specific meta tags</li>
                <li>JSON-LD structured data</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>Crawler Test Suite v1.0 | For testing meta tag extraction</p>
        </div>
      </footer>
    </div>
  );
}
