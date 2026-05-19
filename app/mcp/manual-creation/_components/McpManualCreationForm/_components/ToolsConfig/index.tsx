import React, { useState, useCallback } from 'react';
import { Input, Select, Button, Typography, Badge, Empty, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, ToolOutlined } from '@ant-design/icons';
import type { ToolConfig } from '../../types';
import SectionHeader from '../SectionHeader';

const { Text } = Typography;
const { TextArea } = Input;

const TOOL_TYPES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'shell', label: 'Shell Script' },
  { value: 'api', label: 'API Call' },
];

interface ToolsConfigProps {
  tools: ToolConfig[];
  onAddTool: (tool: ToolConfig) => void;
  onRemoveTool: (id: string) => void;
}

export default function ToolsConfig({ tools, onAddTool, onRemoveTool }: ToolsConfigProps) {
  const [currentTool, setCurrentTool] = useState<Omit<ToolConfig, 'id'>>({
    name: '',
    type: 'python',
    description: '',
    code: '',
  });

  const handleAddTool = useCallback(() => {
    if (!currentTool.name.trim()) {
      return;
    }

    const newTool: ToolConfig = {
      ...currentTool,
      id: `tool-${Date.now()}`,
    };

    onAddTool(newTool);

    setCurrentTool({
      name: '',
      type: 'python',
      description: '',
      code: '',
    });
  }, [currentTool, onAddTool]);

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tool Builder */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Text strong className="text-gray-700 block mb-3">
              Add New Tool
            </Text>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Text className="text-xs text-gray-600 block mb-1">Tool Name <Text type="danger">*</Text></Text>
                  <Input
                    placeholder="e.g., test"
                    value={currentTool.name}
                    onChange={(e) => setCurrentTool((prev) => ({ ...prev, name: e.target.value }))}
                    size="small"
                  />
                </div>
                <div>
                  <Text className="text-xs text-gray-600 block mb-1">Type</Text>
                  <Select
                    value={currentTool.type}
                    onChange={(v) => setCurrentTool((prev) => ({ ...prev, type: v }))}
                    options={TOOL_TYPES}
                    className="w-full"
                    size="small"
                  />
                </div>
              </div>
              <div>
                <Text className="text-xs text-gray-600 block mb-1">Description</Text>
                <Input
                  placeholder="e.g., Custom Python function."
                  value={currentTool.description}
                  onChange={(e) => setCurrentTool((prev) => ({ ...prev, description: e.target.value }))}
                  size="small"
                />
              </div>
              <div>
                <Text className="text-xs text-gray-600 block mb-1">Code</Text>
                <TextArea
                  placeholder={'def test:\n    return "response ok"'}
                  value={currentTool.code}
                  onChange={(e) => setCurrentTool((prev) => ({ ...prev, code: e.target.value }))}
                  rows={4}
                  size="small"
                  className="font-mono text-xs"
                />
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddTool}
                block
                size="small"
                disabled={!currentTool.name.trim()}
              >
                Add Tool
              </Button>
            </div>
          </div>

          {/* Configured Tools List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Text strong className="text-gray-700">
                Configured Tools
              </Text>
              <Badge count={tools.length} showZero />
            </div>
            {tools.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<Text type="secondary" className="text-sm">No tools added yet</Text>}
                className="py-8"
              />
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {tools.map((tool, i) => (
                  <div
                    key={tool.id}
                    className="p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                          {i + 1}
                        </span>
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
                    <div className="ml-7 flex flex-wrap gap-1">
                      <Tag color="blue" className="!text-xs">
                        {TOOL_TYPES.find((t) => t.value === tool.type)?.label || tool.type}
                      </Tag>
                      {tool.description && <Tag className="!text-xs">{tool.description}</Tag>}
                    </div>
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
