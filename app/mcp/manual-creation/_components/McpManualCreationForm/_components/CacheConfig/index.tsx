import React from 'react';
import { Input, Button, Typography, Space, Tooltip } from 'antd';
import {
  DatabaseOutlined,
  CloudServerOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { CacheConfig as CacheConfigType } from '../../types';
import SectionHeader from '../SectionHeader';

const { Text } = Typography;

const STORAGE_OPTIONS = [
  {
    key: 'memory',
    label: 'In-Memory',
    description: 'Fastest, volatile',
    icon: <ThunderboltOutlined />,
  },
  {
    key: 'disk',
    label: 'Local Disk',
    description: 'Persistent, slower',
    icon: <DatabaseOutlined />,
  },
  {
    key: 'redis',
    label: 'Redis',
    description: 'Distributed, scalable',
    icon: <CloudServerOutlined />,
  },
];

const TTL_PRESETS = [
  { label: '5m', value: 300 },
  { label: '1h', value: 3600 },
  { label: '24h', value: 86400 },
];

const SIZE_PRESETS = [
  { label: '1M', value: 1 },
  { label: '5M', value: 5 },
  { label: '10M', value: 10 },
];

interface CacheConfigProps {
  cache: CacheConfigType;
  onUpdate: (updates: Partial<CacheConfigType>) => void;
}

export default function CacheConfig({ cache, onUpdate }: CacheConfigProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-3 overflow-hidden">
      <div className="p-4">
        <SectionHeader
          icon={<DatabaseOutlined />}
          title="Cache Configuration"
          subtitle="Optimize performance with caching"
          enabled={cache.enabled}
          onToggle={(checked) => onUpdate({ enabled: checked })}
        />
      </div>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          cache.enabled ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* TTL */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Text className="text-xs text-gray-600">Expiration (TTL)</Text>
                  <Tooltip title="Time-to-live for cached items">
                    <InfoCircleOutlined className="text-gray-400 text-xs" />
                  </Tooltip>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={cache.ttl}
                    onChange={(e) => onUpdate({ ttl: parseInt(e.target.value) || 0 })}
                    suffix="sec"
                    size="small"
                    className="flex-1"
                  />
                  <Space.Compact size="small">
                    {TTL_PRESETS.map((p) => (
                      <Button
                        key={p.value}
                        type={cache.ttl === p.value ? 'primary' : 'default'}
                        onClick={() => onUpdate({ ttl: p.value })}
                        size="small"
                      >
                        {p.label}
                      </Button>
                    ))}
                  </Space.Compact>
                </div>
              </div>
              {/* Max Size */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Text className="text-xs text-gray-600">Max Item Size</Text>
                  <Tooltip title="Maximum size per cached item">
                    <InfoCircleOutlined className="text-gray-400 text-xs" />
                  </Tooltip>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={cache.size}
                    onChange={(e) => onUpdate({ size: parseInt(e.target.value) || 1 })}
                    suffix="MB"
                    size="small"
                    className="flex-1"
                  />
                  <Space.Compact size="small">
                    {SIZE_PRESETS.map((p) => (
                      <Button
                        key={p.value}
                        type={cache.size === p.value ? 'primary' : 'default'}
                        onClick={() => onUpdate({ size: p.value })}
                        size="small"
                      >
                        {p.label}
                      </Button>
                    ))}
                  </Space.Compact>
                </div>
              </div>
            </div>
            {/* Storage */}
            <div>
              <Text className="text-xs text-gray-600 block mb-2">Storage Location</Text>
              <div className="flex gap-3">
                {STORAGE_OPTIONS.map((opt) => (
                  <div
                    key={opt.key}
                    onClick={() => onUpdate({ location: opt.key as CacheConfigType['location'] })}
                    className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      cache.location === opt.key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`text-lg mb-1 ${cache.location === opt.key ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                      {opt.icon}
                    </div>
                    <Text
                      strong
                      className={`text-sm ${cache.location === opt.key ? '!text-blue-700' : ''}`}
                    >
                      {opt.label}
                    </Text>
                    <Text type="secondary" className="text-xs block">
                      {opt.description}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
