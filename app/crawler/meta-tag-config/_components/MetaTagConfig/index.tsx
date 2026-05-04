'use client';

import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Table,
  Space,
  Popconfirm,
  Typography,
  Tooltip,
  Tag,
  Alert,
  Divider,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export interface MetaTagItem {
  id: string;
  name: string;
  type: MetaTagType;
  attribute: MetaTagAttribute;
  required: boolean;
  description?: string;
}

export type MetaTagType = 'standard' | 'opengraph' | 'twitter' | 'custom';
export type MetaTagAttribute = 'name' | 'property' | 'http-equiv' | 'itemprop';

export interface MetaTagConfigProps {
  initValue?: MetaTagItem[];
  value?: MetaTagItem[];
  onChange?: (value: MetaTagItem[]) => void;
  onSave?: (value: MetaTagItem[]) => void;
  readOnly?: boolean;
}

const META_TAG_TYPES: { value: MetaTagType; label: string; color: string; description: string }[] = [
  { value: 'standard', label: 'Standard', color: 'blue', description: 'Standard HTML meta tags like description, keywords, author' },
  { value: 'opengraph', label: 'Open Graph', color: 'green', description: 'Open Graph protocol tags for social sharing (og:*)' },
  { value: 'twitter', label: 'Twitter Card', color: 'cyan', description: 'Twitter Card meta tags (twitter:*)' },
  { value: 'custom', label: 'Custom', color: 'purple', description: 'Custom meta tags specific to your needs' },
];

const META_TAG_ATTRIBUTES: { value: MetaTagAttribute; label: string; description: string }[] = [
  { value: 'name', label: 'name', description: 'Standard meta name attribute (e.g., <meta name="description">)' },
  { value: 'property', label: 'property', description: 'Property attribute for Open Graph (e.g., <meta property="og:title">)' },
  { value: 'http-equiv', label: 'http-equiv', description: 'HTTP equivalent headers (e.g., <meta http-equiv="refresh">)' },
  { value: 'itemprop', label: 'itemprop', description: 'Schema.org microdata attribute' },
];

const COMMON_META_TAGS = [
  { name: 'description', type: 'standard' as MetaTagType, attribute: 'name' as MetaTagAttribute },
  { name: 'keywords', type: 'standard' as MetaTagType, attribute: 'name' as MetaTagAttribute },
  { name: 'author', type: 'standard' as MetaTagType, attribute: 'name' as MetaTagAttribute },
  { name: 'robots', type: 'standard' as MetaTagType, attribute: 'name' as MetaTagAttribute },
  { name: 'viewport', type: 'standard' as MetaTagType, attribute: 'name' as MetaTagAttribute },
  { name: 'og:title', type: 'opengraph' as MetaTagType, attribute: 'property' as MetaTagAttribute },
  { name: 'og:description', type: 'opengraph' as MetaTagType, attribute: 'property' as MetaTagAttribute },
  { name: 'og:image', type: 'opengraph' as MetaTagType, attribute: 'property' as MetaTagAttribute },
  { name: 'og:url', type: 'opengraph' as MetaTagType, attribute: 'property' as MetaTagAttribute },
  { name: 'og:type', type: 'opengraph' as MetaTagType, attribute: 'property' as MetaTagAttribute },
  { name: 'twitter:card', type: 'twitter' as MetaTagType, attribute: 'name' as MetaTagAttribute },
  { name: 'twitter:title', type: 'twitter' as MetaTagType, attribute: 'name' as MetaTagAttribute },
  { name: 'twitter:description', type: 'twitter' as MetaTagType, attribute: 'name' as MetaTagAttribute },
  { name: 'twitter:image', type: 'twitter' as MetaTagType, attribute: 'name' as MetaTagAttribute },
];

const generateId = () => `meta-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function MetaTagConfig({
  initValue = [],
  value,
  onChange,
  onSave,
  readOnly = false,
}: MetaTagConfigProps) {
  const [form] = Form.useForm();
  const [metaTags, setMetaTags] = useState<MetaTagItem[]>(initValue);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setMetaTags(value);
    }
  }, [value]);

  const updateMetaTags = (newTags: MetaTagItem[]) => {
    if (value === undefined) {
      setMetaTags(newTags);
    }
    onChange?.(newTags);
  };

  const handleAdd = (values: Omit<MetaTagItem, 'id'>) => {
    const newTag: MetaTagItem = {
      ...values,
      id: generateId(),
    };
    updateMetaTags([...metaTags, newTag]);
    form.resetFields();
    setShowAddForm(false);
  };

  const handleEdit = (id: string) => {
    const tag = metaTags.find((t) => t.id === id);
    if (tag) {
      form.setFieldsValue(tag);
      setEditingId(id);
      setShowAddForm(true);
    }
  };

  const handleUpdate = (values: Omit<MetaTagItem, 'id'>) => {
    if (!editingId) return;
    const updatedTags = metaTags.map((tag) =>
      tag.id === editingId ? { ...values, id: editingId } : tag
    );
    updateMetaTags(updatedTags);
    form.resetFields();
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    updateMetaTags(metaTags.filter((tag) => tag.id !== id));
  };

  const handleAddCommonTag = (commonTag: (typeof COMMON_META_TAGS)[0]) => {
    const exists = metaTags.some(
      (tag) => tag.name === commonTag.name && tag.attribute === commonTag.attribute
    );
    if (exists) return;

    const newTag: MetaTagItem = {
      id: generateId(),
      name: commonTag.name,
      type: commonTag.type,
      attribute: commonTag.attribute,
      required: false,
    };
    updateMetaTags([...metaTags, newTag]);
  };

  const handleSave = () => {
    onSave?.(metaTags);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingId(null);
    setShowAddForm(false);
  };

  const columns = [
    {
      title: 'Meta Tag Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <code className="bg-gray-100 px-2 py-1 rounded text-sm">{name}</code>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: MetaTagType) => {
        const typeInfo = META_TAG_TYPES.find((t) => t.value === type);
        return <Tag color={typeInfo?.color}>{typeInfo?.label || type}</Tag>;
      },
    },
    {
      title: 'Attribute',
      dataIndex: 'attribute',
      key: 'attribute',
      render: (attr: MetaTagAttribute) => (
        <Tag color="default">{attr}</Tag>
      ),
    },
    {
      title: 'Required',
      dataIndex: 'required',
      key: 'required',
      render: (required: boolean) => (
        <Tag color={required ? 'red' : 'default'}>{required ? 'Yes' : 'No'}</Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string) => desc || <Text type="secondary">-</Text>,
    },
    ...(readOnly
      ? []
      : [
          {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_: unknown, record: MetaTagItem) => (
              <Space>
                <Tooltip title="Edit">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record.id)}
                  />
                </Tooltip>
                <Popconfirm
                  title="Delete this meta tag?"
                  description="This action cannot be undone."
                  onConfirm={() => handleDelete(record.id)}
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <Tooltip title="Delete">
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Tooltip>
                </Popconfirm>
              </Space>
            ),
          },
        ]),
  ];

  return (
    <div className="space-y-6">
      <Alert
        message="Meta Tag Configuration"
        description="Configure which HTML meta tags should be extracted during crawling. Add standard, Open Graph, Twitter Card, or custom meta tags to define your extraction schema."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
      />

      {!readOnly && (
        <Card size="small" title="Quick Add Common Tags" className="bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {COMMON_META_TAGS.map((tag) => {
              const exists = metaTags.some(
                (t) => t.name === tag.name && t.attribute === tag.attribute
              );
              return (
                <Button
                  key={`${tag.attribute}-${tag.name}`}
                  size="small"
                  disabled={exists}
                  onClick={() => handleAddCommonTag(tag)}
                >
                  {tag.name}
                </Button>
              );
            })}
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <Title level={5} className="!mb-0">
            Configured Meta Tags ({metaTags.length})
          </Title>
          {!readOnly && (
            <Space>
              {onSave && (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  disabled={metaTags.length === 0}
                >
                  Save Configuration
                </Button>
              )}
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowAddForm(true)}
                disabled={showAddForm}
              >
                Add Meta Tag
              </Button>
            </Space>
          )}
        </div>

        {showAddForm && (
          <>
            <Card
              size="small"
              title={editingId ? 'Edit Meta Tag' : 'Add New Meta Tag'}
              className="mb-4 bg-blue-50 border-blue-200"
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={editingId ? handleUpdate : handleAdd}
                initialValues={{ type: 'standard', attribute: 'name', required: false }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Form.Item
                    name="name"
                    label={
                      <span>
                        Meta Tag Name{' '}
                        <Tooltip title="The name or property value to match in the meta tag">
                          <QuestionCircleOutlined className="text-gray-400" />
                        </Tooltip>
                      </span>
                    }
                    rules={[
                      { required: true, message: 'Please enter meta tag name' },
                      {
                        pattern: /^[a-zA-Z0-9:_-]+$/,
                        message: 'Only alphanumeric, colon, underscore, and hyphen allowed',
                      },
                    ]}
                  >
                    <Input placeholder="e.g., description, og:title" />
                  </Form.Item>

                  <Form.Item
                    name="type"
                    label={
                      <span>
                        Type{' '}
                        <Tooltip title="Category of the meta tag for organization">
                          <QuestionCircleOutlined className="text-gray-400" />
                        </Tooltip>
                      </span>
                    }
                    rules={[{ required: true, message: 'Please select type' }]}
                  >
                    <Select>
                      {META_TAG_TYPES.map((type) => (
                        <Option key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Tag color={type.color} className="!m-0">
                              {type.label}
                            </Tag>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="attribute"
                    label={
                      <span>
                        Attribute{' '}
                        <Tooltip title="The HTML attribute used to identify the meta tag">
                          <QuestionCircleOutlined className="text-gray-400" />
                        </Tooltip>
                      </span>
                    }
                    rules={[{ required: true, message: 'Please select attribute' }]}
                  >
                    <Select>
                      {META_TAG_ATTRIBUTES.map((attr) => (
                        <Option key={attr.value} value={attr.value}>
                          {attr.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="required"
                    label={
                      <span>
                        Required{' '}
                        <Tooltip title="Mark if this meta tag must be present in crawled pages">
                          <QuestionCircleOutlined className="text-gray-400" />
                        </Tooltip>
                      </span>
                    }
                  >
                    <Select>
                      <Option value={false}>No</Option>
                      <Option value={true}>Yes</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Description (Optional)"
                    className="md:col-span-2"
                  >
                    <Input placeholder="Brief description of this meta tag's purpose" />
                  </Form.Item>
                </div>

                <div className="flex gap-2">
                  <Button type="primary" htmlType="submit">
                    {editingId ? 'Update' : 'Add'} Meta Tag
                  </Button>
                  <Button onClick={handleCancel}>Cancel</Button>
                </div>
              </Form>
            </Card>
            <Divider />
          </>
        )}

        <Table
          dataSource={metaTags}
          columns={columns}
          rowKey="id"
          pagination={metaTags.length > 10 ? { pageSize: 10 } : false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No meta tags configured. Add tags above to start."
              />
            ),
          }}
        />
      </Card>

      <Card size="small" title="Help: Meta Tag Reference">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Text strong>Tag Types:</Text>
            <ul className="mt-2 space-y-1">
              {META_TAG_TYPES.map((type) => (
                <li key={type.value} className="flex items-start gap-2">
                  <Tag color={type.color} className="!mt-0.5">
                    {type.label}
                  </Tag>
                  <Text type="secondary" className="text-sm">
                    {type.description}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Text strong>Attributes:</Text>
            <ul className="mt-2 space-y-1">
              {META_TAG_ATTRIBUTES.map((attr) => (
                <li key={attr.value} className="flex items-start gap-2">
                  <code className="bg-gray-100 px-1 rounded text-sm">{attr.label}</code>
                  <Text type="secondary" className="text-sm">
                    {attr.description}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
