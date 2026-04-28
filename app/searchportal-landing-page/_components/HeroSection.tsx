'use client';

import { Button } from 'antd';

export default function HeroSection() {
  return (
    <div className="flex flex-col justify-center h-full">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight mb-6">
        Intelligent Search
      </h1>

      <p className="text-gray-800 text-lg mb-4">
        A <span className="font-semibold">Humana-patented</span>, AI-driven search platform enabling
        secure, governed, end-to-end discovery across organizational data and digital channels.
      </p>

      <div className="border-l-4 border-[#0066b2] bg-gray-100 pl-4 py-3 mb-8">
        <p className="text-gray-600 italic">
          Designed to accelerate data onboarding, enforce governance by design, and deliver
          measurable improvements in member experience—now replacing legacy search solutions at
          scale.
        </p>
      </div>

      <div>
        <Button
          type="default"
          size="large"
          className="!border-[#0066b2] !text-[#0066b2] hover:!bg-[#0066b2] hover:!text-white !rounded-full !px-8"
        >
          Read More
        </Button>
      </div>
    </div>
  );
}
