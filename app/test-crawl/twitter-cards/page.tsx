import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Twitter Card Meta Tags Test | Crawler Test Suite',
  description: 'Test page with comprehensive Twitter Card meta tags for testing tweet preview extraction.',
  twitter: {
    card: 'summary_large_image',
    site: '@testcrawler',
    creator: '@johndoe',
    title: 'Twitter Card Test - Large Image Summary',
    description: 'This page demonstrates Twitter Card meta tags for rich tweet previews. Perfect for testing crawler extraction.',
    images: {
      url: 'https://picsum.photos/1200/600',
      alt: 'Twitter Card Test Image with descriptive alt text',
    },
  },
  other: {
    'twitter:domain': 'example.com',
    'twitter:label1': 'Reading Time',
    'twitter:data1': '5 minutes',
    'twitter:label2': 'Category',
    'twitter:data2': 'Technology',
  },
};

export default function TwitterCardsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-8">
          <Link href="/test-crawl" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Test Crawl Index
          </Link>
        </nav>

        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Twitter Preview Mockup */}
          <div className="bg-sky-50 dark:bg-sky-900/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐦</span>
              <h3 className="text-sm font-medium text-sky-700 dark:text-sky-300">
                Twitter Preview (summary_large_image card)
              </h3>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md">
              <img
                src="https://picsum.photos/600/300"
                alt="Twitter card preview"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="font-bold text-gray-900 dark:text-white text-base">
                  Twitter Card Test - Large Image Summary
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This page demonstrates Twitter Card meta tags for rich tweet previews...
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                  <span>🔗</span> example.com
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <header>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Twitter Card Meta Tags Test
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Twitter Cards enable you to attach rich photos, videos, and media to Tweets.
              </p>
            </header>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Twitter Tags on This Page
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-sky-100 dark:bg-sky-900/50">
                      <th className="px-4 py-3 text-left text-sky-800 dark:text-sky-200">Tag</th>
                      <th className="px-4 py-3 text-left text-sky-800 dark:text-sky-200">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm text-sky-600">twitter:card</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">summary_large_image</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm text-sky-600">twitter:site</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">@testcrawler</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm text-sky-600">twitter:creator</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">@johndoe</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm text-sky-600">twitter:title</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Twitter Card Test - Large Image Summary</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm text-sky-600">twitter:description</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">This page demonstrates Twitter Card meta tags...</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm text-sky-600">twitter:image</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">https://picsum.photos/1200/600</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm text-sky-600">twitter:image:alt</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Twitter Card Test Image...</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm text-sky-600">twitter:label1</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Reading Time</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm text-sky-600">twitter:data1</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">5 minutes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Card Types
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-sky-500">
                  <h3 className="font-semibold text-sky-600 mb-2">summary_large_image ✓</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Featured on this page. Shows a large image above the title.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">summary</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Default card with small square image on the left.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">app</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    For mobile app download cards with install buttons.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">player</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    For video/audio content with inline player.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
