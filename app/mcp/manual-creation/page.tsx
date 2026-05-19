'use client';

import { useState } from 'react';
import { Typography, Card } from 'antd';
import McpManualCreationForm from './_components/McpManualCreationForm/index';
import type { FormData } from './_components/McpManualCreationForm/types';

const { Title, Text } = Typography;

// Pre-defined value for testing edit mode
const INITIAL_VALUE: FormData = {
  type: 'local',
  name: 'my-mcp-server',
  owner: 'team-alpha',
  tools: [
    {
      id: 'tool-1',
      name: 'search_products',
      type: 'azure',
      indexName: 'product-catalog',
      description: 'Search for products in the catalog',
      params: ['query', 'skip', 'top', 'filter'],
    },
    {
      id: 'tool-2',
      name: 'search_orders',
      type: 'azure',
      indexName: 'order-history',
      description: 'Search order history',
      params: ['query', 'count'],
    },
  ] as FormData['tools'],
  isPublic: false,
  cacheConfig: {
    enabled: true,
    ttl: 3600,
    size: 10,
    location: 'memory',
  },
  authenConfig: {
    enabled: true,
    azureAD: {
      enabled: true,
      groups: ['developers', 'admins'],
    },
    accessKey: {
      enabled: false,
      headerName: 'x-mcp-api-key',
      accessKeyValue: '',
    },
  },
};

export default function McpManualCreationPage() {
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleChange = (data: FormData) => {
    console.log('Form Data Changed:', data);
    setFormData(data);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="mb-6">
        <Title level={3} className="!mb-1 !text-gray-800">
          Edit MCP Server
        </Title>
        <Text type="secondary">Configure your Model Context Protocol server.</Text>
      </div>

      {/* Form Result Preview */}
      {formData && (
        <Card 
          size="small" 
          className="mb-4 !bg-gray-900"
          styles={{ body: { padding: '12px 16px' } }}
        >
          <Text className="text-xs text-gray-400 uppercase tracking-wide block mb-2">
            Form Output (Live)
          </Text>
          <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap m-0 max-h-[300px] overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </Card>
      )}

      <McpManualCreationForm initialValue={INITIAL_VALUE} onChange={handleChange} />
    </div>
  );
}
