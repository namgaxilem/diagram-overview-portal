'use client';

import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Tooltip, Tag } from 'antd';
import {
  BookOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  ControlOutlined,
  CodeSandboxOutlined,
  BugOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Sider, Content } = Layout;
const { Text } = Typography;

interface KtMenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  tech: string;
  techColor: string;
}

// Add the next module here to grow the KT docs (one entry per system being handed over).
const menuItems: KtMenuItem[] = [
  {
    key: '/kt-docs/search-portal',
    icon: <SearchOutlined />,
    label: 'Search Portal',
    tech: 'React',
    techColor: 'cyan',
  },
  {
    key: '/kt-docs/crawl-portal',
    icon: <ControlOutlined />,
    label: 'Crawl Portal',
    tech: 'React',
    techColor: 'cyan',
  },
  {
    key: '/kt-docs/embed-ui',
    icon: <CodeSandboxOutlined />,
    label: 'Embed UI',
    tech: 'React',
    techColor: 'cyan',
  },
  {
    key: '/kt-docs/crawler',
    icon: <BugOutlined />,
    label: 'Crawler',
    tech: 'Python',
    techColor: 'gold',
  },
  {
    key: '/kt-docs/crawler-kt-session',
    icon: <ReadOutlined />,
    label: 'Crawler — KT Session',
    tech: 'Python',
    techColor: 'gold',
  },
  {
    key: '/kt-docs/auth-azure-ad',
    icon: <SafetyCertificateOutlined />,
    label: 'Authentication — Azure AD',
    tech: 'Spring Boot',
    techColor: 'geekblue',
  },
];

export default function KtDocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen">
      <Sider
        width={280}
        collapsedWidth={80}
        collapsed={collapsed}
        className="!bg-white border-r border-gray-200"
        theme="light"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            {!collapsed && (
              <Link href="/">
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  className="!text-gray-500 hover:!text-gray-700 !px-2 mb-3"
                  size="small"
                >
                  Back to Home
                </Button>
              </Link>
            )}
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
              {collapsed ? (
                <Tooltip title="KT Docs" placement="right">
                  <Link href="/kt-docs">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white cursor-pointer">
                      <BookOutlined className="text-lg" />
                    </div>
                  </Link>
                </Tooltip>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white">
                    <BookOutlined className="text-lg" />
                  </div>
                  <div>
                    <Text strong className="text-gray-800 block">
                      KT Docs
                    </Text>
                    <Text type="secondary" className="text-xs">
                      Knowledge Transfer
                    </Text>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-2 overflow-y-auto">
            {!collapsed && (
              <div className="px-4 py-2">
                <Text type="secondary" className="text-xs uppercase tracking-wider font-medium">
                  Systems
                </Text>
              </div>
            )}
            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              className="!border-none"
              inlineCollapsed={collapsed}
              items={menuItems.map((item) => ({
                key: item.key,
                icon: item.icon,
                label: (
                  <Link href={item.key} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <Tag color={item.techColor} className="!mr-0">
                      {item.tech}
                    </Tag>
                  </Link>
                ),
              }))}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            {collapsed ? (
              <Tooltip title="KT Overview" placement="right">
                <Link href="/kt-docs">
                  <Button
                    type="text"
                    icon={<HomeOutlined />}
                    className="w-full !text-gray-600 hover:!text-slate-800"
                  />
                </Link>
              </Tooltip>
            ) : (
              <Link href="/kt-docs">
                <Button
                  type="text"
                  icon={<HomeOutlined />}
                  className="w-full !justify-start !text-gray-600 hover:!text-slate-800"
                >
                  KT Overview
                </Button>
              </Link>
            )}
          </div>

          {/* Collapse Toggle */}
          <div className="p-2 border-t border-gray-100">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="w-full !text-gray-500 hover:!text-gray-700"
            />
          </div>
        </div>
      </Sider>

      <Content className="bg-gray-50">{children}</Content>
    </Layout>
  );
}
