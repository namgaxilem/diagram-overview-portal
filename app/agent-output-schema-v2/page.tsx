'use client';

import React, { useState } from 'react';
import { FormBuilder } from '@ginkgo-bioworks/react-json-schema-form-builder';
import { Card, Typography, Button, Space, Divider, Tabs, message } from 'antd';
import { CopyOutlined, DownloadOutlined, UploadOutlined, ClearOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function AgentOutputSchemaV2Page() {
  const [schema, setSchema] = useState('{}');
  const [uischema, setUiSchema] = useState('{}');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleChange = (newSchema: string, newUiSchema: string) => {
    setSchema(newSchema);
    setUiSchema(newUiSchema);
    setJsonError(null);
  };

  const handleCopy = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(schema), null, 2);
      navigator.clipboard.writeText(formatted);
      message.success('Schema copied to clipboard');
    } catch {
      message.error('Invalid JSON schema');
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([schema], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'schema.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success('Schema downloaded');
    } catch {
      message.error('Failed to download schema');
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Validate JSON
        JSON.parse(content);
        setSchema(content);
        message.success('Schema loaded successfully');
      } catch (_err) {
        setJsonError('Invalid JSON file');
        message.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setSchema('{}');
    setUiSchema('{}');
    setJsonError(null);
    message.info('Schema cleared');
  };

  const formatSchema = () => {
    try {
      const parsed = JSON.parse(schema);
      setSchema(JSON.stringify(parsed, null, 2));
      message.success('Schema formatted');
    } catch {
      setJsonError('Invalid JSON - cannot format');
      message.error('Invalid JSON - cannot format');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Title level={2}>Agent Output Schema Builder V2</Title>
          <Text type="secondary">
            Visually build JSON schemas using the Ginkgo Bioworks Form Builder
          </Text>
        </div>

        <Card className="mb-4">
          <Space wrap className="mb-4">
            <Button type="primary" icon={<CopyOutlined />} onClick={handleCopy}>
              Copy Schema
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleDownload}>
              Download JSON
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={() => document.getElementById('schema-upload')?.click()}
            >
              Upload JSON
            </Button>
            <input
              id="schema-upload"
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
            <Button onClick={formatSchema}>Format JSON</Button>
            <Button icon={<ClearOutlined />} danger onClick={handleClear}>
              Clear
            </Button>
          </Space>

          <Divider />

          <div className="h-[600px] border border-gray-200 rounded overflow-hidden">
            <FormBuilder schema={schema} uischema={uischema} onChange={handleChange} />
          </div>
        </Card>

        <Card title="Generated Schema" className="mb-4">
          <Tabs defaultActiveKey="schema">
            <TabPane tab="JSON Schema" key="schema">
              <pre
                style={{
                  backgroundColor: '#f6f8fa',
                  padding: '16px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  maxHeight: '400px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              >
                {schema}
              </pre>
            </TabPane>
            <TabPane tab="UI Schema" key="uischema">
              <pre
                style={{
                  backgroundColor: '#f6f8fa',
                  padding: '16px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  maxHeight: '400px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              >
                {uischema}
              </pre>
            </TabPane>
          </Tabs>
        </Card>

        {jsonError && (
          <Card className="mb-4" style={{ borderColor: '#ff4d4f' }}>
            <Text type="danger">{jsonError}</Text>
          </Card>
        )}
      </div>
    </main>
  );
}
