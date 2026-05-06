'use client';

import { FilterOutlined } from '@ant-design/icons';
import { Input, Tag, Tooltip } from 'antd';

export interface FilterConfig {
  regex: string;
}

export interface FilterBuilderProps {
  value?: FilterConfig;
  onChange?: (value: FilterConfig | undefined) => void;
  readOnly?: boolean;
}

export default function FilterBuilder({
  value,
  onChange,
  readOnly = false,
}: FilterBuilderProps) {
  const handleChange = (regex: string) => {
    if (regex.trim()) {
      onChange?.({ regex: regex.trim() });
    } else {
      onChange?.(undefined);
    }
  };

  if (readOnly) {
    return value?.regex ? (
      <Tag color="purple">
        <FilterOutlined className="mr-1" />
        {value.regex}
      </Tag>
    ) : (
      <Tag color="default">No filter</Tag>
    );
  }

  return (
    <Input
      placeholder="e.g., ^-?([9][0-9]|[1-8][0-9]?|\\d)(\\.\\d+)?$ (latitude: -90 to 90)"
      value={value?.regex || ''}
      onChange={(e) => handleChange(e.target.value)}
      prefix={<FilterOutlined className="text-gray-400" />}
    />
  );
}

export function FilterConfigPreview({ config }: { config?: FilterConfig }) {
  if (!config?.regex) {
    return <Tag color="default">No filter</Tag>;
  }

  return (
    <Tooltip title={config.regex}>
      <Tag color="purple" className="cursor-pointer max-w-[150px] truncate">
        <FilterOutlined className="mr-1" />
        {config.regex}
      </Tag>
    </Tooltip>
  );
}
