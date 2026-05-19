'use client';

import { SaveOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Input, message, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import AuthenConfig from './_components/AuthenConfig';
import CacheConfigComponent from './_components/CacheConfig';
import ToolsConfig from './_components/ToolsConfig';
import type { AuthConfig, CacheConfig, FormData, McpServerOutput, ToolConfig } from './types';

const { Text } = Typography;

const DEFAULT_FORM_DATA: FormData = {
  type: 'local',
  name: '',
  owner: '',
  tools: [],
  isPublic: false,
  cacheConfig: {
    enabled: false,
    ttl: 86400,
    size: 5,
    location: 'memory',
  },
  authenConfig: {
    enabled: false,
    azureAD: {
      enabled: false,
      groups: [],
    },
    accessKey: {
      enabled: false,
      headerName: 'x-mcp-api-key',
      accessKeyValue: '',
    },
  },
};

interface McpManualCreationFormProps {
  value?: FormData;
  initialValue?: FormData;
  onChange?: (data: FormData) => void;
  onSave?: (data: McpServerOutput) => void;
}

export default function McpManualCreationForm({
  value,
  initialValue,
  onChange,
  onSave,
}: McpManualCreationFormProps) {
  const [messageApi, contextHolder] = message.useMessage();

  // Helper to ensure tools have ids (for internal use)
  const ensureToolIds = (data: FormData): FormData => ({
    ...data,
    tools: data.tools.map((tool, index) => ({
      ...tool,
      id: (tool as ToolConfig).id || `tool-${Date.now()}-${index}`,
    })) as ToolConfig[],
  });

  // Helper to strip id from tools for output
  const stripToolIds = (data: FormData): McpServerOutput => ({
    type: data.type,
    name: data.name,
    owner: data.owner,
    tools: data.tools.map(({ id, ...rest }) => rest),
    isPublic: data.isPublic,
    cacheConfig: data.cacheConfig,
    authenConfig: data.authenConfig,
  });

  // Internal state - used when not controlled
  const [internalFormData, setInternalFormData] = useState<FormData>(() =>
    ensureToolIds(initialValue ?? DEFAULT_FORM_DATA)
  );

  // Determine if controlled or uncontrolled
  const isControlled = value !== undefined;
  // Ensure tools have ids when using controlled value
  const formData = isControlled ? ensureToolIds(value) : internalFormData;

  // Update internal state when initialValue changes (for reset scenarios)
  useEffect(() => {
    if (!isControlled && initialValue) {
      setInternalFormData(ensureToolIds(initialValue));
    }
  }, [initialValue, isControlled]);

  // Unified update function
  const updateFormData = useCallback(
    (updater: (prev: FormData) => FormData) => {
      if (isControlled) {
        // Controlled mode: call onChange with new value
        if (onChange) {
          const newData = updater(formData);
          onChange(stripToolIds(newData) as FormData);
        }
      } else {
        // Uncontrolled mode: update internal state and optionally notify
        setInternalFormData((prev) => {
          const newData = updater(prev);
          if (onChange) {
            onChange(stripToolIds(newData) as FormData);
          }
          return newData;
        });
      }
    },
    [isControlled, formData, onChange]
  );

  // ── Auth Handlers ───────────────────────────────────────────────────────────

  const updateAuth = useCallback(
    (updates: Partial<AuthConfig>) => {
      updateFormData((prev) => ({
        ...prev,
        authenConfig: { ...prev.authenConfig, ...updates },
      }));
    },
    [updateFormData]
  );

  const updateAzureAD = useCallback(
    (updates: Partial<AuthConfig['azureAD']>) => {
      updateFormData((prev) => ({
        ...prev,
        authenConfig: {
          ...prev.authenConfig,
          azureAD: { ...prev.authenConfig.azureAD, ...updates },
        },
      }));
    },
    [updateFormData]
  );

  const updateAccessKey = useCallback(
    (updates: Partial<AuthConfig['accessKey']>) => {
      updateFormData((prev) => ({
        ...prev,
        authenConfig: {
          ...prev.authenConfig,
          accessKey: { ...prev.authenConfig.accessKey, ...updates },
        },
      }));
    },
    [updateFormData]
  );

  // ── Cache Handlers ──────────────────────────────────────────────────────────

  const updateCache = useCallback(
    (updates: Partial<CacheConfig>) => {
      updateFormData((prev) => ({
        ...prev,
        cacheConfig: { ...prev.cacheConfig, ...updates },
      }));
    },
    [updateFormData]
  );

  // ── Tools Handlers ──────────────────────────────────────────────────────────

  const addTool = useCallback(
    (tool: ToolConfig) => {
      updateFormData((prev) => ({
        ...prev,
        tools: [...prev.tools, tool],
      }));
      messageApi.success('Tool added successfully');
    },
    [updateFormData, messageApi]
  );

  const removeTool = useCallback(
    (id: string) => {
      updateFormData((prev) => ({
        ...prev,
        tools: prev.tools.filter((t) => t.id !== id),
      }));
      messageApi.info('Tool removed');
    },
    [updateFormData, messageApi]
  );

  // ── Submit Handler ──────────────────────────────────────────────────────────

  const handleSubmit = useCallback(() => {
    if (!formData.name.trim()) {
      messageApi.error('Please enter a server name');
      return;
    }
    if (formData.tools.length === 0) {
      messageApi.warning('Please add at least one tool');
      return;
    }

    // Build output without internal 'id' field in tools
    const output: McpServerOutput = {
      type: formData.type,
      name: formData.name,
      owner: formData.owner,
      tools: formData.tools.map(({ id, ...rest }) => rest),
      isPublic: formData.isPublic,
      cacheConfig: formData.cacheConfig,
      authenConfig: formData.authenConfig,
    };

    if (onSave) {
      onSave(output);
    }
    messageApi.success('MCP Server configuration saved!');
  }, [formData, messageApi, onSave]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div>
      {contextHolder}

      {/* Basic Info */}
      <Card className="!mb-3 shadow-sm" styles={{ body: { padding: '16px 20px' } }}>
        <div>
          <Text strong className="text-gray-700 text-sm">
            Server Name <Text type="danger">*</Text>
          </Text>
          <Input
            size="large"
            placeholder="e.g., mcpservername1"
            value={formData.name}
            onChange={(e) => updateFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="mt-1"
          />
        </div>
      </Card>

      {/* Tools Config */}
      <ToolsConfig tools={formData.tools} onAddTool={addTool} onRemoveTool={removeTool} />

      {/* Authentication Config */}
      <AuthenConfig
        auth={formData.authenConfig}
        onUpdate={updateAuth}
        onUpdateAzureAD={updateAzureAD}
        onUpdateAccessKey={updateAccessKey}
      />

      {/* Cache Config */}
      <CacheConfigComponent cache={formData.cacheConfig} onUpdate={updateCache} />

      {/* Submit */}
      {onSave && (
        <>
          <Divider className="!my-6" />
          <div className="flex justify-end">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSubmit}
            >
              Save Configuration
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
