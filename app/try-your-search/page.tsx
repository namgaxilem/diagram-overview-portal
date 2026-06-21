'use client';

import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { FilterOutlined, SearchOutlined, DatabaseOutlined, EnvironmentOutlined } from '@ant-design/icons';
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
    title: 'MongoDB Filter Builder',
    description: 'Visually build MongoDB filter objects with dynamic fields, select/text/number inputs, and geo radius search. Live JSON output.',
    icon: <FilterOutlined style={{ fontSize: 32 }} />,
    path: '/try-your-search/filter-builder',
    color: '#5b21b6',
    available: true,
  },
  {
    title: 'Saved Searches',
    description: 'Store and re-run your most-used filter combinations across collections.',
    icon: <DatabaseOutlined style={{ fontSize: 32 }} />,
    path: '/try-your-search/saved',
    color: '#1890ff',
    available: false,
  },
  {
    title: 'Geo Explorer',
    description: 'Draw a search radius on a map and preview matching documents by location.',
    icon: <EnvironmentOutlined style={{ fontSize: 32 }} />,
    path: '/try-your-search/geo-explorer',
    color: '#08979c',
    available: false,
  },
];

export default function TryYourSearchPage() {
  return (
    <div>
      <div className="mb-8">
        <Title level={2}>Try Your Search</Title>
        <Paragraph className="text-gray-600">
          Build and test queries against your data. Select a tool below to get started.
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
