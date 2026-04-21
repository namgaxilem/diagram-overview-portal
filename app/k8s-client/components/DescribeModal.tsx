'use client';

import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface DescribeModalProps {
  open: boolean;
  title: string;
  content: string;
  loading?: boolean;
  onClose: () => void;
}

export default function DescribeModal({
  open,
  title,
  content,
  loading,
  onClose,
}: DescribeModalProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Modal
      open={open}
      title={
        <Space>
          <span>📋 Describe: {title}</span>
        </Space>
      }
      onCancel={onClose}
      footer={
        <Space>
          <Button
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
            disabled={!content}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button type="primary" onClick={onClose}>
            Close
          </Button>
        </Space>
      }
      width={900}
      styles={{ body: { padding: 0 } }}
    >
      {loading ? (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Text type="secondary">Loading...</Text>
        </div>
      ) : (
        <pre
          style={{
            margin: 0,
            padding: '16px',
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            fontFamily: 'Consolas, "Courier New", monospace',
            fontSize: 12,
            lineHeight: 1.6,
            maxHeight: '70vh',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {content || '(no output)'}
        </pre>
      )}
    </Modal>
  );
}
