import React, { useState } from 'react';
import { Input, Typography, Switch, Tag, Button } from 'antd';
import { LockOutlined, SafetyOutlined, KeyOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import type { AuthConfig } from '../../types';
import SectionHeader from '../SectionHeader';

const { Text } = Typography;

interface AuthenConfigProps {
  auth: AuthConfig;
  onUpdate: (updates: Partial<AuthConfig>) => void;
  onUpdateAzureAD: (updates: Partial<AuthConfig['azureAD']>) => void;
  onUpdateAccessKey: (updates: Partial<AuthConfig['accessKey']>) => void;
}

export default function AuthenConfig({
  auth,
  onUpdate,
  onUpdateAzureAD,
  onUpdateAccessKey,
}: AuthenConfigProps) {
  const [newGroup, setNewGroup] = useState('');

  const handleAddGroup = () => {
    if (newGroup.trim() && !auth.azureAD.groups.includes(newGroup.trim())) {
      onUpdateAzureAD({ groups: [...auth.azureAD.groups, newGroup.trim()] });
      setNewGroup('');
    }
  };

  const handleRemoveGroup = (group: string) => {
    onUpdateAzureAD({ groups: auth.azureAD.groups.filter((g) => g !== group) });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-3 overflow-hidden">
      <div className="p-4">
        <SectionHeader
          icon={<LockOutlined />}
          title="Authentication"
          subtitle="Secure access with Azure AD or Access Key"
          enabled={auth.enabled}
          onToggle={(checked) => onUpdate({ enabled: checked })}
        />
      </div>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          auth.enabled ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
            {/* Azure AD Config */}
            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <SafetyOutlined className="text-blue-500" />
                  <Text strong className="text-blue-700 text-sm">
                    Azure AD
                  </Text>
                </div>
                <Switch
                  size="small"
                  checked={auth.azureAD.enabled}
                  onChange={(checked) => onUpdateAzureAD({ enabled: checked })}
                />
              </div>
              {auth.azureAD.enabled && (
                <div>
                  <Text className="text-xs text-gray-600 block mb-2">
                    AD Group IDs (optional - leave empty to allow any authenticated user)
                  </Text>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {auth.azureAD.groups.map((group) => (
                      <Tag
                        key={group}
                        closable
                        onClose={() => handleRemoveGroup(group)}
                        className="!flex items-center gap-1"
                      >
                        {group}
                      </Tag>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter AD Group ID"
                      value={newGroup}
                      onChange={(e) => setNewGroup(e.target.value)}
                      onPressEnter={handleAddGroup}
                      size="small"
                      className="max-w-xs"
                    />
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={handleAddGroup}
                      disabled={!newGroup.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Access Key Config */}
            <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <KeyOutlined className="text-purple-500" />
                  <Text strong className="text-purple-700 text-sm">
                    Access Key
                  </Text>
                </div>
                <Switch
                  size="small"
                  checked={auth.accessKey.enabled}
                  onChange={(checked) => onUpdateAccessKey({ enabled: checked })}
                />
              </div>
              {auth.accessKey.enabled && (
                <div className="space-y-3">
                  <div>
                    <Text className="text-xs text-gray-600 block mb-1">Header Name</Text>
                    <Input
                      placeholder="x-mcp-api-key"
                      value={auth.accessKey.headerName}
                      onChange={(e) => onUpdateAccessKey({ headerName: e.target.value })}
                      size="small"
                      className="max-w-xs"
                    />
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600 block mb-1">Access Key Value</Text>
                    <Input.Password
                      placeholder="Enter access key value"
                      value={auth.accessKey.accessKeyValue}
                      onChange={(e) => onUpdateAccessKey({ accessKeyValue: e.target.value })}
                      size="small"
                      className="max-w-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
