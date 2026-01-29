import ArchitectureDiagramV3 from "./ArchitectureDiagramV3";

export default function SystemArchitecture() {
  return (
    <section id="architecture" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Platform Architecture
          </h2>
          <div className="w-12 h-1 bg-emerald-500 mx-auto mb-6" />
          <p className="max-w-2xl mx-auto text-gray-600">
            A multi-tiered infrastructure connecting applications, middleware
            services, and backend systems for seamless workspace orchestration.
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
          <ArchitectureDiagramV3 />
        </div>
      </div>
    </section>
  );
}
