'use client';

import React, { useMemo, useState } from 'react';
import { Card, Col, Row, Typography } from 'antd';

import MongoFilterBuilder from './_components/MongoFilterBuilder';
import type {
  FilterFieldDefinition,
  MongoFilter,
} from './_components/MongoFilterBuilder/types';
import { US_STATES } from './_components/us-states';

const { Title, Paragraph } = Typography;

const FIELDS: FilterFieldDefinition[] = [
  {
    name: 'doctor_address_state',
    label: 'State',
    type: 'select',
    options: US_STATES,
  },
  {
    name: 'doctor_gender',
    label: 'Gender',
    type: 'select',
    options: [
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' },
    ],
  },
  {
    name: 'location',
    label: 'Location Radius',
    type: 'geoRadius',
  },
];

export default function FilterBuilderPage() {
  const [filter, setFilter] = useState<MongoFilter>({
    doctor_address_state: 'TX',
    doctor_gender: 'Male',
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
          Visually compose a MongoDB filter object. Add fields, edit their values, and
          watch the resulting query update live. Filters combine with implicit AND.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Filters">
            <MongoFilterBuilder value={filter} onChange={setFilter} fields={FIELDS} />
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
