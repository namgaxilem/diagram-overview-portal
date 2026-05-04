'use client';

import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { TagsOutlined, SettingOutlined, FileSearchOutlined, FilterOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  available: boolean;
}

const features: FeatureCard[] = [
  {
    title: 'Meta Tag Configuration',
    description: 'Configure which HTML meta tags and types should be extracted during crawling. Define meta tag names, types, and extraction rules.',
    icon: <TagsOutlined style={{ fontSize: 32 }} />,
    path: '/crawler/meta-tag-config',
    color: '#08979c',
    available: true,
  },
  {
    title: 'Crawl Rules',
    description: 'Define URL patterns, inclusion/exclusion rules, and crawl depth settings for your web crawling tasks.',
    icon: <FilterOutlined style={{ fontSize: 32 }} />,
    path: '/crawler/crawl-rules',
    color: '#722ed1',
    available: false,
  },
  {
    title: 'Content Selectors',
    description: 'Configure CSS selectors and XPath expressions to extract specific content from crawled pages.',
    icon: <FileSearchOutlined style={{ fontSize: 32 }} />,
    path: '/crawler/content-selectors',
    color: '#1890ff',
    available: false,
  },
  {
    title: 'Advanced Settings',
    description: 'Configure rate limiting, user agents, proxy settings, and other advanced crawl options.',
    icon: <SettingOutlined style={{ fontSize: 32 }} />,
    path: '/crawler/settings',
    color: '#fa8c16',
    available: false,
  },
];

export default function CrawlerPage() {
  return (
    <div>
      <div className="mb-8">
        <Title level={2}>Web Crawler Tools</Title>
        <Paragraph className="text-gray-600">
          Configure and manage your web crawler settings. Select a tool below to get started.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {features.map((feature) => (
          <Col xs={24} sm={12} lg={12} key={feature.path}>
            {feature.available ? (
              <Link href={feature.path}>
                <Card
                  hoverable
                  className="h-full"
                  styles={{ body: { padding: 0 } }}
                >
                  <div
                    className="p-6 flex items-center gap-4"
                    style={{ backgroundColor: `${feature.color}10` }}
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: feature.color }}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <Title level={4} className="!mb-1" style={{ color: feature.color }}>
                        {feature.title}
                      </Title>
                      <Paragraph className="!mb-0 text-gray-600 text-sm">
                        {feature.description}
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Link>
            ) : (
              <Card
                className="h-full opacity-60 cursor-not-allowed"
                styles={{ body: { padding: 0 } }}
              >
                <div className="p-6 flex items-center gap-4 bg-gray-50">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white bg-gray-400">
                    {feature.icon}
                  </div>
                  <div>
                    <Title level={4} className="!mb-1 text-gray-500">
                      {feature.title}
                      <span className="ml-2 text-xs font-normal bg-gray-200 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    </Title>
                    <Paragraph className="!mb-0 text-gray-500 text-sm">
                      {feature.description}
                    </Paragraph>
                  </div>
                </div>
              </Card>
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
}
