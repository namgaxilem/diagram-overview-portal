'use client';

import React, { useState, useEffect } from 'react';
import { Form, Card, Tabs, Space, Typography, Divider } from 'antd';
import type { TabsProps } from 'antd';
import AzureADTab from './components/AzureAD';
import ForgeRockTab from './components/ForgeRock';

const { Title, Text } = Typography;

export interface AuthenticationSettings {
  azureAD?: {
    groups: string[];
    enabled: boolean;
  };
  forgeRock?: {
    clientId: string;
    enabled: boolean;
  };
}

export interface AgentAuthenSettingProps {
  initSettings?: AuthenticationSettings;
  settings?: AuthenticationSettings;
  onSettingsChange?: (settings: AuthenticationSettings) => void;
  readOnly?: boolean;
}

const AgentAuthenSetting: React.FC<AgentAuthenSettingProps> = ({
  initSettings,
  settings,
  onSettingsChange,
  readOnly = false,
}) => {
  const [form] = Form.useForm();
  const [authMethod, setAuthMethod] = useState<'azureAD' | 'forgeRock' | null>(null);
  const [azureGroups, setAzureGroups] = useState<string[]>([]);
  const [forgeRockClientId, setForgeRockClientId] = useState<string>('');

  // Initialize form values from initSettings or settings
  useEffect(() => {
    const currentSettings = settings || initSettings;
    if (currentSettings) {
      if (currentSettings.azureAD?.groups) {
        setAzureGroups(currentSettings.azureAD.groups);
        form.setFieldsValue({
          azureGroups: currentSettings.azureAD.groups,
        });
        if (currentSettings.azureAD.enabled) {
          setAuthMethod('azureAD');
        }
      }
      if (currentSettings.forgeRock?.clientId) {
        setForgeRockClientId(currentSettings.forgeRock.clientId);
        form.setFieldsValue({
          forgeRockClientId: currentSettings.forgeRock.clientId,
        });
        if (currentSettings.forgeRock.enabled) {
          setAuthMethod('forgeRock');
        }
      }
    }
  }, [initSettings, settings, form]);

  // Handle tab change - update enabled flags when switching tabs
  const handleTabChange = (activeKey: string) => {
    if (readOnly) return;

    const newAuthMethod = activeKey as 'azureAD' | 'forgeRock';
    setAuthMethod(newAuthMethod);

    // Build settings object with updated enabled flags
    const newSettings: AuthenticationSettings = {};

    if (azureGroups.length > 0) {
      newSettings.azureAD = {
        groups: azureGroups,
        enabled: newAuthMethod === 'azureAD',
      };
    }

    if (forgeRockClientId) {
      newSettings.forgeRock = {
        clientId: forgeRockClientId,
        enabled: newAuthMethod === 'forgeRock',
      };
    }

    // Notify parent component
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  // Handle form value changes - only one auth method at a time
  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (readOnly) return;

    const newSettings: AuthenticationSettings = {};
    let newAuthMethod = authMethod;

    // Check which field changed
    if ('azureGroups' in changedValues) {
      if (allValues.azureGroups && allValues.azureGroups.length > 0) {
        // Switch to Azure AD
        newAuthMethod = 'azureAD';
        setAuthMethod('azureAD');
        setAzureGroups(allValues.azureGroups);
      } else {
        // Cleared Azure AD groups
        setAzureGroups([]);
        if (authMethod === 'azureAD') {
          newAuthMethod = forgeRockClientId ? 'forgeRock' : null;
          setAuthMethod(newAuthMethod);
        }
      }
    }

    if ('forgeRockClientId' in changedValues) {
      if (allValues.forgeRockClientId && allValues.forgeRockClientId.trim() !== '') {
        // Switch to ForgeRock
        newAuthMethod = 'forgeRock';
        setAuthMethod('forgeRock');
        setForgeRockClientId(allValues.forgeRockClientId.trim());
      } else {
        // Cleared ForgeRock client ID
        setForgeRockClientId('');
        if (authMethod === 'forgeRock') {
          newAuthMethod = azureGroups.length > 0 ? 'azureAD' : null;
          setAuthMethod(newAuthMethod);
        }
      }
    }

    // Build settings object with both values and enabled flags
    const currentAzureGroups = 'azureGroups' in changedValues ? allValues.azureGroups || [] : azureGroups;
    const currentForgeRockClientId = 'forgeRockClientId' in changedValues ? (allValues.forgeRockClientId?.trim() || '') : forgeRockClientId;

    if (currentAzureGroups.length > 0) {
      newSettings.azureAD = {
        groups: currentAzureGroups,
        enabled: newAuthMethod === 'azureAD',
      };
    }

    if (currentForgeRockClientId) {
      newSettings.forgeRock = {
        clientId: currentForgeRockClientId,
        enabled: newAuthMethod === 'forgeRock',
      };
    }

    // Notify parent component
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };


  const items: TabsProps['items'] = [
    {
      key: 'azureAD',
      label: 'Azure AD',
      children: <AzureADTab azureGroups={azureGroups} authMethod={authMethod} readOnly={readOnly} />,
    },
    {
      key: 'forgeRock',
      label: 'ForgeRock',
      children: <ForgeRockTab forgeRockClientId={forgeRockClientId} authMethod={authMethod} readOnly={readOnly} />,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={4}>Authentication Settings</Title>
        <Text type="secondary">
          Configure authentication method for your agent. Only one authentication method can be active at a time.
          The agent will enforce authentication based on these settings when running in FastAPI.
        </Text>
        {authMethod && (
          <div style={{ marginTop: '12px' }}>
            <Text strong>
              Active Method: <Text code>{authMethod === 'azureAD' ? 'Azure AD Groups' : 'ForgeRock OAuth'}</Text>
            </Text>
          </div>
        )}

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
          disabled={readOnly}
        >
          <Tabs
            activeKey={authMethod || 'azureAD'}
            onChange={handleTabChange}
            items={items}
            type="card"
          />
        </Form>

        {readOnly && (
          <div style={{ marginTop: '16px' }}>
            <Text type="warning">
              <strong>Read-Only Mode:</strong> Authentication settings cannot be modified.
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AgentAuthenSetting;
