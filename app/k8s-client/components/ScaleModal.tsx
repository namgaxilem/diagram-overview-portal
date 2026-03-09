'use client';

import React, { useState, useEffect } from 'react';
import { Modal, InputNumber, Typography, Space, Alert } from 'antd';

const { Text } = Typography;

interface ScaleModalProps {
  open: boolean;
  resourceType: string;
  name: string;
  namespace: string;
  currentReplicas: number;
  onConfirm: (replicas: number) => void;
  onClose: () => void;
  loading?: boolean;
}

export default function ScaleModal({
  open,
  resourceType,
  name,
  namespace,
  currentReplicas,
  onConfirm,
  onClose,
  loading,
}: ScaleModalProps) {
  const [replicas, setReplicas] = useState<number>(currentReplicas);

  useEffect(() => {
    setReplicas(currentReplicas);
  }, [currentReplicas, open]);

  return (
    <Modal
      open={open}
      title={`⚖️ Scale ${resourceType}`}
      onCancel={onClose}
      onOk={() => onConfirm(replicas)}
      okText="Scale"
      confirmLoading={loading}
      okButtonProps={{ disabled: replicas === currentReplicas }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text type="secondary">Resource: </Text>
          <Text strong>{namespace}/{name}</Text>
        </div>

        <div>
          <Text type="secondary">Current replicas: </Text>
          <Text strong>{currentReplicas}</Text>
        </div>

        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            New replica count:
          </Text>
          <InputNumber
            min={0}
            max={100}
            value={replicas}
            onChange={(v) => setReplicas(v ?? 0)}
            style={{ width: 120 }}
          />
        </div>

        {replicas === 0 && (
          <Alert
            type="warning"
            showIcon
            message="Scaling to 0 will stop all pods for this resource."
          />
        )}

        {replicas > currentReplicas && (
          <Alert
            type="info"
            showIcon
            message={`This will add ${replicas - currentReplicas} replica(s).`}
          />
        )}

        {replicas < currentReplicas && replicas > 0 && (
          <Alert
            type="warning"
            showIcon
            message={`This will remove ${currentReplicas - replicas} replica(s).`}
          />
        )}
      </Space>
    </Modal>
  );
}
