'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Drawer, Select, Button, Space, Typography, Switch, InputNumber, Spin, Alert } from 'antd';
import { ReloadOutlined, VerticalAlignBottomOutlined, CopyOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface LogsDrawerProps {
  open: boolean;
  pod: string;
  namespace: string;
  containers: string[];
  onClose: () => void;
}

export default function LogsDrawer({ open, pod, namespace, containers, onClose }: LogsDrawerProps) {
  const [container, setContainer] = useState<string>(containers[0] ?? '');
  const [tail, setTail] = useState<number>(200);
  const [previous, setPrevious] = useState(false);
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const logsRef = useRef<HTMLPreElement>(null);
  const prevOpenRef = useRef(open);

  const fetchLogs = useCallback(async () => {
    if (!pod) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        pod,
        namespace,
        tail: String(tail),
        previous: String(previous),
      });
      if (container) {
        params.set('container', container);
      }

      const res = await fetch(`/api/k8s/logs?${params}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? 'Failed to fetch logs');
        setLogs(data.logs ?? '');
      } else {
        setLogs(data.logs ?? '');
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err.message ?? 'Network error');
    } finally {
      setLoading(false);
    }
  }, [pod, namespace, container, tail, previous]);

  // Reset container and fetch logs when drawer opens
  useEffect(() => {
    if (open && pod && !prevOpenRef.current) {
      setContainer(containers[0] ?? '');
      fetchLogs();
    }
    prevOpenRef.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pod]);

  const scrollToBottom = () => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(logs);
  };

  return (
    <Drawer
      open={open}
      title={
        <Space>
          <span>📄 Logs:</span>
          <Text strong style={{ fontFamily: 'monospace' }}>
            {pod}
          </Text>
        </Space>
      }
      onClose={onClose}
      style={{ minWidth: '60%' }}
      extra={
        <Space>
          <Button icon={<CopyOutlined />} onClick={handleCopy} disabled={!logs} size="small">
            Copy
          </Button>
          <Button icon={<VerticalAlignBottomOutlined />} onClick={scrollToBottom} size="small">
            Bottom
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchLogs}
            loading={loading}
            type="primary"
            size="small"
          >
            Refresh
          </Button>
        </Space>
      }
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
    >
      {/* Controls */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
        }}
      >
        <Space wrap>
          {containers.length > 1 && (
            <Space size="small">
              <Text type="secondary">Container:</Text>
              <Select
                value={container}
                onChange={setContainer}
                options={containers.map((c) => ({ label: c, value: c }))}
                style={{ minWidth: 140 }}
                size="small"
              />
            </Space>
          )}
          <Space size="small">
            <Text type="secondary">Tail:</Text>
            <InputNumber
              min={10}
              max={5000}
              step={100}
              value={tail}
              onChange={(v) => setTail(v ?? 200)}
              style={{ width: 80 }}
              size="small"
            />
          </Space>
          <Space size="small">
            <Text type="secondary">Previous:</Text>
            <Switch checked={previous} onChange={setPrevious} size="small" />
          </Space>
          <Button size="small" type="default" onClick={fetchLogs} loading={loading}>
            Apply
          </Button>
        </Space>
      </div>

      {/* Log output */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 10,
            }}
          >
            <Spin size="large" />
          </div>
        )}
        {error && <Alert type="error" message={error} style={{ margin: 12 }} />}
        <pre
          ref={logsRef}
          style={{
            margin: 0,
            padding: '12px 16px',
            backgroundColor: '#0d1117',
            color: '#c9d1d9',
            fontFamily: 'Consolas, "Courier New", monospace',
            fontSize: 12,
            lineHeight: 1.7,
            height: '100%',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {logs || (loading ? '' : '(no logs)')}
        </pre>
      </div>
    </Drawer>
  );
}
