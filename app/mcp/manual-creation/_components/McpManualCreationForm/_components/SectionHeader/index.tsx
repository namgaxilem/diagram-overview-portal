import React from 'react';
import { Switch, Typography } from 'antd';

const { Text } = Typography;

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  enabled?: boolean;
  onToggle?: (checked: boolean) => void;
}

export default function SectionHeader({
  icon,
  title,
  subtitle,
  enabled,
  onToggle,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <Text strong className="text-gray-800 block">
            {title}
          </Text>
          <Text type="secondary" className="text-xs">
            {subtitle}
          </Text>
        </div>
      </div>
      {onToggle !== undefined && (
        <div className="flex items-center gap-2">
          <Text type="secondary" className="text-xs font-medium">
            {enabled ? 'ENABLED' : 'DISABLED'}
          </Text>
          <Switch checked={enabled} onChange={onToggle} size="small" />
        </div>
      )}
    </div>
  );
}
