'use client';

import React from 'react';
import Sidebar from './components/Sidebar';
import ThemeProvider from './components/ThemeProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <main className="flex-1 ml-64 transition-all duration-300">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
