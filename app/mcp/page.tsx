'use client';

import { Card, Button, Typography } from 'antd';
import Link from 'next/link';
import { SettingOutlined } from '@ant-design/icons';
import React from 'react';

const { Title, Paragraph } = Typography;

interface SubRouteItem {
  path: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

export default function McpPage() {
  const subRoutes: SubRouteItem[] = [
    {
      path: '/mcp/manual-creation',
      title: 'Manual Creation',
      description: 'Configure MCP servers with caching, storage options, and tool definitions',
      icon: <SettingOutlined style={{ fontSize: 28 }} />,
      color: '#10b981',
      gradient: 'from-emerald-500 to-green-600',
    },
  ];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <Title level={3} className="!mb-2 !text-gray-800">
          Overview
        </Title>
        <Paragraph className="!mb-0 !text-gray-500">
          Select a tool to configure your MCP server.
        </Paragraph>
      </div>

      {/* Sub Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {subRoutes.map((route) => (
          <Card
            key={route.path}
            hoverable
            className="h-full overflow-hidden"
            styles={{ body: { padding: 0 } }}
            actions={[
              <Link href={route.path} key="navigate">
                <Button type="primary" block style={{ backgroundColor: route.color, borderColor: route.color }}>
                  Open
                </Button>
              </Link>,
            ]}
          >
            <div className={`bg-gradient-to-r ${route.gradient} p-5 flex items-center justify-center`}>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                {route.icon}
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold" style={{ color: route.color }}>
                  {route.title}
                </h3>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                  {route.path.replace('/mcp', '')}
                </code>
              </div>
              <p className="text-gray-600 text-sm">{route.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
