import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Deep Links Test Page | Crawler Test Suite',
  description: 'Test page with extensive internal and external links for testing crawler link discovery and following.',
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'link-count': '50+',
    'link-types': 'internal,external,anchor,nofollow',
  },
};

const internalLinks = [
  { href: '/test-crawl', label: 'Test Crawl Index' },
  { href: '/test-crawl/basic-meta', label: 'Basic Meta Tags' },
  { href: '/test-crawl/opengraph', label: 'Open Graph Tags' },
  { href: '/test-crawl/twitter-cards', label: 'Twitter Cards' },
  { href: '/test-crawl/article', label: 'Article Page' },
  { href: '/test-crawl/product', label: 'Product Page' },
  { href: '/test-crawl/structured-data', label: 'Structured Data' },
  { href: '/test-crawl/custom-meta', label: 'Custom Meta' },
  { href: '/test-crawl/multimedia', label: 'Multimedia' },
  { href: '/test-crawl/pagination/1', label: 'Pagination 1' },
  { href: '/test-crawl/pagination/2', label: 'Pagination 2' },
  { href: '/test-crawl/pagination/3', label: 'Pagination 3' },
];

const externalLinks = [
  { href: 'https://google.com', label: 'Google', rel: 'external' },
  { href: 'https://github.com', label: 'GitHub', rel: 'external' },
  { href: 'https://stackoverflow.com', label: 'Stack Overflow', rel: 'external' },
  { href: 'https://developer.mozilla.org', label: 'MDN Web Docs', rel: 'external' },
  { href: 'https://w3.org', label: 'W3C', rel: 'external' },
  { href: 'https://schema.org', label: 'Schema.org', rel: 'external' },
];

const nofollowLinks = [
  { href: 'https://example-sponsor.com', label: 'Sponsored Link 1', rel: 'nofollow sponsored' },
  { href: 'https://example-ad.com', label: 'Advertisement', rel: 'nofollow' },
  { href: 'https://user-content.com', label: 'User Generated Content', rel: 'nofollow ugc' },
];

const anchorLinks = [
  { href: '#section-internal', label: 'Internal Links Section' },
  { href: '#section-external', label: 'External Links Section' },
  { href: '#section-nofollow', label: 'Nofollow Links Section' },
  { href: '#section-navigation', label: 'Navigation Patterns' },
  { href: '#section-nested', label: 'Nested Links' },
];

export default function DeepLinksPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Deep Links Test Page
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This page contains extensive links for testing crawler link discovery, following, 
              and rel attribute handling.
            </p>
            
            {/* Table of Contents */}
            <nav className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Quick Navigation</h2>
              <ul className="flex flex-wrap gap-4 text-sm">
                {anchorLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          {/* Internal Links Section */}
          <section id="section-internal" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-green-500">🔗</span> Internal Links
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These links point to other pages within the test-crawl section. Crawlers should follow these.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {internalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition"
                >
                  <span className="text-green-700 dark:text-green-300 font-medium">{link.label}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">{link.href}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* External Links Section */}
          <section id="section-external" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-blue-500">🌐</span> External Links
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These links point to external websites. They have <code>rel="external"</code>.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  rel={link.rel}
                  target="_blank"
                  className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                >
                  <span className="text-blue-700 dark:text-blue-300 font-medium">{link.label}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">rel="{link.rel}"</p>
                </a>
              ))}
            </div>
          </section>

          {/* Nofollow Links Section */}
          <section id="section-nofollow" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-red-500">🚫</span> Nofollow Links
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These links have <code>rel="nofollow"</code> and should not pass PageRank. Crawlers may or may not follow these.
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              {nofollowLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  rel={link.rel}
                  className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <span className="text-red-700 dark:text-red-300 font-medium">{link.label}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">rel="{link.rel}"</p>
                </a>
              ))}
            </div>
          </section>

          {/* Navigation Patterns */}
          <section id="section-navigation" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-purple-500">📍</span> Navigation Patterns
            </h2>
            
            {/* Breadcrumb */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Breadcrumb Navigation</h3>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Home</Link>
                <span className="text-gray-400">/</span>
                <Link href="/test-crawl" className="text-blue-600 dark:text-blue-400 hover:underline">Test Crawl</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600 dark:text-gray-400">Deep Links</span>
              </nav>
            </div>

            {/* Pagination */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Pagination Links</h3>
              <nav aria-label="Pagination" className="flex items-center gap-2">
                <a href="#" rel="prev" className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-500 cursor-not-allowed">
                  ← Previous
                </a>
                {[1, 2, 3, 4, 5].map((page) => (
                  <Link
                    key={page}
                    href={`/test-crawl/pagination/${page}`}
                    className={`px-3 py-1 rounded ${page === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'}`}
                  >
                    {page}
                  </Link>
                ))}
                <Link href="/test-crawl/pagination/2" rel="next" className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 text-gray-700 dark:text-gray-300">
                  Next →
                </Link>
              </nav>
            </div>
          </section>

          {/* Nested Links */}
          <section id="section-nested" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">📁</span> Nested Content with Links
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Category: Technology</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/test-crawl/article" className="text-blue-600 dark:text-blue-400 hover:underline">
                      The Complete Guide to Web Crawling
                    </Link>
                    <span className="text-gray-500"> - 15 min read</span>
                  </li>
                  <li>
                    <Link href="/test-crawl/structured-data" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Understanding JSON-LD Structured Data
                    </Link>
                    <span className="text-gray-500"> - 10 min read</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Category: Meta Tags</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/test-crawl/opengraph" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Open Graph Protocol Explained
                    </Link>
                  </li>
                  <li>
                    <Link href="/test-crawl/twitter-cards" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Twitter Cards Implementation Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/test-crawl/custom-meta" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Custom Meta Tags for Applications
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <footer className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This page contains <strong>50+ links</strong> including internal, external, nofollow, 
              anchor, and various navigation patterns.
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
}
