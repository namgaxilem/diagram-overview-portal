'use client';

import React, { useState } from 'react';
import { Button, Typography, Card, message } from 'antd';
import { CopyOutlined, EyeOutlined } from '@ant-design/icons';
import OutputSchemaBuilder from './components/OutputSchemaBuilder';

const { Title, Text } = Typography;

export default function AgentOutputSchemaPage() {
  const [outputSchema, setOutputSchema] = useState<string>('');
  const [outputSchemaEnabled, setOutputSchemaEnabled] = useState<boolean>(true);
  const [schemaOutput, setSchemaOutput] = useState<string>('');

  const handleGetSchema = () => {
    if (!outputSchemaEnabled) {
      message.info('Output schema is not enabled');
      setSchemaOutput('');
      return;
    }

    if (!outputSchema) {
      message.warning('No valid schema defined yet. Add at least one named property.');
      setSchemaOutput('');
      return;
    }

    setSchemaOutput(outputSchema);
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

      <OutputSchemaBuilder
        setOutputSchema={setOutputSchema}
        setOutputSchemaEnabled={setOutputSchemaEnabled}
        initialEnabled={outputSchemaEnabled}
        // readOnly={true}
        isAllRequired={true}
        initOutputSchema={JSON.stringify({
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "age": { "type": "integer", "minimum": 0 },
            "email": { "type": "string", "format": "email" }
          },
          "required": ["name", "email"],
          "additionalProperties": false
        })}
      />

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
