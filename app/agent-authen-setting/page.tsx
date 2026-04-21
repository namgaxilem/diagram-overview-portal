'use client';

import React, { useState } from 'react';
import { Button, Space, Typography, Card, Divider, Switch } from 'antd';
import type { AuthenticationSettings } from './components/AgentAuthenSetting';
import AgentAuthenSetting from './components/AgentAuthenSetting';

const { Title, Text } = Typography;

export default function Page() {
  const [settings, setSettings] = useState<AuthenticationSettings>({
    forgeRock: { clientId: '123', enabled: true },
  });
  const [readOnly, setReadOnly] = useState(false);

  const handleSettingsChange = (newSettings: AuthenticationSettings) => {
    // eslint-disable-next-line no-console
    console.log('Settings changed:', newSettings);
    setSettings(newSettings);
  };

  const handleSetAzureAD = () => {
    setSettings({
      azureAD: {
        groups: ['Engineering-Team', 'Admin-Group'],
        enabled: true,
      },
    });
  };

  const handleSetForgeRock = () => {
    setSettings({
      forgeRock: {
        clientId: 'sample-client-id-12345',
        enabled: true,
      },
    });
  };

  const handleSetBoth = () => {
    setSettings({
      azureAD: {
        groups: ['Engineering-Team', 'Admin-Group'],
        enabled: true,
      },
      forgeRock: {
        clientId: 'sample-client-id-12345',
        enabled: true,
      },
    });
  };

  const handleClear = () => {
    setSettings({});
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Card style={{ marginBottom: '24px' }}>
          <Title level={2}>Agent Authentication Setting - Test Page</Title>
          <Text type="secondary">
            This page demonstrates the AgentAuthenSetting component with Azure AD and ForgeRock
            authentication configuration. You can enable both methods, one method, or neither. Both
            values are persisted with independent enabled flags.
          </Text>

          <Divider />

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>Controls:</Text>
              <div style={{ marginTop: '12px' }}>
                <Space wrap>
                  <Button type="primary" onClick={handleSetAzureAD}>
                    Enable Azure AD Only
                  </Button>
                  <Button onClick={handleSetForgeRock}>Enable ForgeRock Only</Button>
                  <Button type="default" onClick={handleSetBoth}>
                    Enable Both
                  </Button>
                  <Button danger onClick={handleClear}>
                    Clear All
                  </Button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Switch checked={readOnly} onChange={setReadOnly} />
                    <Text>Read-Only Mode</Text>
                  </div>
                </Space>
              </div>
            </div>

            <div>
              <Text strong>Current Settings (JSON):</Text>
              <pre
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '4px',
                  marginTop: '8px',
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(settings, null, 2)}
              </pre>
            </div>
          </Space>
        </Card>

        <AgentAuthenSetting
          initSettings={settings}
          onSettingsChange={handleSettingsChange}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}
