import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Open Graph Meta Tags Test | Crawler Test Suite',
  description: 'Test page featuring comprehensive Open Graph protocol meta tags for social media sharing validation.',
  openGraph: {
    title: 'Open Graph Test Page - Social Sharing Preview',
    description: 'This page demonstrates Open Graph meta tags used by Facebook, LinkedIn, and other social platforms.',
    url: 'https://example.com/test-crawl/opengraph',
    siteName: 'Crawler Test Suite',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/1200/630',
        width: 1200,
        height: 630,
        alt: 'Open Graph Test Image - Primary',
        type: 'image/jpeg',
      },
      {
        url: 'https://picsum.photos/800/600',
        width: 800,
        height: 600,
        alt: 'Open Graph Test Image - Secondary',
      },
    ],
    countryName: 'United States',
    emails: ['contact@example.com'],
    phoneNumbers: ['+1-555-123-4567'],
    faxNumbers: ['+1-555-123-4568'],
  },
  other: {
    'og:locale:alternate': 'es_ES',
    'og:see_also': 'https://example.com/related-page',
  },
};

export default function OpenGraphPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-8">
          <Link href="/test-crawl" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Test Crawl Index
          </Link>
        </nav>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Social Preview Card Mockup */}
          <div className="bg-gray-100 dark:bg-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Social Media Preview (How this page appears when shared)
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden max-w-md">
              <img
                src="https://picsum.photos/600/315"
                alt="Social preview"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase">example.com</p>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Open Graph Test Page - Social Sharing Preview
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This page demonstrates Open Graph meta tags used by Facebook, LinkedIn...
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <header>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Open Graph Meta Tags Test
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Open Graph protocol enables any web page to become a rich object in a social graph.
              </p>
            </header>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Open Graph Tags on This Page
              </h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Basic OG Tags</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div><code className="text-blue-600">og:title</code>: Open Graph Test Page</div>
                    <div><code className="text-blue-600">og:type</code>: website</div>
                    <div><code className="text-blue-600">og:url</code>: https://example.com/...</div>
                    <div><code className="text-blue-600">og:site_name</code>: Crawler Test Suite</div>
                    <div><code className="text-blue-600">og:locale</code>: en_US</div>
                    <div><code className="text-blue-600">og:locale:alternate</code>: es_ES</div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Image Tags</h3>
                  <div className="text-sm space-y-1">
                    <div><code className="text-green-600">og:image</code>: https://picsum.photos/1200/630</div>
                    <div><code className="text-green-600">og:image:width</code>: 1200</div>
                    <div><code className="text-green-600">og:image:height</code>: 630</div>
                    <div><code className="text-green-600">og:image:alt</code>: Open Graph Test Image</div>
                    <div><code className="text-green-600">og:image:type</code>: image/jpeg</div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Contact Tags</h3>
                  <div className="text-sm space-y-1">
                    <div><code className="text-purple-600">og:email</code>: contact@example.com</div>
                    <div><code className="text-purple-600">og:phone_number</code>: +1-555-123-4567</div>
                    <div><code className="text-purple-600">og:country-name</code>: United States</div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Supported Platforms
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Facebook', 'LinkedIn', 'Pinterest', 'Slack'].map((platform) => (
                  <div
                    key={platform}
                    className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-2xl mb-2 block">
                      {platform === 'Facebook' && '📘'}
                      {platform === 'LinkedIn' && '💼'}
                      {platform === 'Pinterest' && '📌'}
                      {platform === 'Slack' && '💬'}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{platform}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
