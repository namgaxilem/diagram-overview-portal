'use client';

import React from 'react';
import {
  Input,
  Select,
  Button,
  Checkbox,
  Card,
  Tooltip,
  Typography,
  Space,
} from 'antd';
import {
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  SchemaField,
  JSON_SCHEMA_TYPES,
  ARRAY_ITEM_TYPES,
  createEmptyField,
} from './utils';

const { Text } = Typography;

interface SchemaFieldListProps {
  fields: SchemaField[];
  onChange: (fields: SchemaField[]) => void;
  depth?: number;
}

const SchemaFieldList: React.FC<SchemaFieldListProps> = ({
  fields,
  onChange,
  depth = 0,
}) => {
  const updateField = (index: number, updates: Partial<SchemaField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    onChange(newFields);
  };

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  const addField = () => {
    onChange([...fields, createEmptyField()]);
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    [newFields[index], newFields[targetIndex]] = [
      newFields[targetIndex],
      newFields[index],
    ];
    onChange(newFields);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {fields.map((field, index) => (
        <Card
          key={field.id}
          size="small"
          style={{
            borderLeft: depth > 0 ? '3px solid #1677ff' : undefined,
            background: depth % 2 === 1 ? '#fafbfc' : undefined,
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {/* Row 1: Name, Type, Required, Actions */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Input
                placeholder="Property name"
                value={field.name}
                onChange={(e) =>
                  updateField(index, { name: e.target.value })
                }
                style={{ flex: 1, minWidth: 140 }}
                status={field.name.trim() === '' ? 'warning' : undefined}
              />
              <Select
                value={field.type}
                onChange={(value) => {
                  const updates: Partial<SchemaField> = { type: value };
                  if (
                    value === 'object' &&
                    field.properties.length === 0
                  ) {
                    updates.properties = [createEmptyField()];
                  }
                  if (value === 'array') {
                    updates.itemType = field.itemType || 'string';
                  }
                  updateField(index, updates);
                }}
                options={JSON_SCHEMA_TYPES}
                style={{ width: 120 }}
              />
              <Tooltip title="Mark this property as required">
                <Checkbox
                  checked={field.required}
                  onChange={(e) =>
                    updateField(index, {
                      required: (e.target as HTMLInputElement).checked,
                    })
                  }
                >
                  Required
                </Checkbox>
              </Tooltip>
              <Space size={2}>
                <Tooltip title="Move up">
                  <Button
                    type="text"
                    size="small"
                    icon={<ArrowUpOutlined />}
                    disabled={index === 0}
                    onClick={() => moveField(index, 'up')}
                  />
                </Tooltip>
                <Tooltip title="Move down">
                  <Button
                    type="text"
                    size="small"
                    icon={<ArrowDownOutlined />}
                    disabled={index === fields.length - 1}
                    onClick={() => moveField(index, 'down')}
                  />
                </Tooltip>
                <Tooltip title="Remove property">
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeField(index)}
                  />
                </Tooltip>
              </Space>
            </div>

            {/* Row 2: Description */}
            <Input
              placeholder="Description (optional)"
              value={field.description}
              onChange={(e) =>
                updateField(index, { description: e.target.value })
              }
            />

            {/* Enum values for string type */}
            {field.type === 'string' && (
              <Input
                placeholder="Enum values — comma-separated (optional), e.g. red, green, blue"
                value={field.enumValues}
                onChange={(e) =>
                  updateField(index, { enumValues: e.target.value })
                }
              />
            )}

            {/* Array item type */}
            {field.type === 'array' && (
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <Text
                  type="secondary"
                  style={{ whiteSpace: 'nowrap', fontSize: 13 }}
                >
                  Item type:
                </Text>
                <Select
                  value={field.itemType || 'string'}
                  onChange={(value) => {
                    const updates: Partial<SchemaField> = {
                      itemType: value,
                    };
                    if (
                      value === 'object' &&
                      field.properties.length === 0
                    ) {
                      updates.properties = [createEmptyField()];
                    }
                    updateField(index, updates);
                  }}
                  options={ARRAY_ITEM_TYPES}
                  style={{ width: 120 }}
                />
              </div>
            )}

            {/* Nested properties for object type or array-of-objects */}
            {(field.type === 'object' ||
              (field.type === 'array' &&
                field.itemType === 'object')) && (
              <div style={{ marginLeft: 8, marginTop: 4 }}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                    marginBottom: 6,
                    display: 'block',
                  }}
                >
                  {field.type === 'array'
                    ? 'Array item properties:'
                    : 'Nested properties:'}
                </Text>
                <SchemaFieldList
                  fields={field.properties}
                  onChange={(newProps) =>
                    updateField(index, { properties: newProps })
                  }
                  depth={depth + 1}
                />
              </div>
            )}
          </div>
        </Card>
      ))}

      <Button
        type="dashed"
        onClick={addField}
        block
        icon={<PlusOutlined />}
        style={{ marginTop: 4 }}
      >
        Add Property
      </Button>
    </div>
  );
};

export default SchemaFieldList;
