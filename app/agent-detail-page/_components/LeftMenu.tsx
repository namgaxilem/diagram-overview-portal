'use client';

import React from 'react';

export default function LeftMenu() {
  return (
    <aside className="w-64 bg-[#1a1c1e] text-gray-400 flex flex-col shrink-0 border-r border-gray-800">
      <div className="p-4">
        <div className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-green/20 rounded flex items-center justify-center">
              <svg
                className="h-5 w-5 text-brand-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <span className="text-white font-medium">Humana</span>
          </div>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        <div>
          <a
            className="flex items-center gap-3 px-3 py-2 text-brand-accent bg-brand-green/10 rounded-md"
            href="#"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2 mt-1 hover:bg-gray-800 rounded-md"
            href="#"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                fillRule="evenodd"
              />
            </svg>
            <span>Discover</span>
          </a>
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
            Agentic
          </p>
          <a className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-md" href="#">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                fillRule="evenodd"
              />
            </svg>
            <span>Agents</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2 mt-1 hover:bg-gray-800 rounded-md"
            href="#"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <span>Workflows</span>
          </a>
        </div>
      </nav>

      <div className="mt-auto border-t border-gray-800 p-4">
        <div className="bg-gray-800/40 rounded-lg p-3 flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
            VT
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-medium truncate">Vu Tran</p>
            <p className="text-[10px] text-gray-500 truncate">VTran3@humana.com</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-400">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          Log Out
        </button>
      </div>
    </aside>
  );
}
