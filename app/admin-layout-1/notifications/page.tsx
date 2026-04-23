'use client';

import React from 'react';
import { Card, List, Switch, Typography } from 'antd';

const { Title, Text } = Typography;

const notificationSettings = [
  { id: 1, title: 'Email Notifications', description: 'Receive email updates about your account' },
  { id: 2, title: 'Push Notifications', description: 'Receive push notifications on your devices' },
  { id: 3, title: 'SMS Notifications', description: 'Receive SMS alerts for important updates' },
  { id: 4, title: 'Marketing Emails', description: 'Receive promotional and marketing content' },
];

export default function NotificationsPage() {
  return (
    <div style={{ maxWidth: '800px' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        Notifications
      </Title>

      <Card>
        <List
          itemLayout="horizontal"
          dataSource={notificationSettings}
          renderItem={(item) => (
            <List.Item
              actions={[<Switch key={item.id} defaultChecked={item.id <= 2} />]}
              style={{ padding: '16px 0' }}
            >
              <List.Item.Meta title={<Text strong>{item.title}</Text>} description={item.description} />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
