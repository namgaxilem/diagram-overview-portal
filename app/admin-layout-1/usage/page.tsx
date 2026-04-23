'use client';

import React from 'react';
import { Card, Progress, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

export default function UsagePage() {
  return (
    <div>
      <Title level={2} style={{ marginBottom: '24px' }}>
        Usage
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="API Calls">
            <Text>Monthly Limit: 10,000</Text>
            <Progress percent={65} status="active" style={{ marginTop: '16px' }} />
            <Text type="secondary">6,500 / 10,000 used</Text>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Storage">
            <Text>Storage Limit: 100 GB</Text>
            <Progress percent={42} status="active" style={{ marginTop: '16px' }} />
            <Text type="secondary">42 GB / 100 GB used</Text>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Bandwidth">
            <Text>Monthly Limit: 500 GB</Text>
            <Progress percent={78} status="active" style={{ marginTop: '16px' }} />
            <Text type="secondary">390 GB / 500 GB used</Text>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Team Members">
            <Text>Team Limit: 20</Text>
            <Progress percent={50} status="active" style={{ marginTop: '16px' }} />
            <Text type="secondary">10 / 20 members</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
