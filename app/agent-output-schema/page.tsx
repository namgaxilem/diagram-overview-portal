'use client';

import React, { useState } from 'react';
import { Form, Button, Typography, Card, message } from 'antd';
import { CopyOutlined, EyeOutlined } from '@ant-design/icons';
import OutputSchemaBuilder from './components/OutputSchemaBuilder';

const { Title, Text } = Typography;

export default function AgentOutputSchemaPage() {
  const [form] = Form.useForm();
  const [schemaOutput, setSchemaOutput] = useState<string>('');

  const handleGetSchema = () => {
    const enabled = form.getFieldValue('outputSchemaEnabled');
    const schema = form.getFieldValue('outputSchema');

    if (!enabled) {
      message.info('Output schema is not enabled');
      setSchemaOutput('');
      return;
    }

    if (!schema) {
      message.warning('No valid schema defined yet. Add at least one named property.');
      setSchemaOutput('');
      return;
    }

    setSchemaOutput(schema);
    message.success('Schema retrieved successfully');
  };

  const handleCopySchema = () => {
    if (schemaOutput) {
      navigator.clipboard.writeText(schemaOutput);
      message.success('Schema copied to clipboard');
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          Agent Output Schema Builder
        </Title>
        <Text type="secondary">
          Define the structured output schema that an agent must follow when
          generating responses. This ensures consistent, machine-readable
          output for downstream workflow integration.
        </Text>
      </div>

      <OutputSchemaBuilder form={form} />

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={handleGetSchema}
        >
          Get Schema Value
        </Button>
        {schemaOutput && (
          <Button icon={<CopyOutlined />} onClick={handleCopySchema}>
            Copy Schema
          </Button>
        )}
      </div>

      {schemaOutput && (
        <Card
          title="Retrieved Schema Output"
          style={{ marginTop: 16 }}
          size="small"
        >
          <pre
            style={{
              background: '#f6f8fa',
              border: '1px solid #d0d7de',
              borderRadius: 8,
              padding: 16,
              fontSize: 13,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              lineHeight: 1.5,
              overflow: 'auto',
              maxHeight: 400,
              margin: 0,
            }}
          >
            {schemaOutput}
          </pre>
        </Card>
      )}
    </div>
  );
}
