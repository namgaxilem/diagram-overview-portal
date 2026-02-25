import React from 'react';
import { Form, Input, Card, Space, Typography, Divider } from 'antd';

const { Title, Text } = Typography;

interface ForgeRockTabProps {
    forgeRockClientId: string;
    authMethod: 'azureAD' | 'forgeRock' | null;
    readOnly: boolean;
}

const ForgeRockTab: React.FC<ForgeRockTabProps> = ({
    forgeRockClientId,
    authMethod,
    readOnly,
}) => {
    return (
        <Card bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                    <Title level={5}>ForgeRock Configuration</Title>
                    <Text type="secondary">
                        Configure ForgeRock Client ID for OAuth authentication.
                    </Text>
                    {authMethod === 'azureAD' && (
                        <div style={{ marginTop: '8px' }}>
                            <Text type="warning">
                                <strong>Note:</strong> Entering a ForgeRock Client ID will disable Azure AD authentication.
                            </Text>
                        </div>
                    )}
                </div>

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
                    <Input
                        placeholder="Enter ForgeRock Client ID"
                        disabled={readOnly}
                        allowClear
                    />
                </Form.Item>

                <div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <strong>Note:</strong> The Client ID is used to authenticate requests to the agent
                        via ForgeRock OAuth. Ensure this matches your ForgeRock configuration.
                    </Text>
                </div>

                {forgeRockClientId && (
                    <div>
                        <Divider />
                        <Text strong>Current ForgeRock Client ID:</Text>
                        <div style={{ marginTop: '8px' }}>
                            <Text code>{forgeRockClientId}</Text>
                        </div>
                    </div>
                )}
            </Space>
        </Card>
    );
};

export default ForgeRockTab;
