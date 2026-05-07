'use client';

import { useEffect, useState } from 'react';
import { message, Spin, Typography } from 'antd';

import {
  DEFAULT_GEO_CONFIG,
  GeoFilterConfig,
  GeoLocationConfig,
  GeoLocationConfigAlert,
} from '../meta-tag-config/_components';

const { Title, Paragraph } = Typography;

const LOCAL_STORAGE_KEY = 'crawler-geo-location-config';

export default function GeoLocationConfigPage() {
  const [geoConfig, setGeoConfig] = useState<GeoFilterConfig>(DEFAULT_GEO_CONFIG);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setGeoConfig(parsed);
      } catch {
        setGeoConfig(DEFAULT_GEO_CONFIG);
      }
    } else {
      setGeoConfig(DEFAULT_GEO_CONFIG);
    }
    setLoading(false);
  }, []);

  const handleChange = (newValue: GeoFilterConfig) => {
    setGeoConfig(newValue);
  };

  const handleSave = (value: GeoFilterConfig) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
    messageApi.success('Geo location configuration saved successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {contextHolder}
      <div className="mb-6">
        <Title level={2}>Geo Location Configuration</Title>
        <Paragraph className="text-gray-600">
          Configure a geographic boundary to filter crawled pages by location. Set a center point
          and radius, then map the meta tag keys that carry coordinate data.
        </Paragraph>
      </div>

      <div className="mb-4">{GeoLocationConfigAlert}</div>

      <GeoLocationConfig
        value={geoConfig}
        onChange={handleChange}
        onSave={handleSave}
      />

      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 select-none">
          Preview JSON output
        </summary>
        <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded-lg text-xs overflow-auto leading-relaxed">
          {JSON.stringify(geoConfig, null, 2)}
        </pre>
      </details>
    </div>
  );
}
