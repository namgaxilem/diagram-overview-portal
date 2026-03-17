import React from 'react';
import Header from './_components/Header';
import LeftMenu from './_components/LeftMenu';
import AgentDetail from './_components/AgentDetail';

export default function AgentDetailPage() {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftMenu />
        <AgentDetail />
      </div>
    </div>
  );
}
