'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Switch,
  Segmented,
  Input,
  Card,
  Typography,
  Space,
  Alert,
  Divider,
  Tag,
} from 'antd';
import type { FormInstance } from 'antd';
import { CheckCircleOutlined, CodeOutlined, ToolOutlined } from '@ant-design/icons';
import SchemaFieldList from './SchemaFieldList';
import {
  SchemaField,
  createEmptyField,
  fieldsToJsonSchema,
  jsonSchemaToFields,
  validateJsonSchema,
} from './utils';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface OutputSchemaBuilderProps {
  form: FormInstance;
}

const OutputSchemaBuilder: React.FC<OutputSchemaBuilderProps> = ({ form }) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [mode, setMode] = useState<'builder' | 'raw'>('builder');
  const [fields, setFields] = useState<SchemaField[]>([createEmptyField()]);
  const [rawSchema, setRawSchema] = useState<string>('');
  const [rawError, setRawError] = useState<string | undefined>();

  // Compute JSON schema string from current state
  const computedSchema = useMemo(() => {
    if (!enabled) return '';

    if (mode === 'builder') {
      const hasValidField = fields.some((f) => f.name.trim() !== '');
      if (!hasValidField) return '';
      const schema = fieldsToJsonSchema(fields);
      return JSON.stringify(schema, null, 2);
    }

    // In raw mode, return the raw input (only if valid)
    if (rawSchema.trim()) {
      const result = validateJsonSchema(rawSchema);
      if (result.valid) {
        return rawSchema.trim();
      }
    }
    return '';
  }, [enabled, mode, fields, rawSchema]);

  // Sync computed schema to the antd form instance
  useEffect(() => {
    form.setFieldValue('outputSchemaEnabled', enabled);
    form.setFieldValue('outputSchema', enabled ? computedSchema : '');
  }, [enabled, computedSchema, form]);

  // Handle mode switch
  const handleModeChange = useCallback(
    (value: string | number) => {
      const newMode = value as 'builder' | 'raw';

      if (newMode === 'raw' && mode === 'builder') {
        // Builder → Raw: populate raw editor with current schema
        const hasValidField = fields.some((f) => f.name.trim() !== '');
        if (hasValidField) {
          const schema = fieldsToJsonSchema(fields);
          setRawSchema(JSON.stringify(schema, null, 2));
          setRawError(undefined);
        } else {
          setRawSchema('');
          setRawError(undefined);
        }
      } else if (newMode === 'builder' && mode === 'raw') {
        // Raw → Builder: try to parse raw schema into fields
        if (rawSchema.trim()) {
          const result = validateJsonSchema(rawSchema);
          if (result.valid && result.schema) {
            try {
              const parsed = jsonSchemaToFields(result.schema);
              if (parsed.length > 0) {
                setFields(parsed);
              }
            } catch {
              // If parsing fails, keep current builder fields
            }
          }
        }
      }

      setMode(newMode);
    },
    [mode, fields, rawSchema]
  );

  // Handle raw schema text change
  const handleRawSchemaChange = useCallback((value: string) => {
    setRawSchema(value);
    if (value.trim()) {
      const result = validateJsonSchema(value);
      setRawError(result.valid ? undefined : result.error);
    } else {
      setRawError(undefined);
    }
  }, []);

  const handleEnabledChange = useCallback((checked: boolean) => {
    setEnabled(checked);
  }, []);

  return (
    <Card
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space align="center">
            <CodeOutlined style={{ fontSize: 18 }} />
            <Title level={5} style={{ margin: 0 }}>
              Output Schema
            </Title>
            {enabled && computedSchema && (
              <Tag
                icon={<CheckCircleOutlined />}
                color="success"
                style={{ marginLeft: 4 }}
              >
                Active
              </Tag>
            )}
          </Space>
          <Space align="center">
            <Text type="secondary" style={{ fontSize: 13 }}>
              {enabled ? 'Enabled' : 'Disabled'}
            </Text>
            <Switch checked={enabled} onChange={handleEnabledChange} />
          </Space>
        </div>
      }
    >
      {!enabled ? (
        <div style={{ padding: '12px 0' }}>
          <Text type="secondary">
            Enable the output schema to define the structured response
            format for this agent. When enabled, the agent will return
            responses conforming to the specified JSON Schema.
          </Text>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Mode Switcher */}
          <Segmented
            value={mode}
            onChange={handleModeChange}
            options={[
              {
                label: (
                  <Space>
                    <ToolOutlined />
                    Visual Builder
                  </Space>
                ),
                value: 'builder',
              },
              {
                label: (
                  <Space>
                    <CodeOutlined />
                    Raw JSON Schema
                  </Space>
                ),
                value: 'raw',
              },
            ]}
            block
            style={{ marginBottom: 4 }}
          />

          {/* Builder Mode */}
          {mode === 'builder' && (
            <div>
              <Text
                type="secondary"
                style={{
                  display: 'block',
                  marginBottom: 12,
                  fontSize: 13,
                }}
              >
                Define the properties that the agent must include in its
                structured response. Each property has a name, type,
                optional description, and can be marked as required.
              </Text>
              <SchemaFieldList fields={fields} onChange={setFields} />
            </div>
          )}

          {/* Raw JSON Mode */}
          {mode === 'raw' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <Text
                type="secondary"
                style={{ fontSize: 13 }}
              >
                Enter a valid JSON Schema object directly. The schema is
                validated in real-time.
              </Text>
              <TextArea
                value={rawSchema}
                onChange={(e) =>
                  handleRawSchemaChange(e.target.value)
                }
                placeholder={`{
  "type": "object",
  "properties": {
    "answer": {
      "type": "string",
      "description": "The agent's answer"
    },
    "confidence": {
      "type": "number",
      "description": "Confidence score between 0 and 1"
    }
  },
  "required": ["answer"]
}`}
                autoSize={{ minRows: 10, maxRows: 24 }}
                style={{
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: 13,
                }}
                status={rawError ? 'error' : undefined}
              />
              {rawError && (
                <Alert
                  type="error"
                  message={rawError}
                  showIcon
                  style={{ fontSize: 13 }}
                />
              )}
              {!rawError && rawSchema.trim() && (
                <Alert
                  type="success"
                  message="Valid JSON Schema"
                  showIcon
                  style={{ fontSize: 13 }}
                />
              )}
            </div>
          )}

          {/* Schema Preview (builder mode only) */}
          {mode === 'builder' && computedSchema && (
            <>
              <Divider style={{ margin: '4px 0' }} />
              <div>
                <Text
                  strong
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  Generated JSON Schema Preview:
                </Text>
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
                    maxHeight: 360,
                    margin: 0,
                  }}
                >
                  {computedSchema}
                </pre>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default OutputSchemaBuilder;
