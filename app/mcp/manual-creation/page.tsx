'use client';

import { Typography } from 'antd';
import McpManualCreationForm from './_components/McpManualCreationForm/index';
import type { FormData } from './_components/McpManualCreationForm/types';

const { Title, Text } = Typography;

export default function McpManualCreationPage() {
  const handleChange = (data: FormData) => {
    console.log('Form Data Changed:', data);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="mb-6">
        <Title level={3} className="!mb-1 !text-gray-800">
          Create MCP Server
        </Title>
        <Text type="secondary">Configure your Model Context Protocol server.</Text>
      </div>
      <McpManualCreationForm onChange={handleChange} />
    </div>
  );
}
