'use client';

import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Table,
  Space,
  Popconfirm,
  Typography,
  Tooltip,
  Alert,
  Empty,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

export interface MetaTagItem {
  id: string;
  attributeKey: string;
  attributeKeyValueToScrape: string;
  attributeValueToScrape: string;
}

export interface MetaTagConfigProps {
  initValue?: MetaTagItem[];
  value?: MetaTagItem[];
  onChange?: (value: MetaTagItem[]) => void;
  onSave?: (value: MetaTagItem[]) => void;
  readOnly?: boolean;
}

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

  const handleSave = () => {
    console.log('Meta Tag Configuration:', metaTags);
    onSave?.(metaTags);
  };

  const isDuplicate = (attributeKey: string, attributeKeyValueToScrape: string) => {
    return metaTags.some(
      (tag) =>
        tag.attributeKey === attributeKey &&
        tag.attributeKeyValueToScrape === attributeKeyValueToScrape &&
        tag.id !== editingId
    );
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingId(null);
    setShowAddForm(false);
  };

  const columns = [
    {
      title: 'Find Attribute',
      dataIndex: 'attributeKey',
      key: 'attributeKey',
      render: (val: string) => <Tag color="default">{val}</Tag>,
    },
    {
      title: 'Match Value',
      dataIndex: 'attributeKeyValueToScrape',
      key: 'attributeKeyValueToScrape',
      render: (val: string) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: 'Extract From',
      dataIndex: 'attributeValueToScrape',
      key: 'attributeValueToScrape',
      render: (val: string) => <Tag color="green">{val}</Tag>,
    },
    {
      title: 'Selector Preview',
      key: 'preview',
      render: (_: unknown, record: MetaTagItem) => (
        <code className="bg-gray-50 px-2 py-1 rounded text-xs text-gray-600">
          {`<meta ${record.attributeKey}="${record.attributeKeyValueToScrape}" ${record.attributeValueToScrape}="...">`}
        </code>
      ),
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
                  title="Delete this meta tag config?"
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
        description={
          <div className="space-y-2">
            <div>Define rules to extract meta tag values from HTML pages.</div>
            <div className="text-xs bg-white/50 p-2 rounded border border-blue-200">
              <div className="font-medium mb-1">Example:</div>
              <code className="text-gray-600">{`<meta name="description" content="Page description">`}</code>
              <div className="mt-1 flex flex-wrap gap-2 items-center">
                <span>→</span>
                <Tag color="default">Find: name</Tag>
                <Tag color="blue">Match: description</Tag>
                <Tag color="green">Extract: content</Tag>
              </div>
            </div>
          </div>
        }
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
      />

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
                initialValues={{ attributeKey: 'name', attributeValueToScrape: 'content' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Form.Item
                    name="attributeKey"
                    label={
                      <span>
                        Find Attribute{' '}
                        <Tooltip title="The attribute name to find in the meta tag (e.g., 'name' or 'property')">
                          <QuestionCircleOutlined className="text-gray-400" />
                        </Tooltip>
                      </span>
                    }
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input placeholder="e.g., name, property" />
                  </Form.Item>

                  <Form.Item
                    name="attributeKeyValueToScrape"
                    label={
                      <span>
                        Match Value{' '}
                        <Tooltip title="The value of the attribute to match (e.g., 'description', 'og:title')">
                          <QuestionCircleOutlined className="text-gray-400" />
                        </Tooltip>
                      </span>
                    }
                    dependencies={['attributeKey']}
                    rules={[
                      { required: true, message: 'Required' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) return Promise.resolve();
                          const attributeKey = getFieldValue('attributeKey');
                          if (isDuplicate(attributeKey, value)) {
                            return Promise.reject(new Error('This combination already exists'));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input placeholder="e.g., description, og:title" />
                  </Form.Item>

                  <Form.Item
                    name="attributeValueToScrape"
                    label={
                      <span>
                        Extract From{' '}
                        <Tooltip title="The attribute to extract the value from (usually 'content')">
                          <QuestionCircleOutlined className="text-gray-400" />
                        </Tooltip>
                      </span>
                    }
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input placeholder="e.g., content" />
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
    </div>
  );
}
