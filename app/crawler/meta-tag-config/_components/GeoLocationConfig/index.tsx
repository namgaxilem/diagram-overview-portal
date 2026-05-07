'use client';

import {
  AimOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200"
      style={{ height: 350 }}
    >
      <Spin tip="Loading map..." />
    </div>
  ),
});

export interface GeoFilterConfig {
  enabled: boolean;
  center: {
    lat: number;
    lng: number;
  };
  radius: {
    value: number;
    unit: 'km' | 'm' | 'mi';
  };
  metaTagMap: {
    lat: string;
    lng: string;
  };
}

export interface GeoLocationConfigProps {
  initValue?: GeoFilterConfig;
  value?: GeoFilterConfig;
  onChange?: (value: GeoFilterConfig) => void;
  onSave?: (value: GeoFilterConfig) => void;
  readOnly?: boolean;
}

export const DEFAULT_GEO_CONFIG: GeoFilterConfig = {
  enabled: false,
  center: { lat: 10.7769, lng: 106.7009 },
  radius: { value: 5, unit: 'mi' },
  metaTagMap: { lat: '', lng: '' },
};

export const GeoLocationConfigAlert = (
  <Alert
    description={
      <div className="space-y-2">
        <div>
          Configure a geographic filter to restrict crawling to locations within a specific area.
        </div>
        <div className="text-xs bg-white/50 p-2 rounded border border-blue-200">
          <div className="font-medium mb-1">How it works:</div>
          <div className="flex flex-wrap gap-2 items-center">
            <Tag color="blue">Set center point</Tag>
            <span>+</span>
            <Tag color="green">Define radius</Tag>
            <span>+</span>
            <Tag color="purple">Map meta tag keys → lat/lng</Tag>
            <span>→</span>
            <Tag color="orange">Filter pages by location</Tag>
          </div>
        </div>
      </div>
    }
    type="info"
    showIcon
    icon={<GlobalOutlined />}
  />
);

export default function GeoLocationConfig({
  initValue = DEFAULT_GEO_CONFIG,
  value,
  onChange,
  onSave,
  readOnly = false,
}: GeoLocationConfigProps) {
  const [config, setConfig] = useState<GeoFilterConfig>(value ?? initValue);

  useEffect(() => {
    if (value !== undefined) {
      setConfig(value);
    }
  }, [value]);

  const update = (patch: Partial<GeoFilterConfig>) => {
    const next = { ...config, ...patch };
    if (value === undefined) {
      setConfig(next);
    }
    onChange?.(next);
  };

  const handleCenterChange = (lat: number, lng: number) => {
    update({
      center: {
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
      },
    });
  };

  const handleSave = () => {
    onSave?.(config);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <Space align="center">
            <Title level={5} className="!mb-0">
              Geo Location Filter
            </Title>
            <Switch
              checked={config.enabled}
              onChange={(checked) => update({ enabled: checked })}
              disabled={readOnly}
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
            />
          </Space>
          {!readOnly && onSave && (
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              Save Configuration
            </Button>
          )}
        </div>

        <div className={!config.enabled ? 'opacity-50 pointer-events-none select-none' : ''}>
          <div className="mb-2">
            <Text className="text-sm text-gray-500">
              <AimOutlined className="mr-1" />
              Click on the map or drag the marker to set the center point. The blue circle
              represents the search radius.
            </Text>
          </div>

          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
            <MapPicker
              center={config.center}
              radius={config.radius}
              onCenterChange={handleCenterChange}
              readOnly={readOnly || !config.enabled}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Form.Item
              label={
                <span>
                  Center Latitude{' '}
                  <Tooltip title="Latitude of the center point (−90 to 90). Click the map to set it.">
                    <QuestionCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </span>
              }
              className="!mb-0"
            >
              <InputNumber
                className="w-full"
                value={config.center.lat}
                onChange={(val) =>
                  val !== null && update({ center: { ...config.center, lat: val } })
                }
                min={-90}
                max={90}
                step={0.0001}
                precision={6}
                disabled={readOnly}
                addonBefore={<Tag color="blue" className="!m-0">LAT</Tag>}
                placeholder="e.g. 10.7769"
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Center Longitude{' '}
                  <Tooltip title="Longitude of the center point (−180 to 180). Click the map to set it.">
                    <QuestionCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </span>
              }
              className="!mb-0"
            >
              <InputNumber
                className="w-full"
                value={config.center.lng}
                onChange={(val) =>
                  val !== null && update({ center: { ...config.center, lng: val } })
                }
                min={-180}
                max={180}
                step={0.0001}
                precision={6}
                disabled={readOnly}
                addonBefore={<Tag color="green" className="!m-0">LNG</Tag>}
                placeholder="e.g. 106.7009"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Form.Item
              label={
                <span>
                  Radius Value{' '}
                  <Tooltip title="Distance from the center point used as the search boundary.">
                    <QuestionCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </span>
              }
              className="!mb-0"
            >
              <InputNumber
                className="w-full"
                value={config.radius.value}
                onChange={(val) =>
                  val !== null && update({ radius: { ...config.radius, value: val } })
                }
                min={0}
                step={1}
                disabled={readOnly}
                placeholder="e.g. 5"
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Radius Unit{' '}
                  <Tooltip title="Unit of measurement for the radius.">
                    <QuestionCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </span>
              }
              className="!mb-0"
            >
              <Select
                className="w-full"
                value={config.radius.unit}
                onChange={(val) => update({ radius: { ...config.radius, unit: val } })}
                disabled={readOnly}
                options={[
                  { label: 'Kilometers (km)', value: 'km' },
                  { label: 'Meters (m)', value: 'm' },
                  { label: 'Miles (mi)', value: 'mi' },
                ]}
              />
            </Form.Item>
          </div>

          <Card
            size="small"
            title={
              <Space>
                <InfoCircleOutlined />
                <span>Meta Tag Coordinate Mapping</span>
                <Tooltip title="Map the meta tag attribute keys that carry coordinate data so the crawler knows which fields to read for latitude and longitude.">
                  <QuestionCircleOutlined className="text-gray-400" />
                </Tooltip>
              </Space>
            }
            className="bg-gray-50 border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={
                  <span>
                    Latitude Meta Tag Key{' '}
                    <Tooltip title="The meta tag name/key that holds the latitude value (e.g. geo.position, ICBM, or a custom key).">
                      <QuestionCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </span>
                }
                className="!mb-0"
              >
                <Input
                  value={config.metaTagMap.lat}
                  onChange={(e) =>
                    update({ metaTagMap: { ...config.metaTagMap, lat: e.target.value } })
                  }
                  disabled={readOnly}
                  placeholder="e.g. geo.position, ICBM, custom-lat"
                  addonBefore={<Tag color="blue" className="!m-0">LAT</Tag>}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Longitude Meta Tag Key{' '}
                    <Tooltip title="The meta tag name/key that holds the longitude value.">
                      <QuestionCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </span>
                }
                className="!mb-0"
              >
                <Input
                  value={config.metaTagMap.lng}
                  onChange={(e) =>
                    update({ metaTagMap: { ...config.metaTagMap, lng: e.target.value } })
                  }
                  disabled={readOnly}
                  placeholder="e.g. geo.position, ICBM, custom-lng"
                  addonBefore={<Tag color="green" className="!m-0">LNG</Tag>}
                />
              </Form.Item>
            </div>
          </Card>
        </div>

      </Card>
    </div>
  );
}
