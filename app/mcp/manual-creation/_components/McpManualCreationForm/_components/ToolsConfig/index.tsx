import React, { useState, useCallback, useEffect } from 'react';
import { Input, Select, Button, Typography, Badge, Empty, Tag, Checkbox } from 'antd';
import { PlusOutlined, DeleteOutlined, ToolOutlined, SettingOutlined, CopyOutlined } from '@ant-design/icons';
import type { ToolConfig, AzureToolConfig, PythonToolConfig } from '../../types';
import SectionHeader from '../SectionHeader';

const { Text } = Typography;
const { TextArea } = Input;

const SERVICE_TYPES = [
  { value: 'azure', label: 'Azure AI Search' },
  { value: 'python', label: 'Python Function' },
];

const AZURE_PARAMS = ['query', 'skip', 'top', 'facets', 'filter', 'count'];

interface ToolsConfigProps {
  tools: ToolConfig[];
  onAddTool: (tool: ToolConfig) => void;
  onRemoveTool: (id: string) => void;
}

interface AzureFormState {
  indexName: string;
  toolName: string;
  description: string;
  params: string[];
}

interface PythonFormState {
  code: string;
}

export default function ToolsConfig({ tools, onAddTool, onRemoveTool }: ToolsConfigProps) {
  const [serviceType, setServiceType] = useState<'azure' | 'python'>('azure');
  
  const [azureForm, setAzureForm] = useState<AzureFormState>({
    indexName: '',
    toolName: '',
    description: '',
    params: ['query'],
  });

  const [pythonForm, setPythonForm] = useState<PythonFormState>({
    code: '',
  });

  const extractFunctionName = (code: string): string => {
    const match = code.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
    return match ? match[1] : '';
  };

  const extractDocstring = (code: string): string => {
    // Match docstring after function definition (with or without parentheses)
    // Supports both """ and ''' style docstrings, including multiline
    // [\s\S]*? after colon handles newlines before docstring
    const match = code.match(/def\s+[a-zA-Z_][a-zA-Z0-9_]*[^:]*:[\s\S]*?(?:"""([\s\S]*?)"""|'''([\s\S]*?)''')/);
    return match ? (match[1] || match[2] || '').trim() : '';
  };

  const handleAddTool = useCallback(() => {
    if (serviceType === 'azure') {
      if (!azureForm.toolName.trim() || !azureForm.indexName.trim()) {
        return;
      }
      const newTool: AzureToolConfig = {
        id: `tool-${Date.now()}`,
        name: azureForm.toolName,
        type: 'azure',
        indexName: azureForm.indexName,
        description: azureForm.description,
        params: azureForm.params,
      };
      onAddTool(newTool);
      setAzureForm({
        indexName: '',
        toolName: '',
        description: '',
        params: ['query'],
      });
    } else {
      const functionName = extractFunctionName(pythonForm.code);
      if (!functionName || !pythonForm.code.trim()) {
        return;
      }
      const description = extractDocstring(pythonForm.code) || 'Custom Python function.';
      const newTool: PythonToolConfig = {
        id: `tool-${Date.now()}`,
        name: functionName,
        type: 'python',
        description,
        code: pythonForm.code,
      };
      onAddTool(newTool);
      setPythonForm({ code: '' });
    }
  }, [serviceType, azureForm, pythonForm, onAddTool]);

  const handleParamChange = (param: string, checked: boolean) => {
    setAzureForm((prev) => ({
      ...prev,
      params: checked
        ? [...prev.params, param]
        : prev.params.filter((p) => p !== param),
    }));
  };

  const isAddDisabled = serviceType === 'azure'
    ? !azureForm.toolName.trim() || !azureForm.indexName.trim()
    : !extractFunctionName(pythonForm.code);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-3 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <SectionHeader
          icon={<ToolOutlined />}
          title="Tools"
          subtitle={`${tools.length} tool${tools.length !== 1 ? 's' : ''} configured`}
        />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tool Builder */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-4">
                {/* Service Type Selector */}
                <div>
                  <Text className="text-xs text-gray-500 uppercase tracking-wide block mb-2">
                    Service Type
                  </Text>
                  <Select
                    value={serviceType}
                    onChange={(v) => setServiceType(v)}
                    options={SERVICE_TYPES}
                    className="w-full"
                    suffixIcon={<SettingOutlined />}
                  />
                </div>

                {serviceType === 'azure' ? (
                  <>
                    {/* Azure AI Search Form */}
                    <div>
                      <Text className="text-sm text-gray-700 block mb-1">Index Name</Text>
                      <Input
                        placeholder="e.g., product-catalog"
                        value={azureForm.indexName}
                        onChange={(e) => setAzureForm((prev) => ({ ...prev, indexName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Text className="text-sm text-gray-700 block mb-1">Tool Name</Text>
                      <Input
                        placeholder="e.g., search_products"
                        value={azureForm.toolName}
                        onChange={(e) => setAzureForm((prev) => ({ ...prev, toolName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Text className="text-sm text-gray-700 block mb-1">
                        Description <Text type="secondary">(Optional)</Text>
                      </Text>
                      <TextArea
                        placeholder="Describe what this tool does..."
                        value={azureForm.description}
                        onChange={(e) => setAzureForm((prev) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <Text className="text-xs text-gray-500 uppercase tracking-wide block mb-2">
                        Optional Parameters
                      </Text>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {AZURE_PARAMS.map((param) => (
                          <Checkbox
                            key={param}
                            checked={azureForm.params.includes(param)}
                            onChange={(e) => handleParamChange(param, e.target.checked)}
                            disabled={param === 'query'}
                          >
                            {param}
                          </Checkbox>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Python Function Form */}
                    <div>
                      <Text className="text-sm text-gray-700 block mb-1">Python Function Code</Text>
                      <div className="relative">
                        <TextArea
                          placeholder={'def write_log_1:\n    return "testing logs"'}
                          value={pythonForm.code}
                          onChange={(e) => setPythonForm({ code: e.target.value })}
                          rows={8}
                          className="font-mono !text-sm !bg-gray-900 !text-green-400 !border-gray-700"
                          style={{ 
                            backgroundColor: '#1a1a2e',
                            color: '#4ade80',
                            fontFamily: 'monospace',
                          }}
                        />
                        <Text className="absolute top-2 right-3 text-xs text-gray-400">
                          Python 3.9
                        </Text>
                      </div>
                      <Text type="secondary" className="text-xs mt-2 block">
                        Define a function. The function name and docstring will be used as the tool name and description.
                      </Text>
                    </div>
                  </>
                )}

                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddTool}
                  block
                  disabled={isAddDisabled}
                >
                  Add Tool to Server
                </Button>
              </div>
          </div>

          {/* Configured Tools List */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Text strong className="text-gray-700">
                Configured Tools
              </Text>
              <Tag color="default" className="!rounded-full !px-3">
                {tools.length} Ready
              </Tag>
            </div>
            {tools.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<Text type="secondary" className="text-sm">No tools added yet</Text>}
                className="py-8"
              />
            ) : (
              <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Tag 
                          color={tool.type === 'azure' ? 'blue' : 'purple'} 
                          className="!text-xs !font-medium !uppercase !rounded"
                        >
                          {tool.type === 'azure' ? 'AZURE' : 'PYTHON'}
                        </Tag>
                        <Text strong className="text-sm">
                          {tool.name}
                        </Text>
                      </div>
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onRemoveTool(tool.id)}
                      />
                    </div>
                    
                    {tool.type === 'azure' ? (
                      <>
                        {tool.description && (
                          <Text className="text-sm text-gray-600 block mb-2">
                            {tool.description}
                          </Text>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <Text className="text-xs text-gray-400 uppercase">Index</Text>
                          <Text className="text-sm">{tool.indexName}</Text>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {tool.params.map((param) => (
                            <Tag key={param} color="green" className="!text-xs !rounded">
                              {param}
                            </Tag>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-gray-50 rounded p-2 mt-2 relative">
                          <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap m-0">
                            {tool.code.length > 100 ? `${tool.code.substring(0, 100)}...` : tool.code}
                          </pre>
                          <Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => handleCopyCode(tool.code)}
                            className="absolute top-1 right-1 !text-gray-400 hover:!text-gray-600"
                          >
                            Copy
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
