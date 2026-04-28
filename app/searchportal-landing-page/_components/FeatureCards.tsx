'use client';

import { FileTextOutlined, ApiOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  points: string[];
}

const features: FeatureCard[] = [
  {
    icon: <FileTextOutlined className="text-4xl text-[#0066b2]" />,
    title: 'Data Collection & Ingestion',
    points: [
      'Self-service onboarding for diverse data sources.',
      'Consistent automation and standards by design.',
      'AI-driven extraction, enrichment, and indexing.',
      'Multi-language support & data versioning.',
    ],
  },
  {
    icon: <ApiOutlined className="text-4xl text-[#0066b2]" />,
    title: 'Search & Retrieval',
    points: [
      'Search enrichment - Autocompletion, advanced query filtering, Fuzzy matching, phonetic, semantic, and AI-powered summaries.',
      'High-relevance, tolerant of variations.',
      'Secure Token based API — for all digital experiences.',
    ],
  },
  {
    icon: <SafetyCertificateOutlined className="text-4xl text-[#0066b2]" />,
    title: 'Insights, Auditing & Guardrails',
    points: [
      'Auditability, compliance, and traceability.',
      'Usage, behavior, and operational insights.',
      'Privacy and access controls by design.',
      'Built-in guardrails for responsible and compliant AI usage.',
    ],
  },
];

export default function FeatureCards() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-4 p-4 bg-blue-50 rounded-full">{feature.icon}</div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{feature.title}</h3>

            {/* Points */}
            <ul className="text-left text-sm text-gray-600 space-y-2">
              {feature.points.map((point, pointIndex) => (
                <li key={pointIndex} className="flex items-start">
                  <span className="mr-2 text-[#0066b2] font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Text */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-center text-gray-600 italic">
          A/B tested against legacy search solutions, delivering improved member experience and
          reduced call center demand.
        </p>
      </div>
    </div>
  );
}
