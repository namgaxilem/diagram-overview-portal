import { Card, Button } from 'antd';
import Link from 'next/link';
import {
  LayoutOutlined,
  RobotOutlined,
  CloudServerOutlined,
  ApartmentOutlined,
  SafetyOutlined,
  FileTextOutlined,
  BuildOutlined,
  SettingOutlined,
  AppstoreOutlined,
  SearchOutlined,
  BugOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import React from 'react';

interface RouteItem {
  path: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

export default function Home() {
  const routes: RouteItem[] = [
    {
      path: '/admin-layout-1',
      title: 'Admin Layout 1',
      description: 'Modern admin interface with sidebar navigation, settings, and dashboard',
      icon: <LayoutOutlined style={{ fontSize: 32 }} />,
      color: '#1890ff',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      path: '/agent-detail-page',
      title: 'Agent Detail Page',
      description: 'Complete agent management interface with tabs, configuration, and monitoring',
      icon: <RobotOutlined style={{ fontSize: 32 }} />,
      color: '#722ed1',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      path: '/k8s-client',
      title: 'Kubernetes Client',
      description: 'Full kubectl UI for managing Kubernetes resources, pods, deployments, and more',
      icon: <CloudServerOutlined style={{ fontSize: 32 }} />,
      color: '#326ce5',
      gradient: 'from-sky-500 to-indigo-600',
    },
    {
      path: '/diagram-v4',
      title: 'Architecture Diagram V4',
      description: 'Interactive system architecture visualization and diagram tool',
      icon: <ApartmentOutlined style={{ fontSize: 32 }} />,
      color: '#13c2c2',
      gradient: 'from-cyan-500 to-teal-600',
    },
    {
      path: '/agent-authen-setting',
      title: 'Agent Authentication Settings',
      description: 'Configure authentication settings for agents including ForgeRock integration',
      icon: <SafetyOutlined style={{ fontSize: 32 }} />,
      color: '#52c41a',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      path: '/agent-output-schema',
      title: 'Agent Output Schema Builder',
      description: 'Visual builder for defining agent output schemas with JSON preview',
      icon: <FileTextOutlined style={{ fontSize: 32 }} />,
      color: '#fa8c16',
      gradient: 'from-orange-400 to-amber-500',
    },
    {
      path: '/agent-output-schema-v2',
      title: 'Agent Output Schema Builder V2',
      description: 'Advanced JSON schema builder using Ginkgo Bioworks Form Builder',
      icon: <BuildOutlined style={{ fontSize: 32 }} />,
      color: '#eb2f96',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      path: '/agent-policy-config-builder',
      title: 'Agent Policy Config Builder',
      description: 'Policy configuration builder for agent behavior and governance rules',
      icon: <SettingOutlined style={{ fontSize: 32 }} />,
      color: '#faad14',
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      path: '/registry-landing',
      title: 'Registry Landing Page',
      description: 'Project overview, architecture diagram, and features showcase',
      icon: <AppstoreOutlined style={{ fontSize: 32 }} />,
      color: '#2f54eb',
      gradient: 'from-indigo-500 to-blue-600',
    },
    {
      path: '/searchportal-landing-page',
      title: 'Search Portal Landing Page',
      description: 'Intelligent Search platform landing page with animated chat demo',
      icon: <SearchOutlined style={{ fontSize: 32 }} />,
      color: '#9254de',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      path: '/test-crawl',
      title: 'Crawler Test Pages',
      description: 'Test pages with various meta tags, structured data, and rich content for web crawler testing',
      icon: <BugOutlined style={{ fontSize: 32 }} />,
      color: '#f5222d',
      gradient: 'from-red-500 to-rose-600',
    },
    {
      path: '/crawler',
      title: 'Web Crawler Tools',
      description: 'Configure and manage web crawler settings including meta tag extraction and crawl rules',
      icon: <GlobalOutlined style={{ fontSize: 32 }} />,
      color: '#08979c',
      gradient: 'from-teal-500 to-cyan-600',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">DHP AI Experience Hub</h1>
        <p className="text-center text-gray-600 mb-12">Select a tool or interface to navigate to</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Card
              key={route.path}
              hoverable
              className="h-full overflow-hidden"
              styles={{ body: { padding: 0 } }}
              actions={[
                <Link href={route.path} key="navigate">
                  <Button type="primary" block style={{ backgroundColor: route.color, borderColor: route.color }}>
                    Open Page
                  </Button>
                </Link>,
              ]}
            >
              <div className={`bg-gradient-to-r ${route.gradient} p-6 flex items-center justify-center`}>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-sm">
                  {route.icon}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold truncate" style={{ color: route.color }}>{route.title}</h3>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">{route.path}</code>
                </div>
                <p className="text-gray-600 text-sm">{route.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
