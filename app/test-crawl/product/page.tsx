import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Premium Wireless Headphones XR-500 | TechStore',
  description: 'Experience crystal-clear audio with our flagship XR-500 wireless headphones. Features active noise cancellation, 40-hour battery life, and premium comfort.',
  openGraph: {
    type: 'website',
    title: 'Premium Wireless Headphones XR-500',
    description: 'Crystal-clear audio with active noise cancellation and 40-hour battery life.',
    url: 'https://example.com/test-crawl/product',
    siteName: 'TechStore',
    images: [
      {
        url: 'https://picsum.photos/800/800',
        width: 800,
        height: 800,
        alt: 'XR-500 Wireless Headphones - Black',
      },
    ],
  },
  other: {
    'product:price:amount': '299.99',
    'product:price:currency': 'USD',
    'product:availability': 'in stock',
    'product:condition': 'new',
    'product:retailer_item_id': 'XR500-BLK-001',
    'product:brand': 'TechAudio',
    'product:category': 'Electronics > Audio > Headphones',
    'product:sku': 'TA-XR500-BLK',
    'product:upc': '123456789012',
    'product:weight': '250g',
    'product:color': 'Black',
    'product:material': 'Premium Aluminum',
    'product:target_gender': 'unisex',
    'product:age_group': 'adult',
    'product:rating': '4.8',
    'product:rating_count': '1247',
  },
};

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="mb-8">
          <Link href="/test-crawl" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Test Crawl Index
          </Link>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <img
                  src="https://picsum.photos/600/600"
                  alt="XR-500 Wireless Headphones - Main View"
                  className="w-full rounded-lg"
                  itemProp="image"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://picsum.photos/150/150?random=${i}`}
                    alt={`Product view ${i}`}
                    className="w-full rounded-lg cursor-pointer hover:opacity-80"
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div itemScope itemType="https://schema.org/Product">
              <div className="mb-4">
                <span className="text-sm text-blue-600 dark:text-blue-400">TechAudio</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-sm text-gray-500">SKU: TA-XR500-BLK</span>
              </div>
              
              <h1 itemProp="name" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Premium Wireless Headphones XR-500
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} className={i === 4 ? 'text-yellow-200' : ''}>★</span>
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">(1,247 reviews)</span>
              </div>

              <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="mb-6">
                <div className="flex items-baseline gap-4">
                  <span itemProp="price" content="299.99" className="text-4xl font-bold text-gray-900 dark:text-white">
                    $299.99
                  </span>
                  <span className="text-xl text-gray-400 line-through">$399.99</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded">
                    25% OFF
                  </span>
                </div>
                <meta itemProp="priceCurrency" content="USD" />
                <link itemProp="availability" href="https://schema.org/InStock" />
                <p className="text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                  <span>✓</span> In Stock - Ships within 24 hours
                </p>
              </div>

              <p itemProp="description" className="text-gray-600 dark:text-gray-300 mb-6">
                Experience crystal-clear audio with our flagship XR-500 wireless headphones. 
                Features industry-leading active noise cancellation, 40-hour battery life, 
                and premium memory foam ear cushions for all-day comfort.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-gray-400 w-24">Color:</span>
                  <div className="flex gap-2">
                    {['bg-black', 'bg-white border', 'bg-blue-600', 'bg-rose-500'].map((color, i) => (
                      <button
                        key={i}
                        className={`w-8 h-8 rounded-full ${color} ${i === 0 ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Add to Cart
                </button>
                <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  ♡
                </button>
              </div>
            </div>
          </div>

          {/* Product Meta Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Product Meta Tags (For Crawler Testing)
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {[
                ['product:price:amount', '299.99'],
                ['product:price:currency', 'USD'],
                ['product:availability', 'in stock'],
                ['product:condition', 'new'],
                ['product:brand', 'TechAudio'],
                ['product:sku', 'TA-XR500-BLK'],
                ['product:upc', '123456789012'],
                ['product:category', 'Electronics > Audio'],
                ['product:rating', '4.8'],
                ['product:rating_count', '1247'],
                ['product:color', 'Black'],
                ['product:weight', '250g'],
              ].map(([key, value]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <span className="font-mono text-purple-600 dark:text-purple-400">{key}</span>
                  <p className="text-gray-700 dark:text-gray-300">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Specifications</h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  ['Driver Size', '40mm'],
                  ['Frequency Response', '20Hz - 20kHz'],
                  ['Battery Life', '40 hours'],
                  ['Charging Time', '2 hours'],
                  ['Bluetooth Version', '5.2'],
                  ['Weight', '250g'],
                  ['Noise Cancellation', 'Active (ANC)'],
                ].map(([spec, value]) => (
                  <tr key={spec}>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{spec}</td>
                    <td className="py-3 text-gray-900 dark:text-white font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
