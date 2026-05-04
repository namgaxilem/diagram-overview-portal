import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Basic Meta Tags Test Page | Crawler Test Suite',
  description: 'This is a comprehensive test page featuring standard HTML meta tags for web crawler testing and validation.',
  keywords: ['crawler', 'meta tags', 'SEO', 'web scraping', 'HTML', 'testing'],
  authors: [{ name: 'John Doe', url: 'https://example.com/authors/john' }],
  creator: 'Test Suite Generator',
  publisher: 'Crawler Test Inc.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://example.com/test-crawl/basic-meta',
    languages: {
      'en-US': 'https://example.com/en-US/test-crawl/basic-meta',
      'es-ES': 'https://example.com/es-ES/test-crawl/basic-meta',
      'fr-FR': 'https://example.com/fr-FR/test-crawl/basic-meta',
    },
  },
  category: 'Technology',
  classification: 'Test Page',
  other: {
    'revisit-after': '7 days',
    'distribution': 'global',
    'rating': 'general',
    'coverage': 'worldwide',
    'target': 'all',
    'HandheldFriendly': 'true',
    'MobileOptimized': '320',
  },
};

export default function BasicMetaPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-8">
          <Link href="/test-crawl" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Test Crawl Index
          </Link>
        </nav>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <header>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Basic Meta Tags Test Page
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This page demonstrates standard HTML meta tags that web crawlers should extract.
            </p>
          </header>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Meta Tags Present on This Page
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Meta Tag</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Value</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-sm">title</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Basic Meta Tags Test Page | Crawler Test Suite</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-sm">description</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">This is a comprehensive test page...</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-sm">keywords</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">crawler, meta tags, SEO, web scraping, HTML, testing</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-sm">author</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">John Doe</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-sm">robots</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">index, follow</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-sm">canonical</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">https://example.com/test-crawl/basic-meta</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Rich Text Content
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This section contains rich text content for crawlers to index. It includes various HTML elements:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li><strong>Bold text</strong> for emphasis</li>
              <li><em>Italic text</em> for styling</li>
              <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Inline code</code> for technical terms</li>
              <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Hyperlinks</a> for navigation</li>
            </ul>
            
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4">
              "This is a blockquote that crawlers should be able to identify and extract."
            </blockquote>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Sample Data Attributes
            </h2>
            <div 
              data-page-type="test"
              data-category="meta-tags"
              data-version="1.0"
              data-crawl-priority="high"
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded"
            >
              <p className="text-gray-700 dark:text-gray-300">
                This div contains custom data-* attributes that your crawler might want to extract.
              </p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
