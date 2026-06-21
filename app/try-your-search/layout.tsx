'use client';

import React from 'react';
import { Layout, Menu, Typography, Breadcrumb } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  HomeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Sider, Content } = Layout;
const { Title } = Typography;

interface TryYourSearchLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    key: '/try-your-search',
    icon: <AppstoreOutlined />,
    label: <Link href="/try-your-search">Overview</Link>,
  },
  {
    key: '/try-your-search/filter-builder',
    icon: <FilterOutlined />,
    label: <Link href="/try-your-search/filter-builder">Filter Builder</Link>,
  },
];

export default function TryYourSearchLayout({ children }: TryYourSearchLayoutProps) {
  const pathname = usePathname();

  const getBreadcrumbItems = (): { title: React.ReactNode }[] => {
    const items: { title: React.ReactNode }[] = [
      { title: <Link href="/"><HomeOutlined /> Home</Link> },
      { title: <Link href="/try-your-search">Try Your Search</Link> },
    ];

    if (pathname === '/try-your-search/filter-builder') {
      items.push({ title: 'Filter Builder' });
    }

    return items;
  };

  return (
    <Layout className="h-screen">
      <Sider
        width={240}
        className="bg-white border-r border-gray-200"
        theme="light"
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SearchOutlined className="text-white text-xl" />
            </div>
            <Title level={5} className="!mb-0">Try Your Search</Title>
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          className="border-none"
        />
      </Sider>
      <Layout>
        <Content className="bg-gray-50 overflow-auto">
          <div className="p-6">
            <Breadcrumb items={getBreadcrumbItems()} className="mb-4" />
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
