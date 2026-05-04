import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Complete Guide to Web Crawling | Tech Blog',
  description: 'An in-depth article about web crawling techniques, best practices, and modern approaches to data extraction.',
  authors: [
    { name: 'Jane Smith', url: 'https://example.com/authors/jane-smith' },
    { name: 'Bob Wilson', url: 'https://example.com/authors/bob-wilson' },
  ],
  openGraph: {
    type: 'article',
    title: 'The Complete Guide to Web Crawling',
    description: 'An in-depth article about web crawling techniques and best practices.',
    url: 'https://example.com/test-crawl/article',
    siteName: 'Tech Blog',
    images: [
      {
        url: 'https://picsum.photos/1200/630',
        width: 1200,
        height: 630,
        alt: 'Web Crawling Illustration',
      },
    ],
    publishedTime: '2024-01-15T09:00:00.000Z',
    modifiedTime: '2024-02-20T14:30:00.000Z',
    expirationTime: '2025-01-15T09:00:00.000Z',
    authors: ['https://example.com/authors/jane-smith', 'https://example.com/authors/bob-wilson'],
    section: 'Technology',
    tags: ['web crawling', 'data extraction', 'SEO', 'web scraping', 'automation'],
  },
  other: {
    'article:published_time': '2024-01-15T09:00:00.000Z',
    'article:modified_time': '2024-02-20T14:30:00.000Z',
    'article:author': 'Jane Smith',
    'article:section': 'Technology',
    'article:tag': 'web crawling',
    'news_keywords': 'web crawling, scraping, data extraction',
  },
};

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="mb-8">
          <Link href="/test-crawl" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Test Crawl Index
          </Link>
        </nav>

        <article itemScope itemType="https://schema.org/Article">
          <header className="mb-8">
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                Technology
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                15 min read
              </span>
            </div>
            
            <h1 itemProp="headline" className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              The Complete Guide to Web Crawling: Techniques and Best Practices
            </h1>
            
            <p itemProp="description" className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              An in-depth exploration of web crawling techniques, from basic concepts to advanced implementations.
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 border-y border-gray-200 dark:border-gray-700 py-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div>
                  <span itemProp="author" className="font-medium text-gray-900 dark:text-white">Jane Smith</span>
                  <p className="text-xs">Senior Developer</p>
                </div>
              </div>
              <div className="ml-auto text-right">
                <time itemProp="datePublished" dateTime="2024-01-15">January 15, 2024</time>
                <p className="text-xs">Updated: <time itemProp="dateModified" dateTime="2024-02-20">Feb 20, 2024</time></p>
              </div>
            </div>
          </header>

          <figure className="mb-8">
            <img
              src="https://picsum.photos/800/400"
              alt="Web crawling concept illustration"
              className="w-full rounded-lg"
              itemProp="image"
            />
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              Illustration: Modern web crawling architecture
            </figcaption>
          </figure>

          <div itemProp="articleBody" className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Introduction to Web Crawling
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Web crawling, also known as web spidering, is the process of systematically browsing the World Wide Web, 
              typically for the purpose of web indexing. A web crawler is an Internet bot that visits web pages and 
              reads their contents to create entries for a search engine index.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Key Components of a Web Crawler
            </h2>
            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>URL Frontier</strong> - Queue of URLs to be crawled</li>
              <li><strong>HTTP Fetcher</strong> - Downloads web pages</li>
              <li><strong>Parser</strong> - Extracts links and content</li>
              <li><strong>Duplicate Detector</strong> - Prevents re-crawling</li>
              <li><strong>URL Filter</strong> - Applies crawling rules</li>
              <li><strong>Storage</strong> - Persists crawled data</li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Meta Tags and SEO
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Meta tags play a crucial role in how search engines understand and index web content. 
              Here are the most important meta tags for SEO:
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg my-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Essential Meta Tags</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">title</code> - The page title</li>
                <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">meta description</code> - Page summary</li>
                <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">meta robots</code> - Crawling instructions</li>
                <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">canonical</code> - Preferred URL</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Best Practices
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              When building a web crawler, always respect robots.txt, implement rate limiting, 
              and identify your bot with a proper User-Agent string.
            </p>

            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6">
              "The best crawlers are those that respect website owners while efficiently gathering the data they need."
              <footer className="text-sm mt-2">— Web Crawling Handbook</footer>
            </blockquote>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Conclusion
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Web crawling remains a fundamental technology for search engines, data analysis, and various 
              automation tasks. Understanding its components and best practices is essential for any developer 
              working in this space.
            </p>
          </div>

          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-600 dark:text-gray-400">Tags:</span>
              {['web crawling', 'SEO', 'data extraction', 'automation', 'web scraping'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
