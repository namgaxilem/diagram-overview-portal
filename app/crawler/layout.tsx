'use client';

import React from 'react';
import { Layout, Menu, Typography, Breadcrumb } from 'antd';
import {
  GlobalOutlined,
  TagsOutlined,
  SettingOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Sider, Content } = Layout;
const { Title } = Typography;

interface CrawlerLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    key: '/crawler',
    icon: <GlobalOutlined />,
    label: <Link href="/crawler">Overview</Link>,
  },
  {
    key: '/crawler/meta-tag-config',
    icon: <TagsOutlined />,
    label: <Link href="/crawler/meta-tag-config">Meta Tag Config</Link>,
  },
];

export default function CrawlerLayout({ children }: CrawlerLayoutProps) {
  const pathname = usePathname();

  const getBreadcrumbItems = (): { title: React.ReactNode }[] => {
    const items: { title: React.ReactNode }[] = [
      { title: <Link href="/"><HomeOutlined /> Home</Link> },
      { title: <Link href="/crawler">Crawler</Link> },
    ];

    if (pathname === '/crawler/meta-tag-config') {
      items.push({ title: 'Meta Tag Config' });
    }

    return items;
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        width={240}
        className="bg-white border-r border-gray-200"
        theme="light"
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <GlobalOutlined className="text-white text-xl" />
            </div>
            <Title level={5} className="!mb-0">Web Crawler</Title>
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
        <Content className="bg-gray-50">
          <div className="p-6">
            <Breadcrumb items={getBreadcrumbItems()} className="mb-4" />
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
