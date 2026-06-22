'use client';

import React, { memo, useCallback, useState } from 'react';
import { Input, InputNumber, Select, Space, Typography } from 'antd';

import GeoRadiusEditor from './GeoRadiusEditor';
import { deserializeFilters, serializeFilters } from './serialization';
import type {
  EditableModel,
  EditableValue,
  FilterFieldDefinition,
  GeoRadiusValue,
  MongoFilter,
} from './types';

const { Text } = Typography;

export interface MongoFilterBuilderProps {
  value?: MongoFilter;
  onChange?: (value: MongoFilter) => void;
  fields: FilterFieldDefinition[];
}

const EMPTY_GEO: GeoRadiusValue = { lat: null, lng: null, radiusMi: null };

/** Case-insensitive match on both option value (e.g. state code) and label (name). */
const selectFilter = (input: string, option?: { value?: unknown; label?: unknown }) => {
  const q = input.trim().toLowerCase();
  return (
    String(option?.value ?? '')
      .toLowerCase()
      .includes(q) ||
    String(option?.label ?? '')
      .toLowerCase()
      .includes(q)
  );
};

/**
 * Single field editor row. Memoized so editing one row does not re-render the
 * others.
 */
const FilterRow = memo(function FilterRow({
  field,
  value,
  onValueChange,
}: {
  field: FilterFieldDefinition;
  value: EditableValue;
  onValueChange: (name: string, value: EditableValue) => void;
}) {
  const renderEditor = () => {
    switch (field.type) {
      case 'select':
        return (
          <Select
            className="w-full"
            value={(value as string) || undefined}
            onChange={(val) => onValueChange(field.name, val)}
            options={field.options}
            placeholder={field.placeholder ?? `Select ${field.label}`}
            showSearch
            filterOption={selectFilter}
            allowClear
          />
        );
      case 'number':
        return (
          <InputNumber
            className="w-full"
            value={value as number | null}
            onChange={(val) => onValueChange(field.name, val)}
            placeholder={field.placeholder ?? field.label}
          />
        );
      case 'geoRadius':
        return (
          <GeoRadiusEditor
            value={(value as GeoRadiusValue) ?? EMPTY_GEO}
            onChange={(val) => onValueChange(field.name, val)}
          />
        );
      case 'text':
      default:
        return (
          <Input
            value={(value as string) ?? ''}
            onChange={(e) => onValueChange(field.name, e.target.value)}
            placeholder={field.placeholder ?? field.label}
            allowClear
          />
        );
    }
  };

  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="mb-1">
        <Text strong>{field.label}</Text>
        <Text type="secondary" className="ml-2 text-xs font-mono">
          {field.name}
        </Text>
      </div>
      {renderEditor()}
    </div>
  );
});

function MongoFilterBuilder({ value, onChange, fields }: MongoFilterBuilderProps) {
  /**
   * Internal editable model. This is NOT a second source of truth for the
   * filter object — it mirrors `value` and only additionally retains
   * in-progress (incomplete) input that cannot yet be serialized (e.g. a geo
   * filter with only latitude entered).
   */
  const [model, setModel] = useState<EditableModel>(() => deserializeFilters(fields, value ?? {}));

  // Sync from external value during render (no effect needed). Keep the local
  // draft when `value` already matches what we last emitted (so partial input is
  // preserved); otherwise adopt the external value.
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    const incoming = value ?? {};
    const emitted = serializeFilters(fields, model);
    if (JSON.stringify(emitted) !== JSON.stringify(incoming)) {
      setModel(deserializeFilters(fields, incoming));
    }
  }

  const emit = useCallback(
    (next: EditableModel) => {
      onChange?.(serializeFilters(fields, next));
    },
    [fields, onChange]
  );

  const handleValueChange = useCallback(
    (name: string, val: EditableValue) => {
      setModel((prev) => {
        const next = { ...prev, [name]: val };
        emit(next);
        return next;
      });
    },
    [emit]
  );

  return (
    <Space direction="vertical" className="w-full" size="middle">
      {fields.map((field) => (
        <FilterRow
          key={field.name}
          field={field}
          value={model[field.name]}
          onValueChange={handleValueChange}
        />
      ))}
    </Space>
  );
}

export default memo(MongoFilterBuilder);

export { serializeFilters, deserializeFilters, EARTH_RADIUS_MI } from './serialization';
export type {
  FilterFieldDefinition,
  FilterFieldType,
  SelectOption,
  GeoRadiusValue,
  MongoFilter,
} from './types';
