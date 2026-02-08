'use client';

import { CopyOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, message, Space, Switch, Typography } from 'antd';
import { useState } from 'react';
import AgentPolicyConfigBuilder, {
  type PolicyConfig,
} from './components/AgentPolicyConfigBuilder';
import initialData from './components/AgentPolicyConfigBuilder/data.json';

const { Title, Text } = Typography;

const initialPolicyConfig = initialData.policy_config as PolicyConfig;

export default function AgentPolicyConfigBuilderPage() {
  const [policyConfig, setPolicyConfig] =
    useState<PolicyConfig>(initialPolicyConfig);
  const [readOnly, setReadOnly] = useState(false);
  const [configOutput, setConfigOutput] = useState('');

  const handleGetConfig = () => {
    if (!policyConfig) {
      message.warning('No policy config defined yet.');
      setConfigOutput('');
      return;
    }
    setConfigOutput(JSON.stringify(policyConfig, null, 2));
    message.success('Policy config retrieved successfully');
  };

  const handleCopyConfig = () => {
    if (configOutput) {
      navigator.clipboard.writeText(configOutput);
      message.success('Policy config copied to clipboard');
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          Agent Policy Config Builder
        </Title>
        <Text type="secondary">
          Configure the safety policy for an AI agent, including safety
          instructions, blocked words, PII patterns, and content generation
          safety settings.
        </Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Space>
          <Text>Read Only:</Text>
          <Switch checked={readOnly} onChange={setReadOnly} />
        </Space>
      </div>

      <AgentPolicyConfigBuilder
        initialPolicyConfig={initialPolicyConfig}
        onChangePolicyConfig={setPolicyConfig}
        readOnly={readOnly}
      />

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={handleGetConfig}
        >
          Get Policy Config
        </Button>
        {configOutput && (
          <Button icon={<CopyOutlined />} onClick={handleCopyConfig}>
            Copy Config
          </Button>
        )}
      </div>

      {configOutput && (
        <Card
          title="Retrieved Policy Config Output"
          style={{ marginTop: 16 }}
          size="small"
        >
          <pre
            style={{
              background: '#f6f8fa',
              border: '1px solid #d0d7de',
              borderRadius: 8,
              padding: 16,
              fontSize: 13,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              lineHeight: 1.5,
              overflow: 'auto',
              maxHeight: 400,
              margin: 0,
            }}
          >
            {configOutput}
          </pre>
        </Card>
      )}
    </div>
  );
}
