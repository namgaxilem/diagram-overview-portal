import React from 'react';
import { Input, Typography } from 'antd';
import { LockOutlined, SafetyOutlined, KeyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { AuthConfig } from '../../types';
import SectionHeader from '../SectionHeader';

const { Text } = Typography;

interface AuthenConfigProps {
  auth: AuthConfig;
  onUpdate: (updates: Partial<AuthConfig>) => void;
  onToggleMethod: (method: 'azure-ad' | 'api-key') => void;
  onUpdateAzureAd: (field: 'tenantId' | 'clientId' | 'audience', value: string) => void;
  onUpdateApiKey: (headerName: string) => void;
}

export default function AuthenConfig({
  auth,
  onUpdate,
  onToggleMethod,
  onUpdateAzureAd,
  onUpdateApiKey,
}: AuthenConfigProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-3 overflow-hidden">
      <div className="p-4">
        <SectionHeader
          icon={<LockOutlined />}
          title="Authentication"
          subtitle="Secure access with Azure AD or API keys"
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
          <div className="px-4 pb-4 border-t border-gray-100 pt-4">
            {/* Auth Method Selection */}
            <div className="mb-4">
              <Text strong className="text-gray-600 text-xs uppercase tracking-wide block mb-3">
                Authentication Methods
              </Text>
              <div className="flex gap-3">
                <div
                  onClick={() => onToggleMethod('azure-ad')}
                  className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    auth.methods.includes('azure-ad')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <SafetyOutlined
                      className={auth.methods.includes('azure-ad') ? 'text-blue-500' : 'text-gray-400'}
                    />
                    <Text strong className={auth.methods.includes('azure-ad') ? 'text-blue-700' : ''}>
                      Azure AD
                    </Text>
                    {auth.methods.includes('azure-ad') && (
                      <CheckCircleOutlined className="text-blue-500 ml-auto" />
                    )}
                  </div>
                  <Text type="secondary" className="text-xs mt-1 block">
                    OAuth 2.0 bearer tokens
                  </Text>
                </div>
                <div
                  onClick={() => onToggleMethod('api-key')}
                  className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    auth.methods.includes('api-key')
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <KeyOutlined
                      className={auth.methods.includes('api-key') ? 'text-purple-500' : 'text-gray-400'}
                    />
                    <Text strong className={auth.methods.includes('api-key') ? 'text-purple-700' : ''}>
                      API Key
                    </Text>
                    {auth.methods.includes('api-key') && (
                      <CheckCircleOutlined className="text-purple-500 ml-auto" />
                    )}
                  </div>
                  <Text type="secondary" className="text-xs mt-1 block">
                    Custom HTTP header
                  </Text>
                </div>
              </div>
            </div>

            {/* Azure AD Config */}
            {auth.methods.includes('azure-ad') && (
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <SafetyOutlined className="text-blue-500" />
                  <Text strong className="text-blue-700 text-sm">
                    Azure AD Configuration
                  </Text>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Text className="text-xs text-gray-600 block mb-1">Tenant ID</Text>
                    <Input
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx"
                      value={auth.azureAd.tenantId}
                      onChange={(e) => onUpdateAzureAd('tenantId', e.target.value)}
                      size="small"
                    />
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600 block mb-1">Client ID</Text>
                    <Input
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx"
                      value={auth.azureAd.clientId}
                      onChange={(e) => onUpdateAzureAd('clientId', e.target.value)}
                      size="small"
                    />
                  </div>
                  <div>
                    <Text className="text-xs text-gray-600 block mb-1">Audience</Text>
                    <Input
                      placeholder="api://your-app-id"
                      value={auth.azureAd.audience}
                      onChange={(e) => onUpdateAzureAd('audience', e.target.value)}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* API Key Config */}
            {auth.methods.includes('api-key') && (
              <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <KeyOutlined className="text-purple-500" />
                  <Text strong className="text-purple-700 text-sm">
                    API Key Configuration
                  </Text>
                </div>
                <div>
                  <Text className="text-xs text-gray-600 block mb-1">Header Name</Text>
                  <Input
                    placeholder="x-mcp-api-key"
                    value={auth.apiKey.headerName}
                    onChange={(e) => onUpdateApiKey(e.target.value)}
                    size="small"
                    className="max-w-xs"
                    prefix={<Text type="secondary" className="text-xs">Header:</Text>}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
