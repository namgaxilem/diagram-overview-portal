import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Multimedia Content Test | Crawler Test Suite',
  description: 'Test page with images, videos, and audio content for testing multimedia extraction.',
  openGraph: {
    title: 'Multimedia Content Test Page',
    description: 'Rich multimedia content including images, videos, and audio.',
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/1200/630',
        width: 1200,
        height: 630,
        alt: 'Multimedia test hero image',
        type: 'image/jpeg',
      },
    ],
    videos: [
      {
        url: 'https://example.com/video.mp4',
        width: 1280,
        height: 720,
        type: 'video/mp4',
      },
    ],
    audio: [
      {
        url: 'https://example.com/audio.mp3',
        type: 'audio/mpeg',
      },
    ],
  },
  other: {
    'media:image-count': '10',
    'media:video-count': '2',
    'media:audio-count': '1',
    'media:type': 'mixed',
  },
};

const images = [
  { src: 'https://picsum.photos/800/600?random=1', alt: 'Nature landscape with mountains', caption: 'Mountain Vista' },
  { src: 'https://picsum.photos/800/600?random=2', alt: 'Ocean waves at sunset', caption: 'Ocean Sunset' },
  { src: 'https://picsum.photos/800/600?random=3', alt: 'City skyline at night', caption: 'City Lights' },
  { src: 'https://picsum.photos/800/600?random=4', alt: 'Forest path in autumn', caption: 'Autumn Path' },
  { src: 'https://picsum.photos/800/600?random=5', alt: 'Desert sand dunes', caption: 'Desert Dunes' },
  { src: 'https://picsum.photos/800/600?random=6', alt: 'Snowy mountain peak', caption: 'Winter Peak' },
];

export default function MultimediaPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <nav className="mb-8">
          <Link href="/test-crawl" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Test Crawl Index
          </Link>
        </nav>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          <figure className="relative">
            <img
              src="https://picsum.photos/1200/400"
              alt="Multimedia content hero banner showing various media types"
              className="w-full h-64 object-cover"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h1 className="text-3xl font-bold text-white">Multimedia Content Test</h1>
              <p className="text-gray-200">Testing image, video, and audio extraction</p>
            </figcaption>
          </figure>

          <div className="p-8">
            {/* Image Gallery Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🖼️</span> Image Gallery
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Images with proper alt text, captions, and various sizes for crawler testing.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <figure key={index} className="relative group">
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading={index > 2 ? 'lazy' : 'eager'}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {image.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>

              {/* Image with srcset */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Responsive Image (srcset)</h3>
                <picture>
                  <source media="(min-width: 1024px)" srcSet="https://picsum.photos/1200/400" />
                  <source media="(min-width: 768px)" srcSet="https://picsum.photos/800/300" />
                  <img
                    src="https://picsum.photos/600/200"
                    alt="Responsive image that changes based on viewport"
                    className="w-full rounded-lg"
                  />
                </picture>
              </div>
            </section>

            {/* Video Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🎬</span> Video Content
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Video elements with various attributes for testing video metadata extraction.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* HTML5 Video */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">HTML5 Video</h3>
                  <video
                    controls
                    poster="https://picsum.photos/640/360"
                    width="100%"
                    preload="metadata"
                    className="rounded"
                  >
                    <source src="https://example.com/video.mp4" type="video/mp4" />
                    <source src="https://example.com/video.webm" type="video/webm" />
                    <track kind="captions" src="/captions.vtt" srcLang="en" label="English" />
                    Your browser does not support the video tag.
                  </video>
                  <p className="text-xs text-gray-500 mt-2">
                    Attributes: controls, poster, preload, tracks
                  </p>
                </div>

                {/* Embedded Video (iframe) */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Embedded Video (iframe)</h3>
                  <div className="aspect-video bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400">Video Embed Placeholder</p>
                      <code className="text-xs text-gray-400">&lt;iframe src="youtube.com/embed/..."&gt;</code>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Common: YouTube, Vimeo, Wistia embeds
                  </p>
                </div>
              </div>
            </section>

            {/* Audio Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🎵</span> Audio Content
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Audio elements with metadata for podcast/music content extraction.
              </p>

              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-3xl">
                    🎧
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Sample Podcast Episode</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration: 45:32</p>
                  </div>
                </div>
                <audio controls className="w-full" preload="metadata">
                  <source src="https://example.com/podcast.mp3" type="audio/mpeg" />
                  <source src="https://example.com/podcast.ogg" type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </section>

            {/* Media Meta Tags Info */}
            <section className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-6">
              <h2 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
                Media Meta Tags on This Page
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Open Graph Media</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• og:image (1200x630)</li>
                    <li>• og:image:type (image/jpeg)</li>
                    <li>• og:video (video.mp4)</li>
                    <li>• og:video:type (video/mp4)</li>
                    <li>• og:audio (audio.mp3)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Media Meta</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• media:image-count = 10</li>
                    <li>• media:video-count = 2</li>
                    <li>• media:audio-count = 1</li>
                    <li>• media:type = mixed</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
