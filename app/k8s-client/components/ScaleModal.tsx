'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const prevOpenRef = useRef(open);

  // Reset replicas when modal opens
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setReplicas(currentReplicas);
    }
    prevOpenRef.current = open;
  }, [open, currentReplicas]);

  return (
    <Modal
      open={open}
      title={<span style={{ color: '#c9d1d9' }}>⚖️ Scale {resourceType}</span>}
      onCancel={onClose}
      onOk={() => onConfirm(replicas)}
      okText="Scale"
      confirmLoading={loading}
      okButtonProps={{ disabled: replicas === currentReplicas }}
      styles={{
        header: { backgroundColor: '#161b22', borderBottom: '1px solid #30363d' },
        body: { backgroundColor: '#0d1117', padding: '20px 24px' },
        footer: { backgroundColor: '#161b22', borderTop: '1px solid #30363d' },
      }}
      className="dark-modal"
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text style={{ color: '#8b949e' }}>Resource: </Text>
          <Text strong style={{ color: '#c9d1d9' }}>
            {namespace}/{name}
          </Text>
        </div>

        <div>
          <Text style={{ color: '#8b949e' }}>Current replicas: </Text>
          <Text strong style={{ color: '#c9d1d9' }}>{currentReplicas}</Text>
        </div>

        <div>
          <Text style={{ display: 'block', marginBottom: 8, color: '#8b949e' }}>
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
