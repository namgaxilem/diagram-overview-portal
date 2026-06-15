'use client';

import React from 'react';
import { Card, Typography, Tag, Space, List } from 'antd';
import {
  SearchOutlined,
  ControlOutlined,
  CodeSandboxOutlined,
  BugOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

const systems = [
  {
    path: '/kt-docs/search-portal',
    title: 'Search Portal',
    tech: 'React',
    techColor: 'cyan',
    icon: <SearchOutlined />,
    description: 'End-user search experience frontend.',
  },
  {
    path: '/kt-docs/crawl-portal',
    title: 'Crawl Portal',
    tech: 'React',
    techColor: 'cyan',
    icon: <ControlOutlined />,
    description: 'Admin UI to configure and manage crawl jobs.',
  },
  {
    path: '/kt-docs/embed-ui',
    title: 'Embed UI',
    tech: 'React',
    techColor: 'cyan',
    icon: <CodeSandboxOutlined />,
    description: 'Embeddable search/chat widget for host sites.',
  },
  {
    path: '/kt-docs/crawler',
    title: 'Crawler',
    tech: 'Python',
    techColor: 'gold',
    icon: <BugOutlined />,
    description: 'Backend crawling + indexing engine.',
  },
];

export default function KtDocsHome() {
  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        <Title level={2} className="!mb-1">
          Knowledge Transfer Documentation
        </Title>
        <Paragraph type="secondary">
          Handover docs for each system in the platform. Pick a system on the left, or below, to
          read its KT notes. Each page uses the same template so nothing gets missed during transfer.
        </Paragraph>

        <Card className="!mb-6" size="small">
          <Text strong>How to use: </Text>
          <Text type="secondary">
            Every doc has the same sections (overview, setup, architecture, config, deployment,
            gotchas, contacts…). Sections marked{' '}
            <Tag color="warning" className="!mr-0">
              TODO
            </Tag>{' '}
            still need to be filled in. Add a new system by editing{' '}
            <Text code>app/kt-docs/layout.tsx</Text>.
          </Text>
        </Card>

        <List
          grid={{ gutter: 16, xs: 1, sm: 2, lg: 2 }}
          dataSource={systems}
          renderItem={(s) => (
            <List.Item>
              <Link href={s.path}>
                <Card hoverable className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl text-gray-700 shrink-0">
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Space className="mb-1">
                        <Text strong className="text-base">
                          {s.title}
                        </Text>
                        <Tag color={s.techColor}>{s.tech}</Tag>
                      </Space>
                      <Paragraph type="secondary" className="!mb-0 text-sm">
                        {s.description}
                      </Paragraph>
                    </div>
                    <ArrowRightOutlined className="text-gray-400" />
                  </div>
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
