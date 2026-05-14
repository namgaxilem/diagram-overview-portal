'use client';

import React, { useEffect, useState } from 'react';

export default function OAuth2LoginPage() {
  const [dots, setDots] = useState('');
  const [statusText, setStatusText] = useState('Initializing AI Agent');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    // Animate status text
    const statusMessages = [
      'Initializing AI Agent',
      'Establishing secure connection',
      'Authenticating credentials',
      'Loading neural networks',
      'Preparing workspace',
      'Almost ready',
    ];
    let statusIndex = 0;
    const statusInterval = setInterval(() => {
      statusIndex = (statusIndex + 1) % statusMessages.length;
      setStatusText(statusMessages[statusIndex]);
    }, 2500);

    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 80);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(53,175,59,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(53,175,59,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-500/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* AI Agent Icon with animated rings */}
        <div className="relative mb-12">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 w-40 h-40 -m-6 border-2 border-emerald-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}>
            <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
          </div>
          
          {/* Middle rotating ring */}
          <div className="absolute inset-0 w-32 h-32 -m-2 border-2 border-teal-500/30 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 w-2 h-2 -ml-1 mb-[-4px] bg-teal-500 rounded-full shadow-lg shadow-teal-500/50" />
          </div>

          {/* Inner pulsing ring */}
          <div className="absolute inset-0 w-28 h-28 border-2 border-green-400/50 rounded-full animate-ping" style={{ animationDuration: '2s' }} />

          {/* AI Brain Icon */}
          <div className="w-28 h-28 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <svg
              className="w-14 h-14 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {/* Brain/AI icon */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M14.25 3.104c.251.023.501.05.75.082M19.8 14.5l-1.4 1.4a2.25 2.25 0 01-1.591.659H7.191a2.25 2.25 0 01-1.591-.659L4.2 14.5m15.6 0l.9.9a2.25 2.25 0 010 3.182l-.9.9m-15.6-5l-.9.9a2.25 2.25 0 000 3.182l.9.9m0 0a24.301 24.301 0 0015.6 0"
                className="animate-pulse"
              />
              {/* Neural connections */}
              <circle cx="12" cy="12" r="2" className="fill-white/80" />
              <circle cx="8" cy="10" r="1" className="fill-white/60" />
              <circle cx="16" cy="10" r="1" className="fill-white/60" />
              <circle cx="10" cy="15" r="1" className="fill-white/60" />
              <circle cx="14" cy="15" r="1" className="fill-white/60" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
            AI Agent
          </span>
        </h1>
        <p className="text-emerald-300/80 text-lg mb-8">Intelligent Authentication System</p>

        {/* Status text with typing effect */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
          <span className="text-white/90 font-medium">
            {statusText}
            <span className="text-emerald-400">{dots}</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-80 h-1.5 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm mb-8">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full transition-all duration-100 ease-linear shadow-lg shadow-emerald-500/30"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading indicators */}
        <div className="flex gap-3 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full animate-bounce shadow-lg shadow-emerald-500/30"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* Bottom text */}
        <p className="text-slate-500 text-sm mt-12">
          Powered by Advanced Neural Networks
        </p>
      </div>
    </div>
  );
}
