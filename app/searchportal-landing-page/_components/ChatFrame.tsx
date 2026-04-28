'use client';

import { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';

interface ChatContent {
  question: string;
  followUp: string;
  answer: string;
}

const chatContents: ChatContent[] = [
  {
    question: 'What is DHP Intelligent Search?',
    followUp: 'What are DHP Intelligent Search Capabilities?',
    answer:
      'DHP Intelligent Search is an AI-powered platform that automates how complex healthcare data is collected, processed, and used. It allows for the gathering, enrichment, and easy access to data, providing',
  },
  {
    question: 'How does data ingestion work?',
    followUp: 'What data sources are supported?',
    answer:
      'Data ingestion supports self-service onboarding for diverse data sources with consistent automation and standards by design. AI-driven extraction, enrichment, and indexing enables multi-language support',
  },
  {
    question: 'What about search capabilities?',
    followUp: 'How accurate is the search?',
    answer:
      'Search enrichment includes autocompletion, advanced query filtering, fuzzy matching, phonetic, semantic, and AI-powered summaries. High relevance, tolerant of variations with secure token-based API',
  },
  {
    question: 'What governance features exist?',
    followUp: 'How is compliance handled?',
    answer:
      'Built-in guardrails for responsible and compliant AI usage. Auditability, compliance, and traceability with privacy and access controls by design. Usage, behavior, and operational insights available',
  },
];

export default function ChatFrame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedAnswer, setDisplayedAnswer] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const currentContent = chatContents[currentIndex];

  useEffect(() => {
    setDisplayedAnswer('');
    setIsTyping(true);

    let charIndex = 0;
    const answer = currentContent.answer;

    const typingInterval = setInterval(() => {
      if (charIndex < answer.length) {
        setDisplayedAnswer(answer.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);

        // Move to next content after a pause
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % chatContents.length);
        }, 3000);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentIndex, currentContent.answer]);

  return (
    <div className="bg-[#e8f5e9] rounded-2xl p-4 shadow-lg max-w-md w-full">
      {/* Window Controls */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg px-4 py-3 mb-4 flex items-center justify-between shadow-sm">
        <span className="text-gray-600 text-sm">{currentContent.question}</span>
        <SearchOutlined className="text-gray-400" />
      </div>

      {/* Follow-up Question Button */}
      <div className="mb-4">
        <button className="border border-[#2e7d32] text-[#2e7d32] rounded-full px-4 py-2 text-sm hover:bg-[#2e7d32] hover:text-white transition-colors">
          {currentContent.followUp}
        </button>
      </div>

      {/* Answer Area */}
      <div className="bg-white/50 rounded-lg p-4 min-h-[120px]">
        <p className="text-gray-700 text-sm leading-relaxed">
          {displayedAnswer}
          {isTyping && <span className="animate-pulse">|</span>}
        </p>
      </div>
    </div>
  );
}
