'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Form, Card, Tabs, Typography, Divider } from 'antd';
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
  const prevInitSettingsRef = useRef(initSettings);
  const [azureGroups, setAzureGroups] = useState<string[]>(initSettings?.azureAD?.groups || []);
  const [azureADEnabled, setAzureADEnabled] = useState<boolean>(
    initSettings?.azureAD?.enabled || false
  );
  const [forgeRockClientId, setForgeRockClientId] = useState<string>(
    initSettings?.forgeRock?.clientId || ''
  );
  const [forgeRockEnabled, setForgeRockEnabled] = useState<boolean>(
    initSettings?.forgeRock?.enabled || false
  );

  // Sync form values when initSettings changes
  useEffect(() => {
    if (initSettings !== prevInitSettingsRef.current) {
      prevInitSettingsRef.current = initSettings;
      const currentSettings = initSettings;
      if (currentSettings) {
        const azGroups = currentSettings.azureAD?.groups || [];
        const azEnabled = currentSettings.azureAD?.enabled || false;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: sync state from props
        setAzureGroups(azGroups);

        setAzureADEnabled(azEnabled);
        form.setFieldsValue({
          azureGroups: azGroups.length > 0 ? azGroups : undefined,
          azureADEnabled: azEnabled,
        });

        const frClientId = currentSettings.forgeRock?.clientId || '';
        const frEnabled = currentSettings.forgeRock?.enabled || false;

        setForgeRockClientId(frClientId);

        setForgeRockEnabled(frEnabled);
        form.setFieldsValue({
          forgeRockClientId: frClientId || undefined,
          forgeRockEnabled: frEnabled,
        });
      } else {
        setAzureGroups([]);

        setAzureADEnabled(false);

        setForgeRockClientId('');

        setForgeRockEnabled(false);
        form.resetFields();
      }
    }
  }, [initSettings, form]);

  // Handle form value changes - both auth methods can be enabled independently
  const handleValuesChange = (
    changedValues: Record<string, unknown>,
    allValues: Record<string, unknown>
  ) => {
    if (readOnly) {
      return;
    }

    // Update state based on changed values
    if ('azureGroups' in changedValues) {
      setAzureGroups((allValues.azureGroups as string[]) || []);
    }
    if ('azureADEnabled' in changedValues) {
      setAzureADEnabled((allValues.azureADEnabled as boolean) || false);
    }
    if ('forgeRockClientId' in changedValues) {
      const clientId = allValues.forgeRockClientId as string | undefined;
      setForgeRockClientId(clientId?.trim() || '');
    }
    if ('forgeRockEnabled' in changedValues) {
      setForgeRockEnabled((allValues.forgeRockEnabled as boolean) || false);
    }

    // Build settings object with current values
    const currentAzureGroups = (allValues.azureGroups as string[]) || azureGroups;
    const currentAzureADEnabled =
      (allValues.azureADEnabled as boolean | undefined) ?? azureADEnabled;
    const frClientIdValue = allValues.forgeRockClientId as string | undefined;
    const currentForgeRockClientId = frClientIdValue?.trim() || forgeRockClientId;
    const currentForgeRockEnabled =
      (allValues.forgeRockEnabled as boolean | undefined) ?? forgeRockEnabled;

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

  const items = [
    {
      key: 'azureAD',
      label: 'Azure AD',
      children: (
        <AzureADTab azureGroups={azureGroups} enabled={azureADEnabled} readOnly={readOnly} />
      ),
    },
    {
      key: 'forgeRock',
      label: 'ForgeRock',
      children: (
        <ForgeRockTab
          forgeRockClientId={forgeRockClientId}
          enabled={forgeRockEnabled}
          readOnly={readOnly}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={4}>Authentication Settings</Title>
        <Text type="secondary">
          Configure authentication methods for your agent. You can enable both, one, or neither
          authentication method. The agent will enforce authentication based on these settings when
          running in FastAPI.
        </Text>
        {(azureADEnabled || forgeRockEnabled) && (
          <div style={{ marginTop: '12px' }}>
            <Text strong>Active Methods: </Text>
            {azureADEnabled && (
              <Text code style={{ marginRight: '8px' }}>
                Azure AD Groups
              </Text>
            )}
            {forgeRockEnabled && <Text code>ForgeRock OAuth</Text>}
          </div>
        )}

        <Divider />

        <Form form={form} layout="vertical" onValuesChange={handleValuesChange} disabled={readOnly}>
          <Tabs defaultActiveKey="azureAD" items={items} type="card" />
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
