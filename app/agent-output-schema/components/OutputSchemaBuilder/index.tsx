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
  Button,
} from 'antd';
import { CheckCircleOutlined, CodeOutlined, ToolOutlined, CloudDownloadOutlined } from '@ant-design/icons';
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
  initialEnabled?: boolean; // Initial enabled state from parent
  readOnly?: boolean;
  isAllRequired?: boolean;
  onFetchSchema?: (prompt: string) => Promise<string> | void; // Callback to fetch/generate schema from API
}

const OutputSchemaBuilder: React.FC<OutputSchemaBuilderProps> = ({ 
  setOutputSchema, 
  setOutputSchemaEnabled, 
  value, 
  initOutputSchema,
  initialEnabled = false,
  readOnly = false, 
  isAllRequired = false,
  onFetchSchema,
}) => {
  const initialized = useRef(false);
  const [enabled, setEnabled] = useState<boolean>(initialEnabled);
  const [mode, setMode] = useState<'builder' | 'raw'>('builder');
  const [fields, setFields] = useState<SchemaField[]>([createEmptyField()]);
  const [schemaMetadata, setSchemaMetadata] = useState<Record<string, unknown>>({});
  const [rawSchema, setRawSchema] = useState<string>('');
  const [rawError, setRawError] = useState<string | undefined>();
  const [builderDisabled, setBuilderDisabled] = useState<boolean>(false);
  const [builderDisabledReason, setBuilderDisabledReason] = useState<string>('');
  const [rawValueInvalid, setRawValueInvalid] = useState<boolean>(false);
  const [isFetchingSchema, setIsFetchingSchema] = useState<boolean>(false);
  const [fetchPrompt, setFetchPrompt] = useState<string>('');

  // Initialize from value or initOutputSchema on first mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initialValue = value || initOutputSchema;
    if (!initialValue) return;

    // Set raw value as-is (source of truth)
    setRawSchema(initialValue);

    // Try to validate and parse
    const result = validateJsonSchema(initialValue);
    if (result.valid && result.schema) {
      setRawError(undefined);
      setRawValueInvalid(false);

      // Try to parse for visual builder
      try {
        const { fields: parsed, metadata } = jsonSchemaToFields(result.schema);
        setSchemaMetadata(metadata);
        
        // If schema is valid JSON but visual builder can't fully represent it
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
      // Invalid JSON - set error and disable builder
      setRawError(result.error);
      setRawValueInvalid(true);
      setBuilderDisabled(true);
      setBuilderDisabledReason('Invalid JSON format');
      setMode('raw');
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
  // Raw is the single source of truth - always return rawSchema
  const computedSchema = useMemo(() => {
    if (!enabled) return '';
    return rawSchema.trim();
  }, [enabled, rawSchema]);

  // Propagate values to parent
  useEffect(() => {
    setOutputSchemaEnabled(enabled);
    setOutputSchema(enabled ? computedSchema : '');
  }, [enabled, computedSchema, setOutputSchema, setOutputSchemaEnabled]);

  // Handle mode switch - NEVER modify rawSchema when switching tabs
  const handleModeChange = useCallback(
    (value: string | number) => {
      const newMode = value as 'builder' | 'raw';

      // Prevent switching to builder if it's disabled
      if (newMode === 'builder' && builderDisabled) {
        return;
      }

      if (newMode === 'builder' && mode === 'raw') {
        // Raw → Builder: parse raw into fields (but do NOT modify raw)
        if (!rawValueInvalid && rawSchema.trim()) {
          const result = validateJsonSchema(rawSchema);
          if (result.valid && result.schema) {
            try {
              const canHandle = canVisualBuilderHandleSchema(result.schema);
              if (canHandle) {
                const { fields: parsed, metadata } = jsonSchemaToFields(result.schema);
                setSchemaMetadata(metadata);
                if (parsed.length > 0) {
                  setFields(parsed);
                }
              }
            } catch {
              // If parsing fails, keep current builder fields
            }
          }
        }
      }
      // Builder → Raw: just switch, raw already has latest value

      setMode(newMode);
    },
    [mode, rawSchema, rawValueInvalid, builderDisabled, canVisualBuilderHandleSchema]
  );

  // Handle raw schema text change - raw JSON is source of truth
  const handleRawSchemaChange = useCallback((value: string) => {
    setRawSchema(value);
    if (value.trim()) {
      const result = validateJsonSchema(value);
      setRawError(result.valid ? undefined : result.error);
      setRawValueInvalid(!result.valid);
      
      if (result.valid && result.schema) {
        // Valid JSON - check if visual builder can handle it
        try {
          const canHandle = canVisualBuilderHandleSchema(result.schema);
          if (canHandle) {
            setBuilderDisabled(false);
            setBuilderDisabledReason('');
            // Parse fields so builder is ready
            const { fields: parsed, metadata } = jsonSchemaToFields(result.schema);
            setSchemaMetadata(metadata);
            if (parsed.length > 0) {
              setFields(parsed);
            }
          } else {
            setBuilderDisabled(true);
            setBuilderDisabledReason('Schema contains advanced features not supported by visual builder');
          }
        } catch {
          setBuilderDisabled(true);
          setBuilderDisabledReason('Schema structure is not compatible with visual builder');
        }
      } else {
        // Invalid JSON → disable visual builder
        setBuilderDisabled(true);
        setBuilderDisabledReason('Invalid JSON format - fix raw value to use Visual Builder');
      }
    } else {
      // Empty raw → clear errors, re-enable builder
      setRawError(undefined);
      setRawValueInvalid(false);
      setBuilderDisabled(false);
      setBuilderDisabledReason('');
    }
  }, [canVisualBuilderHandleSchema]);

  // Handle field changes from visual builder - sync to raw (source of truth)
  const handleFieldsChange = useCallback((newFields: SchemaField[]) => {
    setFields(newFields);
    // Sync builder changes to raw
    const effectiveFields = isAllRequired ? applyAllRequired(newFields) : newFields;
    const hasValidField = effectiveFields.some((f) => f.name.trim() !== '');
    if (hasValidField) {
      const schema = fieldsToJsonSchema(effectiveFields, schemaMetadata);
      const newRaw = JSON.stringify(schema, null, 2);
      setRawSchema(newRaw);
      setRawError(undefined);
      setRawValueInvalid(false);
    }
  }, [isAllRequired, applyAllRequired, schemaMetadata]);

  const handleEnabledChange = useCallback((checked: boolean) => {
    setEnabled(checked);
  }, []);

  // Handle fetch schema from API
  const handleFetchSchema = useCallback(async () => {
    if (!onFetchSchema) return;
    
    setIsFetchingSchema(true);
    setRawError(undefined);
    
    try {
      const fetchedSchema = await onFetchSchema(fetchPrompt);
      if (fetchedSchema) {
        handleRawSchemaChange(fetchedSchema);
      }
    } catch (error) {
      setRawError(`Failed to fetch schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsFetchingSchema(false);
    }
  }, [onFetchSchema, fetchPrompt, handleRawSchemaChange]);

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
                />
              ) : (
                <SchemaFieldList fields={fields} onChange={handleFieldsChange} readOnly={readOnly} isAllRequired={isAllRequired} />
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
              {onFetchSchema && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Input.TextArea
                    value={fetchPrompt}
                    onChange={(e) => setFetchPrompt(e.target.value)}
                    placeholder="Enter a prompt to generate schema... (e.g., Create a schema for user profile with name, email, age)"
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    disabled={readOnly || isFetchingSchema}
                  />
                  <Button
                    icon={<CloudDownloadOutlined />}
                    loading={isFetchingSchema}
                    onClick={handleFetchSchema}
                    disabled={readOnly || isFetchingSchema || !fetchPrompt.trim()}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Generate Schema
                  </Button>
                </div>
              )}
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
