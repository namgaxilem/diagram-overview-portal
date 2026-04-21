'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Select, Button, Space, Typography, Input, Tag, Spin } from 'antd';
import { SendOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface HistoryEntry {
  id: number;
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  timestamp: string;
}

interface ExecDrawerProps {
  open: boolean;
  pod: string;
  namespace: string;
  containers: string[];
  onClose: () => void;
}

export default function ExecDrawer({ open, pod, namespace, containers, onClose }: ExecDrawerProps) {
  const [container, setContainer] = useState<string>(containers[0] ?? '');
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [cmdIdx, setCmdIdx] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const idCounter = useRef(0);
  const prevOpenRef = useRef(open);

  // Reset state when drawer opens
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setContainer(containers[0] ?? '');

      setHistory([]);

      setCmdHistory([]);

      setCommand('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    prevOpenRef.current = open;
  }, [open, containers]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const runCommand = async () => {
    const cmd = command.trim();
    if (!cmd || loading) {
      return;
    }

    setLoading(true);
    setCmdHistory((prev) => [cmd, ...prev.slice(0, 49)]);
    setCmdIdx(-1);
    setCommand('');

    try {
      const res = await fetch('/api/k8s/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pod, namespace, container, command: cmd }),
      });
      const data = await res.json();
      const entry: HistoryEntry = {
        id: ++idCounter.current,
        command: cmd,
        stdout: data.stdout ?? '',
        stderr: data.stderr ?? '',
        exitCode: data.exitCode ?? 0,
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory((prev) => [...prev, entry]);
    } catch {
      setHistory((prev) => [
        ...prev,
        {
          id: ++idCounter.current,
          command: cmd,
          stdout: '',
          stderr: 'Network error: failed to reach API',
          exitCode: 1,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      runCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(cmdIdx + 1, cmdHistory.length - 1);
      setCmdIdx(next);
      setCommand(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(cmdIdx - 1, -1);
      setCmdIdx(next);
      setCommand(next === -1 ? '' : (cmdHistory[next] ?? ''));
    }
  };

  const handleCopyAll = () => {
    const text = history
      .map((h) => `$ ${h.command}\n${h.stdout}${h.stderr ? '\n[stderr] ' + h.stderr : ''}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <Drawer
      open={open}
      title={
        <Space>
          <span>⚡ Exec:</span>
          <Text strong style={{ fontFamily: 'monospace' }}>
            {pod}
          </Text>
        </Space>
      }
      onClose={onClose}
      style={{ minWidth: '55%' }}
      extra={
        <Space>
          <Button
            icon={<CopyOutlined />}
            onClick={handleCopyAll}
            size="small"
            disabled={history.length === 0}
          >
            Copy All
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => setHistory([])}
            size="small"
            danger
            disabled={history.length === 0}
          >
            Clear
          </Button>
        </Space>
      }
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
    >
      {/* Container selector */}
      {containers.length > 1 && (
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: '#fafafa',
          }}
        >
          <Space size="small">
            <Text type="secondary">Container:</Text>
            <Select
              value={container}
              onChange={setContainer}
              options={containers.map((c) => ({ label: c, value: c }))}
              style={{ minWidth: 160 }}
              size="small"
            />
          </Space>
        </div>
      )}

      {/* Output area */}
      <div
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px',
          backgroundColor: '#0d1117',
          fontFamily: 'Consolas, "Courier New", monospace',
          fontSize: 12,
          lineHeight: 1.7,
        }}
      >
        {history.length === 0 && (
          <Text style={{ color: '#6e7681' }}>
            {`# Connected to pod: ${pod}${container ? ` [${container}]` : ''}`}
            <br /># Type a command and press Enter...
          </Text>
        )}
        {history.map((entry) => (
          <div key={entry.id} style={{ marginBottom: 12 }}>
            <div style={{ color: '#58a6ff' }}>
              <span style={{ color: '#6e7681' }}>[{entry.timestamp}]</span>{' '}
              <span style={{ color: '#7ee787' }}>$</span> {entry.command}
            </div>
            {entry.stdout && (
              <pre
                style={{
                  margin: '4px 0 0 0',
                  color: '#c9d1d9',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {entry.stdout}
              </pre>
            )}
            {entry.stderr && (
              <pre
                style={{
                  margin: '4px 0 0 0',
                  color: '#f85149',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {entry.stderr}
              </pre>
            )}
            {entry.exitCode !== 0 && (
              <Tag color="error" style={{ marginTop: 4, fontSize: 11 }}>
                exit {entry.exitCode}
              </Tag>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ color: '#6e7681' }}>
            <Spin size="small" /> <span style={{ marginLeft: 8 }}>Running...</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid #30363d',
          backgroundColor: '#161b22',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <span style={{ color: '#7ee787', fontFamily: 'monospace', fontSize: 14, flexShrink: 0 }}>
          $
        </span>
        <Input
          ref={(el) => {
            inputRef.current = el?.input ?? null;
          }}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command (↑↓ for history)"
          disabled={loading}
          style={{
            flex: 1,
            backgroundColor: '#0d1117',
            borderColor: '#30363d',
            color: '#c9d1d9',
            fontFamily: 'monospace',
          }}
          variant="outlined"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={runCommand}
          loading={loading}
          disabled={!command.trim()}
        >
          Run
        </Button>
      </div>
    </Drawer>
  );
}
