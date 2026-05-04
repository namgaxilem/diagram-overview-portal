import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Custom Meta Tags Test | Crawler Test Suite',
  description: 'Test page with custom application-specific meta tags for crawler extraction testing.',
  applicationName: 'Crawler Test App',
  generator: 'Next.js 15',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'dark light',
  creator: 'Crawler Test Team',
  publisher: 'Crawler Test Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://example.com'),
  other: {
    // Custom application meta tags
    'app:id': 'com.crawlertest.app',
    'app:name': 'Crawler Test Application',
    'app:version': '2.5.1',
    'app:build': '20240215',
    'app:environment': 'production',
    
    // Custom content meta tags
    'content:type': 'test-page',
    'content:category': 'meta-tags',
    'content:subcategory': 'custom',
    'content:language': 'en-US',
    'content:region': 'global',
    'content:audience': 'developers',
    'content:difficulty': 'intermediate',
    
    // Custom tracking meta tags
    'tracking:page-id': 'test-crawl-custom-meta',
    'tracking:section': 'test-suite',
    'tracking:experiment': 'crawler-v2',
    'tracking:variant': 'A',
    
    // Custom business meta tags
    'business:unit': 'engineering',
    'business:team': 'platform',
    'business:owner': 'crawler-team',
    'business:priority': 'high',
    
    // Custom date meta tags
    'date:created': '2024-01-01',
    'date:modified': '2024-02-15',
    'date:expires': '2025-01-01',
    'date:reviewed': '2024-02-10',
    
    // Custom feature flags
    'feature:beta': 'true',
    'feature:experimental': 'false',
    'feature:deprecated': 'false',
    
    // Custom SEO hints
    'seo:priority': '0.8',
    'seo:changefreq': 'weekly',
    'seo:indexable': 'true',
    
    // Dublin Core meta tags
    'DC.title': 'Custom Meta Tags Test Page',
    'DC.creator': 'Crawler Test Team',
    'DC.subject': 'meta tags, testing, crawling',
    'DC.description': 'A test page for custom meta tag extraction',
    'DC.publisher': 'Crawler Test Inc.',
    'DC.date': '2024-02-15',
    'DC.type': 'Text',
    'DC.format': 'text/html',
    'DC.language': 'en',
    
    // ICBM (geo) coordinates
    'ICBM': '37.7749, -122.4194',
    'geo.position': '37.7749;-122.4194',
    'geo.placename': 'San Francisco',
    'geo.region': 'US-CA',
    
    // Mobile app meta tags
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Crawler Test',
    'mobile-web-app-capable': 'yes',
    
    // Microsoft meta tags
    'msapplication-TileColor': '#2d89ef',
    'msapplication-config': '/browserconfig.xml',
    
    // Theme color
    'theme-color': '#1a1a2e',
  },
};

export default function CustomMetaPage() {
  const metaGroups = [
    {
      name: 'Application Meta Tags',
      color: 'blue',
      tags: [
        { name: 'app:id', value: 'com.crawlertest.app' },
        { name: 'app:name', value: 'Crawler Test Application' },
        { name: 'app:version', value: '2.5.1' },
        { name: 'app:build', value: '20240215' },
        { name: 'app:environment', value: 'production' },
      ],
    },
    {
      name: 'Content Meta Tags',
      color: 'green',
      tags: [
        { name: 'content:type', value: 'test-page' },
        { name: 'content:category', value: 'meta-tags' },
        { name: 'content:subcategory', value: 'custom' },
        { name: 'content:language', value: 'en-US' },
        { name: 'content:audience', value: 'developers' },
      ],
    },
    {
      name: 'Tracking Meta Tags',
      color: 'purple',
      tags: [
        { name: 'tracking:page-id', value: 'test-crawl-custom-meta' },
        { name: 'tracking:section', value: 'test-suite' },
        { name: 'tracking:experiment', value: 'crawler-v2' },
        { name: 'tracking:variant', value: 'A' },
      ],
    },
    {
      name: 'Business Meta Tags',
      color: 'orange',
      tags: [
        { name: 'business:unit', value: 'engineering' },
        { name: 'business:team', value: 'platform' },
        { name: 'business:owner', value: 'crawler-team' },
        { name: 'business:priority', value: 'high' },
      ],
    },
    {
      name: 'Date Meta Tags',
      color: 'pink',
      tags: [
        { name: 'date:created', value: '2024-01-01' },
        { name: 'date:modified', value: '2024-02-15' },
        { name: 'date:expires', value: '2025-01-01' },
        { name: 'date:reviewed', value: '2024-02-10' },
      ],
    },
    {
      name: 'Dublin Core Tags',
      color: 'cyan',
      tags: [
        { name: 'DC.title', value: 'Custom Meta Tags Test Page' },
        { name: 'DC.creator', value: 'Crawler Test Team' },
        { name: 'DC.subject', value: 'meta tags, testing, crawling' },
        { name: 'DC.publisher', value: 'Crawler Test Inc.' },
        { name: 'DC.date', value: '2024-02-15' },
      ],
    },
    {
      name: 'Geo Meta Tags',
      color: 'emerald',
      tags: [
        { name: 'ICBM', value: '37.7749, -122.4194' },
        { name: 'geo.position', value: '37.7749;-122.4194' },
        { name: 'geo.placename', value: 'San Francisco' },
        { name: 'geo.region', value: 'US-CA' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <nav className="mb-8">
          <Link href="/test-crawl" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Test Crawl Index
          </Link>
        </nav>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Custom Meta Tags Test
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              This page contains various custom meta tags that applications might use. 
              Your crawler should be able to extract and categorize these based on their prefixes.
            </p>
          </header>

          <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h2 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Total Custom Meta Tags: 40+
            </h2>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              This page includes app-specific, content, tracking, business, date, Dublin Core, geo, 
              mobile app, and Microsoft meta tags.
            </p>
          </div>

          <div className="grid gap-6">
            {metaGroups.map((group) => (
              <section key={group.name} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className={`px-4 py-3 bg-${group.color}-50 dark:bg-${group.color}-900/30`}>
                  <h2 className={`font-semibold text-${group.color}-800 dark:text-${group.color}-300`}>
                    {group.name}
                  </h2>
                </div>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 text-gray-600 dark:text-gray-400">Meta Name</th>
                        <th className="text-left py-2 text-gray-600 dark:text-gray-400">Content</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {group.tags.map((tag) => (
                        <tr key={tag.name}>
                          <td className="py-2 font-mono text-purple-600 dark:text-purple-400">{tag.name}</td>
                          <td className="py-2 text-gray-700 dark:text-gray-300">{tag.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              HTML Meta Tag Format
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`<!-- Example of how these meta tags appear in HTML -->
<meta name="app:id" content="com.crawlertest.app" />
<meta name="app:version" content="2.5.1" />
<meta name="content:type" content="test-page" />
<meta name="tracking:page-id" content="test-crawl-custom-meta" />
<meta name="DC.title" content="Custom Meta Tags Test Page" />
<meta name="geo.position" content="37.7749;-122.4194" />`}
              </pre>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
