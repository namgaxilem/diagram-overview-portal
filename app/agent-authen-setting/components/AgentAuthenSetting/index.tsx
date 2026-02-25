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
  onSettingsChange?: (settings: AuthenticationSettings) => void;
  readOnly?: boolean;
}

const AgentAuthenSetting: React.FC<AgentAuthenSettingProps> = ({
  initSettings,
  onSettingsChange,
  readOnly = false,
}) => {
  const [form] = Form.useForm();
  const [azureGroups, setAzureGroups] = useState<string[]>([]);
  const [azureADEnabled, setAzureADEnabled] = useState<boolean>(false);
  const [forgeRockClientId, setForgeRockClientId] = useState<string>('');
  const [forgeRockEnabled, setForgeRockEnabled] = useState<boolean>(false);

  // Initialize form values from initSettings
  useEffect(() => {
    const currentSettings = initSettings;
    if (currentSettings) {
      // Update Azure AD
      const azGroups = currentSettings.azureAD?.groups || [];
      const azEnabled = currentSettings.azureAD?.enabled || false;
      setAzureGroups(azGroups);
      setAzureADEnabled(azEnabled);
      form.setFieldsValue({
        azureGroups: azGroups.length > 0 ? azGroups : undefined,
        azureADEnabled: azEnabled,
      });

      // Update ForgeRock
      const frClientId = currentSettings.forgeRock?.clientId || '';
      const frEnabled = currentSettings.forgeRock?.enabled || false;
      setForgeRockClientId(frClientId);
      setForgeRockEnabled(frEnabled);
      form.setFieldsValue({
        forgeRockClientId: frClientId || undefined,
        forgeRockEnabled: frEnabled,
      });
    } else {
      // Clear everything if no settings
      setAzureGroups([]);
      setAzureADEnabled(false);
      setForgeRockClientId('');
      setForgeRockEnabled(false);
      form.resetFields();
    }
  }, [initSettings]);


  // Handle form value changes - both auth methods can be enabled independently
  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (readOnly) return;

    // Update state based on changed values
    if ('azureGroups' in changedValues) {
      setAzureGroups(allValues.azureGroups || []);
    }
    if ('azureADEnabled' in changedValues) {
      setAzureADEnabled(allValues.azureADEnabled || false);
    }
    if ('forgeRockClientId' in changedValues) {
      setForgeRockClientId(allValues.forgeRockClientId?.trim() || '');
    }
    if ('forgeRockEnabled' in changedValues) {
      setForgeRockEnabled(allValues.forgeRockEnabled || false);
    }

    // Build settings object with current values
    const currentAzureGroups = allValues.azureGroups || azureGroups;
    const currentAzureADEnabled = allValues.azureADEnabled ?? azureADEnabled;
    const currentForgeRockClientId = allValues.forgeRockClientId?.trim() || forgeRockClientId;
    const currentForgeRockEnabled = allValues.forgeRockEnabled ?? forgeRockEnabled;

    const newSettings: AuthenticationSettings = {};

    // Always include Azure AD if groups exist or enabled is set
    if (currentAzureGroups.length > 0 || currentAzureADEnabled) {
      newSettings.azureAD = {
        groups: currentAzureGroups,
        enabled: currentAzureADEnabled,
      };
    }

    // Always include ForgeRock if clientId exists or enabled is set
    if (currentForgeRockClientId || currentForgeRockEnabled) {
      newSettings.forgeRock = {
        clientId: currentForgeRockClientId,
        enabled: currentForgeRockEnabled,
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
      children: <AzureADTab azureGroups={azureGroups} enabled={azureADEnabled} readOnly={readOnly} />,
    },
    {
      key: 'forgeRock',
      label: 'ForgeRock',
      children: <ForgeRockTab forgeRockClientId={forgeRockClientId} enabled={forgeRockEnabled} readOnly={readOnly} />,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={4}>Authentication Settings</Title>
        <Text type="secondary">
          Configure authentication methods for your agent. You can enable both, one, or neither authentication method.
          The agent will enforce authentication based on these settings when running in FastAPI.
        </Text>
        {(azureADEnabled || forgeRockEnabled) && (
          <div style={{ marginTop: '12px' }}>
            <Text strong>Active Methods: </Text>
            {azureADEnabled && <Text code style={{ marginRight: '8px' }}>Azure AD Groups</Text>}
            {forgeRockEnabled && <Text code>ForgeRock OAuth</Text>}
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
            defaultActiveKey="azureAD"
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
