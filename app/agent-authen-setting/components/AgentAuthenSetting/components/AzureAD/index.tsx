import React from 'react';
import { Form, Select, Card, Space, Typography, Divider, Checkbox } from 'antd';

const { Title, Text } = Typography;

interface AzureADTabProps {
  azureGroups: string[];
  enabled: boolean;
  readOnly: boolean;
}

const AzureADTab: React.FC<AzureADTabProps> = ({
  azureGroups,
  enabled,
  readOnly,
}) => {
  return (
    <Card bordered={false}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={5}>Azure AD Group Configuration</Title>
          <Text type="secondary">
            Configure Azure AD groups that are authorized to access this agent.
          </Text>
        </div>

        <Form.Item
          name="azureADEnabled"
          valuePropName="checked"
        >
          <Checkbox disabled={readOnly}>
            <Text strong>Enable Azure AD Authentication</Text>
          </Checkbox>
        </Form.Item>

        <Form.Item
          label="Azure AD Groups"
          name="azureGroups"
          tooltip="Enter Azure AD group names or IDs that should have access to this agent"
          rules={[
            {
              type: 'array',
              message: 'Please enter at least one Azure AD group',
            },
          ]}
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Enter Azure AD group names or IDs"
            disabled={readOnly}
            tokenSeparators={[',', ';']}
            options={[]}
            notFoundContent={null}
          />
        </Form.Item>

        <div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <strong>Note:</strong> You can enter multiple groups by typing and pressing Enter.
            Separate multiple groups with commas or semicolons.
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default AzureADTab;
