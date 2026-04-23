'use client';

import React from 'react';
import { Card, Form, Input, Button, Avatar, Upload } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

export default function ProfilePage() {
  const [form] = Form.useForm();

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Profile</h1>

      <Card>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Avatar size={100} icon={<UserOutlined />} />
          <div style={{ marginTop: '16px' }}>
            <Upload>
              <Button icon={<UploadOutlined />}>Change Avatar</Button>
            </Upload>
          </div>
        </div>

        <Form form={form} layout="vertical" initialValues={{ name: 'John Doe', email: 'john@example.com' }}>
          <Form.Item label="Full Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Bio" name="bio">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">Save Changes</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
