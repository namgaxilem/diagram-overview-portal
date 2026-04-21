'use client';

import React from 'react';

export default function Header() {
  return (
    <header className="bg-brand-green text-white h-14 flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-4">
        <div className="bg-white p-1 rounded">
          <div className="w-6 h-6 bg-brand-green flex items-center justify-center font-bold text-xs">
            H
          </div>
        </div>
        <h1 className="font-semibold text-lg">DHP AI Experience Hub</h1>
      </div>

      <div className="flex-1 max-w-2xl px-8">
        <div className="relative">
          <input
            className="w-full bg-white/20 border-none rounded-md py-1.5 pl-4 pr-10 text-sm placeholder-white/70 focus:ring-2 focus:ring-white/50 text-white"
            placeholder="Search resources, services, and docs (G+/)"
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <button className="p-1 hover:bg-white/10 rounded-full">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543-.94-3.31.826-2.37 2.37a1.724 1.724 0 00-1.065 2.572c-1.756.426-1.756 2.924 0 3.35a1.724 1.724 0 001.066 2.573c-.94 1.543.826 3.31 2.37 2.37.996.608 2.296.07 2.572-1.065z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase">
            QV
          </div>
          <div className="hidden lg:block leading-tight">
            <p className="font-medium">Quoi Vo</p>
            <p className="text-[10px] text-white/70">QVo@humana.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
