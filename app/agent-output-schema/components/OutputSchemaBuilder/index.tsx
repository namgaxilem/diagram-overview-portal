'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
  setOutputSchema: (schema: string) => void;
  setOutputSchemaEnabled: (enabled: boolean) => void;
  value?: string; // Raw JSON schema value - source of truth
  initOutputSchema?: string; // Deprecated: use 'value' instead
  readOnly?: boolean;
  isAllRequired?: boolean;
}

const OutputSchemaBuilder: React.FC<OutputSchemaBuilderProps> = ({ 
  setOutputSchema, 
  setOutputSchemaEnabled, 
  value, 
  initOutputSchema, 
  readOnly = false, 
  isAllRequired = false 
}) => {
  const initialized = useRef(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [mode, setMode] = useState<'builder' | 'raw'>('builder');
  const [fields, setFields] = useState<SchemaField[]>([createEmptyField()]);
  const [rawSchema, setRawSchema] = useState<string>('');
  const [rawError, setRawError] = useState<string | undefined>();
  const [builderDisabled, setBuilderDisabled] = useState<boolean>(false);
  const [builderDisabledReason, setBuilderDisabledReason] = useState<string>('');
  const [rawValueInvalid, setRawValueInvalid] = useState<boolean>(false);

  // Initialize from value or initOutputSchema on first mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initialValue = value || initOutputSchema;
    if (!initialValue) return;

    const result = validateJsonSchema(initialValue);
    if (result.valid && result.schema) {
      setRawSchema(JSON.stringify(result.schema, null, 2));
      setEnabled(true);

      // Try to parse for visual builder
      try {
        const parsed = jsonSchemaToFields(result.schema);
        // If schema is valid JSON but visual builder can't fully represent it
        // (e.g., has complex nested structures, refs, conditionals, etc.)
        const isComplexSchema = !canVisualBuilderHandleSchema(result.schema);
        
        if (isComplexSchema) {
          setBuilderDisabled(true);
          setBuilderDisabledReason('Schema contains advanced features not supported by visual builder');
          setMode('raw');
        } else if (parsed.length > 0) {
          setFields(parsed);
        }
      } catch (e) {
        // Parsing failed - disable visual builder
        setBuilderDisabled(true);
        setBuilderDisabledReason('Schema structure is not compatible with visual builder');
        setMode('raw');
      }
    } else {
      // Invalid JSON - still set raw value and let user fix it
      setRawSchema(initialValue);
      setRawError(result.error);
    }
  }, [value, initOutputSchema]);

  // When readOnly, force enabled to true
  useEffect(() => {
    if (readOnly && !enabled) {
      setEnabled(true);
    }
  }, [readOnly, enabled]);

  // Helper: apply isAllRequired to fields recursively
  const applyAllRequired = useCallback((fieldList: SchemaField[]): SchemaField[] => {
    return fieldList.map((f) => ({
      ...f,
      required: true,
      properties: f.properties.length > 0 ? applyAllRequired(f.properties) : f.properties,
    }));
  }, []);

  // Helper: check if visual builder can handle this schema
  const canVisualBuilderHandleSchema = useCallback((schema: Record<string, unknown>): boolean => {
    // Check for unsupported features
    
    // 1. Check for $ref (references)
    const hasRefs = JSON.stringify(schema).includes('"$ref"');
    if (hasRefs) return false;
    
    // 2. Check for oneOf, anyOf, allOf
    if (schema.oneOf || schema.anyOf || schema.allOf) return false;
    
    // 3. Check for if/then/else (conditional schemas)
    if (schema.if || schema.then || schema.else) return false;
    
    // 4. Check for additionalProperties being an object (schema validation)
    const additionalProps = schema.additionalProperties;
    if (additionalProps && typeof additionalProps === 'object') return false;
    
    // 5. Check for patternProperties
    if (schema.patternProperties) return false;
    
    // 6. Check for propertyNames
    if (schema.propertyNames) return false;
    
    // 7. Check for dependencies (old draft) or dependentSchemas/dependentRequired (new draft)
    if (schema.dependencies || schema.dependentSchemas || schema.dependentRequired) return false;
    
    // 8. Check root type is object
    if (schema.type !== 'object') return false;
    
    // 9. Check array items don't have complex schemas we can't handle
    const properties = schema.properties as Record<string, unknown> | undefined;
    if (properties) {
      for (const prop of Object.values(properties)) {
        if (typeof prop === 'object' && prop !== null) {
          const propObj = prop as Record<string, unknown>;
          
          // Check nested arrays with complex items
          if (propObj.type === 'array' && propObj.items) {
            const items = propObj.items as Record<string, unknown>;
            if (items.properties) {
              // Nested object items - recursively check
              if (!canVisualBuilderHandleSchema(items)) return false;
            }
          }
          
          // Check nested objects
          if (propObj.type === 'object' && propObj.properties) {
            if (!canVisualBuilderHandleSchema(propObj)) return false;
          }
        }
      }
    }
    
    return true;
  }, []);

  // Compute JSON schema string from current state
  const computedSchema = useMemo(() => {
    if (!enabled) return '';

    if (mode === 'builder') {
      const effectiveFields = isAllRequired ? applyAllRequired(fields) : fields;
      const hasValidField = effectiveFields.some((f) => f.name.trim() !== '');
      if (!hasValidField) return '';
      const schema = fieldsToJsonSchema(effectiveFields);
      return JSON.stringify(schema, null, 2);
    }

    // In raw mode, return the raw input (even if invalid - raw is source of truth)
    // User can save any value, validation is just a warning
    return rawSchema.trim();
  }, [enabled, mode, fields, rawSchema, isAllRequired, applyAllRequired]);

  // Propagate values to parent
  useEffect(() => {
    setOutputSchemaEnabled(enabled);
    setOutputSchema(enabled ? computedSchema : '');
  }, [enabled, computedSchema, setOutputSchema, setOutputSchemaEnabled]);

  // Handle mode switch
  const handleModeChange = useCallback(
    (value: string | number) => {
      const newMode = value as 'builder' | 'raw';

      // Prevent switching to builder if it's disabled
      if (newMode === 'builder' && builderDisabled) {
        return;
      }

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
    [mode, fields, rawSchema, builderDisabled]
  );

  // Handle raw schema text change - raw JSON is source of truth
  const handleRawSchemaChange = useCallback((value: string) => {
    setRawSchema(value);
    if (value.trim()) {
      const result = validateJsonSchema(value);
      setRawError(result.valid ? undefined : result.error);
      setRawValueInvalid(!result.valid);
    } else {
      setRawError(undefined);
      setRawValueInvalid(false);
    }
    // In raw mode, always propagate value to parent (even if invalid)
    // Validation error is just a warning, user can still save
    if (mode === 'raw') {
      setOutputSchema(value.trim());
    }
  }, [mode, setOutputSchema]);

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
            <Switch checked={enabled} onChange={handleEnabledChange} disabled={readOnly} />
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
          {builderDisabled && (
            <Alert
              type="warning"
              message="Visual Builder Disabled"
              description={builderDisabledReason}
              showIcon
              style={{ marginBottom: 12 }}
            />
          )}
          <Segmented
            value={mode}
            onChange={handleModeChange}
            disabled={readOnly}
            options={[
              {
                label: (
                  <Space>
                    <ToolOutlined />
                    Visual Builder
                  </Space>
                ),
                value: 'builder',
                disabled: builderDisabled,
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
              {rawValueInvalid ? (
                <Alert
                  type="error"
                  message="Cannot parse from raw value"
                  description="Please correct raw value to a valid JSON schema. Switch to Raw JSON Schema tab to fix the errors."
                  showIcon
                  style={{ marginBottom: 12 }}
                />
              ) : (
                <>
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
                  <SchemaFieldList fields={fields} onChange={setFields} readOnly={readOnly} isAllRequired={isAllRequired} />
                </>
              )}
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
                disabled={readOnly}
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
