export default function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-b from-white to-gray-50 py-20 lg:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-8">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-emerald-700">
            ENTERPRISE WORKSPACE PORTAL
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Streamline Your
          <br />
          <span className="text-emerald-600">Workspace Management</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10">
          A unified portal for managing organizational workspaces, onboarding
          applications, and service integrations. Built for multi-tenant
          environments with enterprise-grade security.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#get-started"
            className="px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            Start Building Now
          </a>
          <a
            href="#learn-more"
            className="px-8 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
