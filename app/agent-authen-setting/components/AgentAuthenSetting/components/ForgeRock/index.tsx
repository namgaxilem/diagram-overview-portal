import React from 'react';
import { Form, Input, Card, Space, Typography, Checkbox } from 'antd';

const { Title, Text } = Typography;

interface ForgeRockTabProps {
  forgeRockClientId: string;
  enabled: boolean;
  readOnly: boolean;
}

const ForgeRockTab: React.FC<ForgeRockTabProps> = ({
  forgeRockClientId: _forgeRockClientId,
  enabled: _enabled,
  readOnly,
}) => {
  return (
    <Card bordered={false}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={5}>ForgeRock Configuration</Title>
          <Text type="secondary">Configure ForgeRock Client ID for OAuth authentication.</Text>
        </div>

        <Form.Item name="forgeRockEnabled" valuePropName="checked">
          <Checkbox disabled={readOnly}>
            <Text strong>Enable ForgeRock Authentication</Text>
          </Checkbox>
        </Form.Item>

        <Form.Item
          label="ForgeRock Client ID"
          name="forgeRockClientId"
          tooltip="Enter the ForgeRock Client ID for OAuth authentication"
          rules={[
            {
              type: 'string',
              message: 'Please enter a valid Client ID',
            },
          ]}
        >
          <Input placeholder="Enter ForgeRock Client ID" disabled={readOnly} allowClear />
        </Form.Item>

        <div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <strong>Note:</strong> The Client ID is used to authenticate requests to the agent via
            ForgeRock OAuth. Ensure this matches your ForgeRock configuration.
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default ForgeRockTab;
