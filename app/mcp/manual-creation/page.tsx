'use client';

import McpManualCreationForm from './_components/McpManualCreationForm/index';
import type { McpServerOutput } from './_components/McpManualCreationForm/types';

export default function McpManualCreationPage() {
  const handleSave = (data: McpServerOutput) => {
    console.log('MCP Server Output:', data);
  };

  return <McpManualCreationForm onSave={handleSave} />;
}
