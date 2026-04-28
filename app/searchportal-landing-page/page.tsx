import HeroSection from './_components/HeroSection';
import ChatFrame from './_components/ChatFrame';
import FeatureCards from './_components/FeatureCards';

export default function SearchPortalLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Two Column Layout */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <HeroSection />

          {/* Right Column - Chat Frame */}
          <div className="flex justify-center lg:justify-end">
            <ChatFrame />
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-gray-50">
        <FeatureCards />
      </section>
    </main>
  );
}
