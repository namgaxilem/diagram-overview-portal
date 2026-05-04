import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'JSON-LD Structured Data Test | Crawler Test Suite',
  description: 'Test page featuring various JSON-LD structured data types for rich snippet testing.',
  other: {
    'schema-type': 'multiple',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Crawler Test Inc.',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  sameAs: [
    'https://facebook.com/crawlertest',
    'https://twitter.com/crawlertest',
    'https://linkedin.com/company/crawlertest',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    availableLanguage: ['English', 'Spanish'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Tech Street',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94102',
    addressCountry: 'US',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
    { '@type': 'ListItem', position: 2, name: 'Test Crawl', item: 'https://example.com/test-crawl' },
    { '@type': 'ListItem', position: 3, name: 'Structured Data', item: 'https://example.com/test-crawl/structured-data' },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is JSON-LD?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'JSON-LD (JavaScript Object Notation for Linked Data) is a method of encoding Linked Data using JSON.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why use structured data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Structured data helps search engines understand your content better and can enable rich results in search.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do crawlers read JSON-LD?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Crawlers parse the script tags with type application/ld+json and extract the structured data within.',
      },
    },
  ],
};

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Web Crawling Workshop 2024',
  description: 'Learn the fundamentals of web crawling and data extraction.',
  startDate: '2024-06-15T09:00:00-07:00',
  endDate: '2024-06-15T17:00:00-07:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
  location: {
    '@type': 'VirtualLocation',
    url: 'https://example.com/events/workshop-2024',
  },
  organizer: {
    '@type': 'Organization',
    name: 'Crawler Test Inc.',
    url: 'https://example.com',
  },
  offers: {
    '@type': 'Offer',
    price: '99.00',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    validFrom: '2024-01-01T00:00:00-07:00',
  },
};

const recipeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Recipe',
  name: 'Chocolate Chip Cookies',
  author: { '@type': 'Person', name: 'Chef Jane' },
  datePublished: '2024-01-10',
  description: 'Delicious homemade chocolate chip cookies.',
  prepTime: 'PT15M',
  cookTime: 'PT12M',
  totalTime: 'PT27M',
  recipeYield: '24 cookies',
  recipeCategory: 'Dessert',
  recipeCuisine: 'American',
  nutrition: {
    '@type': 'NutritionInformation',
    calories: '150 calories',
  },
  recipeIngredient: [
    '2 cups flour',
    '1 cup butter',
    '1 cup chocolate chips',
  ],
  recipeInstructions: [
    { '@type': 'HowToStep', text: 'Preheat oven to 350°F' },
    { '@type': 'HowToStep', text: 'Mix ingredients' },
    { '@type': 'HowToStep', text: 'Bake for 12 minutes' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '256',
  },
};

export default function StructuredDataPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="event-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <Script
        id="recipe-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-8">
          <Link href="/test-crawl" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Test Crawl Index
          </Link>
        </nav>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              JSON-LD Structured Data Test
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              This page contains multiple JSON-LD structured data blocks for testing crawler extraction capabilities.
            </p>
          </header>

          <section className="space-y-8">
            {/* Organization Schema */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-3">
                <h2 className="font-semibold text-blue-800 dark:text-blue-300">
                  1. Organization Schema
                </h2>
              </div>
              <pre className="p-4 text-sm overflow-x-auto bg-gray-900 text-green-400">
                {JSON.stringify(organizationSchema, null, 2)}
              </pre>
            </div>

            {/* Breadcrumb Schema */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-green-50 dark:bg-green-900/30 px-4 py-3">
                <h2 className="font-semibold text-green-800 dark:text-green-300">
                  2. BreadcrumbList Schema
                </h2>
              </div>
              <pre className="p-4 text-sm overflow-x-auto bg-gray-900 text-green-400">
                {JSON.stringify(breadcrumbSchema, null, 2)}
              </pre>
            </div>

            {/* FAQ Schema */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-purple-50 dark:bg-purple-900/30 px-4 py-3">
                <h2 className="font-semibold text-purple-800 dark:text-purple-300">
                  3. FAQPage Schema
                </h2>
              </div>
              <pre className="p-4 text-sm overflow-x-auto bg-gray-900 text-green-400">
                {JSON.stringify(faqSchema, null, 2)}
              </pre>
            </div>

            {/* Event Schema */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-orange-50 dark:bg-orange-900/30 px-4 py-3">
                <h2 className="font-semibold text-orange-800 dark:text-orange-300">
                  4. Event Schema
                </h2>
              </div>
              <pre className="p-4 text-sm overflow-x-auto bg-gray-900 text-green-400">
                {JSON.stringify(eventSchema, null, 2)}
              </pre>
            </div>

            {/* Recipe Schema */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-pink-50 dark:bg-pink-900/30 px-4 py-3">
                <h2 className="font-semibold text-pink-800 dark:text-pink-300">
                  5. Recipe Schema
                </h2>
              </div>
              <pre className="p-4 text-sm overflow-x-auto bg-gray-900 text-green-400">
                {JSON.stringify(recipeSchema, null, 2)}
              </pre>
            </div>
          </section>

          <section className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
            <h2 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              Crawler Note
            </h2>
            <p className="text-yellow-700 dark:text-yellow-200 text-sm">
              All structured data is embedded in the page using <code>&lt;script type="application/ld+json"&gt;</code> tags. 
              Your crawler should parse these script elements and extract the JSON content within.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
