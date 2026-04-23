'use client';

import React from 'react';
import { UserOutlined, TeamOutlined, FileTextOutlined, RiseOutlined } from '@ant-design/icons';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: '1,128', icon: <UserOutlined />, color: 'text-green-600 dark:text-green-400' },
    { title: 'Active Teams', value: '93', icon: <TeamOutlined />, color: 'text-blue-600 dark:text-blue-400' },
    { title: 'Documents', value: '2,456', icon: <FileTextOutlined />, color: 'text-purple-600 dark:text-purple-400' },
    { title: 'Growth', value: '11.28%', icon: <RiseOutlined />, color: 'text-green-600 dark:text-green-400' },
  ];

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`text-3xl ${stat.color}`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Welcome to Admin Layout 1</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This is the main dashboard page. Use the sidebar menu to navigate to different sections.
        </p>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Agentic section includes Agents and Workflows management</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Tools section for MCP configuration</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Statistics monitoring and real-time chat</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Settings and other configuration options</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
