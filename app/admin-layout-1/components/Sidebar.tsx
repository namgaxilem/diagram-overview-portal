'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeOutlined,
  CompassOutlined,
  RobotOutlined,
  ApartmentOutlined,
  ToolOutlined,
  MonitorOutlined,
  MessageOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    items: [
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: <HomeOutlined />,
        href: '/admin-layout-1',
      },
      {
        key: 'discover',
        label: 'Discover',
        icon: <CompassOutlined />,
        href: '/admin-layout-1/discover',
      },
    ],
  },
  {
    title: 'AGENTIC',
    items: [
      {
        key: 'agents',
        label: 'Agents',
        icon: <RobotOutlined />,
        href: '/admin-layout-1/agents',
      },
      {
        key: 'workflows',
        label: 'Workflows',
        icon: <ApartmentOutlined />,
        href: '/admin-layout-1/workflows',
      },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      {
        key: 'mcp',
        label: 'MCP',
        icon: <ToolOutlined />,
        href: '/admin-layout-1/mcp',
      },
    ],
  },
  {
    title: 'STATISTICS',
    items: [
      {
        key: 'monitor',
        label: 'Monitor',
        icon: <MonitorOutlined />,
        href: '/admin-layout-1/monitor',
      },
    ],
  },
  {
    title: 'REAL TIME CHAT',
    items: [
      {
        key: 'conversation',
        label: 'Conversation',
        icon: <MessageOutlined />,
        href: '/admin-layout-1/conversation',
      },
    ],
  },
  {
    title: 'OTHERS',
    items: [
      {
        key: 'settings',
        label: 'Settings',
        icon: <SettingOutlined />,
        href: '/admin-layout-1/settings',
      },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin-layout-1') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 fixed left-0 top-0`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Windsurf</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 hide-scrollbar">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-6' : ''}>
            {section.title && !collapsed && (
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                  {section.title}
                </span>
              </div>
            )}
            <div className="space-y-1 px-2">
              {section.items.map((item) => {
                const active = item.href ? isActive(item.href) : false;
                return (
                  <Link key={item.key} href={item.href || '#'}>
                    <div
                      className={`
                        flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all
                        ${
                          active
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                        ${collapsed ? 'justify-center' : ''}
                      `}
                    >
                      <span
                        className={`text-lg ${active ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                      >
                        {item.icon}
                      </span>
                      {!collapsed && <span className="text-sm">{item.label}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">john@example.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
