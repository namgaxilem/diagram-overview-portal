'use client';

import { useMemo, useState } from 'react';
import { Card, Col, Row, Typography } from 'antd';

import MongoFilterBuilder from './_components/MongoFilterBuilder';
import type { MongoFilter } from './_components/MongoFilterBuilder/types';

const { Title, Paragraph } = Typography;

export default function FilterBuilderPage() {
  const [filter, setFilter] = useState<MongoFilter>({
    location: {
      $geoWithin: {
        $centerSphere: [[-106.345542, 31.75726], 0.015],
      },
    },
  });

  const json = useMemo(() => JSON.stringify(filter, null, 2), [filter]);

  return (
    <div>
      <div className="mb-6">
        <Title level={2}>MongoDB Filter Builder</Title>
        <Paragraph className="text-gray-600">
          Visually compose the location radius of a MongoDB filter. Set the center point and radius,
          and watch the resulting query update live.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Location Radius">
            <MongoFilterBuilder value={filter} onChange={setFilter} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="MongoDB Query Output">
            <pre className="m-0 p-3 bg-gray-900 text-green-400 rounded-lg text-xs overflow-auto leading-relaxed">
              {json}
            </pre>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
