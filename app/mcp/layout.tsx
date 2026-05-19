'use client';

import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Tooltip } from 'antd';
import {
  ToolOutlined,
  SettingOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Sider, Content } = Layout;
const { Text } = Typography;

interface McpLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    key: '/mcp/manual-creation',
    icon: <SettingOutlined />,
    label: 'Manual Creation',
  },
];

export default function McpLayout({ children }: McpLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen">
      <Sider
        width={260}
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
                <Tooltip title="MCP Tools" placement="right">
                  <Link href="/">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white cursor-pointer">
                      <ToolOutlined className="text-lg" />
                    </div>
                  </Link>
                </Tooltip>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white">
                    <ToolOutlined className="text-lg" />
                  </div>
                  <div>
                    <Text strong className="text-gray-800 block">
                      MCP Tools
                    </Text>
                    <Text type="secondary" className="text-xs">
                      Server Configuration
                    </Text>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-2">
            {!collapsed && (
              <div className="px-4 py-2">
                <Text type="secondary" className="text-xs uppercase tracking-wider font-medium">
                  Configuration
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
                label: <Link href={item.key}>{item.label}</Link>,
              }))}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            {collapsed ? (
              <Tooltip title="MCP Overview" placement="right">
                <Link href="/mcp">
                  <Button
                    type="text"
                    icon={<HomeOutlined />}
                    className="w-full !text-gray-600 hover:!text-green-600"
                  />
                </Link>
              </Tooltip>
            ) : (
              <Link href="/mcp">
                <Button
                  type="text"
                  icon={<HomeOutlined />}
                  className="w-full !justify-start !text-gray-600 hover:!text-green-600"
                >
                  MCP Overview
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

      <Content className="bg-gray-50">
        {children}
      </Content>
    </Layout>
  );
}
