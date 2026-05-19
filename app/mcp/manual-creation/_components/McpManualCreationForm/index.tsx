'use client';

import { SaveOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Input, message, Typography } from 'antd';
import { useCallback, useState } from 'react';
import AuthenConfig from './_components/AuthenConfig';
import CacheConfigComponent from './_components/CacheConfig';
import ToolsConfig from './_components/ToolsConfig';
import type { AuthConfig, CacheConfig, FormData, McpServerOutput, ToolConfig } from './types';

const { Title, Text } = Typography;

interface McpManualCreationFormProps {
  onSave?: (data: McpServerOutput) => void;
}

export default function McpManualCreationForm({ onSave }: McpManualCreationFormProps) {
  const [messageApi, contextHolder] = message.useMessage();

  const [formData, setFormData] = useState<FormData>({
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
      methods: ['azure-ad'],
      azureAd: {
        tenantId: '',
        clientId: '',
        audience: '',
      },
      apiKey: {
        headerName: 'x-mcp-api-key',
      },
    },
  });

  // ── Auth Handlers ───────────────────────────────────────────────────────────

  const updateAuth = useCallback((updates: Partial<AuthConfig>) => {
    setFormData((prev) => ({
      ...prev,
      authenConfig: { ...prev.authenConfig, ...updates },
    }));
  }, []);

  const toggleAuthMethod = useCallback((method: 'azure-ad' | 'api-key') => {
    setFormData((prev) => {
      const methods = prev.authenConfig.methods.includes(method)
        ? prev.authenConfig.methods.filter((m) => m !== method)
        : [...prev.authenConfig.methods, method];
      return {
        ...prev,
        authenConfig: { ...prev.authenConfig, methods },
      };
    });
  }, []);

  const updateAzureAd = useCallback((field: 'tenantId' | 'clientId' | 'audience', value: string) => {
    setFormData((prev) => ({
      ...prev,
      authenConfig: {
        ...prev.authenConfig,
        azureAd: { ...prev.authenConfig.azureAd, [field]: value },
      },
    }));
  }, []);

  const updateApiKey = useCallback((headerName: string) => {
    setFormData((prev) => ({
      ...prev,
      authenConfig: {
        ...prev.authenConfig,
        apiKey: { headerName },
      },
    }));
  }, []);

  // ── Cache Handlers ──────────────────────────────────────────────────────────

  const updateCache = useCallback((updates: Partial<CacheConfig>) => {
    setFormData((prev) => ({
      ...prev,
      cacheConfig: { ...prev.cacheConfig, ...updates },
    }));
  }, []);

  // ── Tools Handlers ──────────────────────────────────────────────────────────

  const addTool = useCallback(
    (tool: ToolConfig) => {
      setFormData((prev) => ({
        ...prev,
        tools: [...prev.tools, tool],
      }));
      messageApi.success('Tool added successfully');
    },
    [messageApi]
  );

  const removeTool = useCallback(
    (id: string) => {
      setFormData((prev) => ({
        ...prev,
        tools: prev.tools.filter((t) => t.id !== id),
      }));
      messageApi.info('Tool removed');
    },
    [messageApi]
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
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      {contextHolder}

      {/* Header */}
      <div className="mb-6">
        <Title level={3} className="!mb-1 !text-gray-800">
          Create MCP Server
        </Title>
        <Text type="secondary">Configure your Model Context Protocol server.</Text>
      </div>

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
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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
        onToggleMethod={toggleAuthMethod}
        onUpdateAzureAd={updateAzureAd}
        onUpdateApiKey={updateApiKey}
      />

      {/* Cache Config */}
      <CacheConfigComponent cache={formData.cacheConfig} onUpdate={updateCache} />

      {/* Submit */}
      <Divider className="!my-6" />
      <div className="flex justify-end gap-3">
        <Button>Cancel</Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
