'use client';

import React, { useState, useEffect } from 'react';
import {
  Layout, Select, Button, Table, Tag, Space, Typography, Tabs,
  Tooltip, Popconfirm, Input, notification, Alert, Badge, AutoComplete,
} from 'antd';
import type { TableColumnsType } from 'antd';
import {
  ReloadOutlined, FileTextOutlined, CodeOutlined,
  InfoCircleOutlined, DeleteOutlined, ScissorOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import LogsDrawer from './components/LogsDrawer';
import ExecDrawer from './components/ExecDrawer';
import DescribeModal from './components/DescribeModal';
import ScaleModal from './components/ScaleModal';

const { Header, Content } = Layout;
const { Text, Title } = Typography;

// ── Types ──────────────────────────────────────────────────────────────────────

interface K8sContext {
  name: string;
  cluster: string;
  user: string;
  namespace: string;
  isCurrent: boolean;
}

type ResourceRecord = Record<string, unknown>;

interface LogsState   { open: boolean; pod: string; namespace: string; containers: string[] }
interface ExecState   { open: boolean; pod: string; namespace: string; containers: string[] }
interface DescribeState { open: boolean; title: string; content: string; loading: boolean }
interface ScaleState  { open: boolean; resourceType: string; name: string; namespace: string; currentReplicas: number }

// ── Constants ──────────────────────────────────────────────────────────────────

const RESOURCE_TYPES = [
  { key: 'pods',          label: '🟢 Pods' },
  { key: 'deployments',   label: '🚀 Deployments' },
  { key: 'statefulsets',  label: '💾 StatefulSets' },
  { key: 'services',      label: '🌐 Services' },
  { key: 'configmaps',    label: '⚙️ ConfigMaps' },
  { key: 'secrets',       label: '🔒 Secrets' },
  { key: 'ingresses',     label: '🔀 Ingresses' },
];

function podStatusColor(status: string): string {
  const s = (status ?? '').toLowerCase();
  if (s === 'running')   return 'success';
  if (s === 'pending')   return 'processing';
  if (s === 'succeeded') return 'default';
  if (s === 'failed')    return 'error';
  if (s === 'terminating') return 'warning';
  if (s.includes('crash') || s.includes('error') || s.includes('oom')) return 'error';
  return 'warning';
}

function svcTypeColor(t: string): string {
  if (t === 'LoadBalancer') return 'blue';
  if (t === 'NodePort')     return 'orange';
  if (t === 'ExternalName') return 'purple';
  return 'default';
}

// ── Page Component ─────────────────────────────────────────────────────────────

export default function K8sClientPage() {
  const [notifApi, notifHolder] = notification.useNotification();

  // context / namespace
  const [contexts,         setContexts]         = useState<K8sContext[]>([]);
  const [currentContext,   setCurrentContext]   = useState('');
  const [namespaces,       setNamespaces]       = useState<string[]>([]);
  const [currentNamespace, setCurrentNamespace] = useState('default');
  const [ctxLoading,       setCtxLoading]       = useState(false);

  // resources
  const [activeTab,      setActiveTab]      = useState('pods');
  const [resources,      setResources]      = useState<ResourceRecord[]>([]);
  const [resLoading,     setResLoading]     = useState(false);
  const [resError,       setResError]       = useState('');
  const [searchText,     setSearchText]     = useState('');

  // drawers / modals
  const [logsState,    setLogsState]    = useState<LogsState>({ open: false, pod: '', namespace: '', containers: [] });
  const [execState,    setExecState]    = useState<ExecState>({ open: false, pod: '', namespace: '', containers: [] });
  const [descState,    setDescState]    = useState<DescribeState>({ open: false, title: '', content: '', loading: false });
  const [scaleState,   setScaleState]   = useState<ScaleState>({ open: false, resourceType: '', name: '', namespace: '', currentReplicas: 0 });
  const [scaleLoading, setScaleLoading] = useState(false);

  // ── Data fetchers ────────────────────────────────────────────────────────────

  const fetchContexts = async () => {
    setCtxLoading(true);
    try {
      const res  = await fetch('/api/k8s/contexts');
      const data = await res.json();
      if (res.ok) { setContexts(data.contexts ?? []); setCurrentContext(data.currentContext ?? ''); }
    } catch { /* silent */ } finally { setCtxLoading(false); }
  };

  const fetchNamespaces = async () => {
    try {
      const res  = await fetch('/api/k8s/namespaces');
      const data = await res.json();
      if (res.ok) setNamespaces(data.namespaces ?? []);
    } catch { /* silent */ }
  };

  const fetchResources = async (type: string, ns: string) => {
    setResLoading(true);
    setResError('');
    try {
      const q = new URLSearchParams({ type });
      if (ns === '__all__') q.set('all', 'true'); else q.set('namespace', ns);
      const res  = await fetch(`/api/k8s/resources?${q}`);
      const data = await res.json();
      if (res.ok) { setResources(data.items ?? []); }
      else        { setResError(data.error ?? 'Failed to load'); setResources([]); }
    } catch (e: unknown) {
      const err = e as { message?: string };
      setResError(err.message ?? 'Network error');
      setResources([]);
    } finally { setResLoading(false); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchContexts(); fetchNamespaces(); }, []);
  useEffect(() => { fetchResources(activeTab, currentNamespace); }, [activeTab, currentNamespace]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Action handlers ──────────────────────────────────────────────────────────

  const handleContextSwitch = async (ctx: string) => {
    setCtxLoading(true);
    try {
      const res  = await fetch('/api/k8s/contexts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: ctx }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentContext(ctx);
        setCurrentNamespace('default');
        notifApi.success({ message: `Switched to ${ctx}`, duration: 2 });
        await fetchNamespaces();
        fetchResources(activeTab, 'default');
      } else {
        notifApi.error({ message: 'Failed to switch context', description: data.error });
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      notifApi.error({ message: 'Network error', description: err.message });
    } finally { setCtxLoading(false); }
  };

  const handleDescribe = async (resourceType: string, name: string, ns: string) => {
    setDescState({ open: true, title: `${resourceType}/${name}`, content: '', loading: true });
    try {
      const q   = new URLSearchParams({ type: resourceType, name, namespace: ns });
      const res = await fetch(`/api/k8s/describe?${q}`);
      const d   = await res.json();
      setDescState(prev => ({ ...prev, content: d.output ?? d.error ?? 'No output', loading: false }));
    } catch (e: unknown) {
      const err = e as { message?: string };
      setDescState(prev => ({ ...prev, content: err.message ?? 'Error', loading: false }));
    }
  };

  const handleDelete = async (resourceType: string, name: string, ns: string) => {
    try {
      const res = await fetch('/api/k8s/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: resourceType, name, namespace: ns }),
      });
      const data = await res.json();
      if (res.ok) {
        notifApi.success({ message: `Deleted ${resourceType}/${name}` });
        fetchResources(activeTab, currentNamespace);
      } else {
        notifApi.error({ message: 'Delete failed', description: data.error });
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      notifApi.error({ message: 'Network error', description: err.message });
    }
  };

  const handleScale = async (replicas: number) => {
    setScaleLoading(true);
    try {
      const res = await fetch('/api/k8s/scale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: scaleState.resourceType, name: scaleState.name, namespace: scaleState.namespace, replicas }),
      });
      const data = await res.json();
      if (res.ok) {
        notifApi.success({ message: `Scaled to ${replicas} replica(s)` });
        setScaleState(prev => ({ ...prev, open: false }));
        fetchResources(activeTab, currentNamespace);
      } else {
        notifApi.error({ message: 'Scale failed', description: data.error });
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      notifApi.error({ message: 'Network error', description: err.message });
    } finally { setScaleLoading(false); }
  };

  // ── Action cell renderer ──────────────────────────────────────────────────────

  const renderActions = (record: ResourceRecord) => {
    const isPod      = activeTab === 'pods';
    const isScalable = activeTab === 'deployments' || activeTab === 'statefulsets';
    const ns         = record.namespace as string;
    const name       = record.name as string;

    return (
      <Space size={4}>
        {isPod && (
          <Tooltip title="Logs">
            <Button size="small" icon={<FileTextOutlined />}
              onClick={() => setLogsState({ open: true, pod: name, namespace: ns, containers: (record.containers as string[]) ?? [] })}
            />
          </Tooltip>
        )}
        {isPod && (
          <Tooltip title="Exec">
            <Button size="small" icon={<CodeOutlined />}
              onClick={() => setExecState({ open: true, pod: name, namespace: ns, containers: (record.containers as string[]) ?? [] })}
            />
          </Tooltip>
        )}
        {isScalable && (
          <Tooltip title="Scale">
            <Button size="small" icon={<ScissorOutlined />}
              onClick={() => setScaleState({ open: true, resourceType: activeTab, name, namespace: ns, currentReplicas: (record.replicas as number) ?? 0 })}
            />
          </Tooltip>
        )}
        <Tooltip title="Describe">
          <Button size="small" icon={<InfoCircleOutlined />}
            onClick={() => handleDescribe(activeTab, name, ns)}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Popconfirm
            title={`Delete ${activeTab}/${name}?`}
            description="This action cannot be undone."
            onConfirm={() => handleDelete(activeTab, name, ns)}
            okText="Delete" okButtonProps={{ danger: true }}
          >
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Tooltip>
      </Space>
    );
  };

  // ── Column definitions ────────────────────────────────────────────────────────

  const actionCol: TableColumnsType<ResourceRecord>[number] = {
    title: 'Actions', key: 'actions', fixed: 'right', width: 155,
    render: (_: unknown, record: ResourceRecord) => renderActions(record),
  };

  const nameCol: TableColumnsType<ResourceRecord>[number] = {
    title: 'Name', dataIndex: 'name', key: 'name',
    render: (v: unknown) => <Text code style={{ fontSize: 12 }}>{v as string}</Text>,
  };

  const nsCol: TableColumnsType<ResourceRecord>[number] = {
    title: 'Namespace', dataIndex: 'namespace', key: 'namespace', width: 130,
  };

  const ageCol: TableColumnsType<ResourceRecord>[number] = {
    title: 'Age', dataIndex: 'age', key: 'age', width: 70,
  };

  const COLUMNS: Record<string, TableColumnsType<ResourceRecord>> = {
    pods: [
      nameCol, nsCol,
      {
        title: 'Status', dataIndex: 'status', key: 'status', width: 130,
        render: (v: unknown) => <Tag color={podStatusColor(v as string)}>{v as string}</Tag>,
      },
      { title: 'Ready',    dataIndex: 'ready',    key: 'ready',    width: 75  },
      {
        title: 'Restarts', dataIndex: 'restarts', key: 'restarts', width: 85,
        render: (v: unknown) => {
          const n = v as number;
          return <Tag color={n > 5 ? 'red' : n > 0 ? 'orange' : 'default'}>{n}</Tag>;
        },
      },
      { title: 'Node',  dataIndex: 'node',  key: 'node',  ellipsis: true },
      { title: 'Pod IP', dataIndex: 'podIP', key: 'podIP', width: 120, render: (v: unknown) => (v as string) || '-' },
      ageCol, actionCol,
    ],
    deployments: [
      nameCol, nsCol,
      { title: 'Ready',       dataIndex: 'ready',      key: 'ready',      width: 90 },
      { title: 'Up-to-date',  dataIndex: 'upToDate',   key: 'upToDate',   width: 100 },
      { title: 'Available',   dataIndex: 'available',  key: 'available',  width: 90 },
      ageCol,
      { ...actionCol, width: 110 },
    ],
    statefulsets: [
      nameCol, nsCol,
      { title: 'Ready', dataIndex: 'ready', key: 'ready', width: 90 },
      ageCol,
      { ...actionCol, width: 110 },
    ],
    services: [
      nameCol, nsCol,
      {
        title: 'Type', dataIndex: 'serviceType', key: 'serviceType', width: 120,
        render: (v: unknown) => <Tag color={svcTypeColor(v as string)}>{v as string}</Tag>,
      },
      { title: 'Cluster IP',   dataIndex: 'clusterIP',  key: 'clusterIP',  width: 130 },
      { title: 'External IP',  dataIndex: 'externalIP', key: 'externalIP', width: 140 },
      { title: 'Port(s)',      dataIndex: 'ports',      key: 'ports',      ellipsis: true },
      ageCol,
      { ...actionCol, width: 95 },
    ],
    configmaps: [
      nameCol, nsCol,
      { title: 'Data', dataIndex: 'dataCount', key: 'dataCount', width: 90, render: (v: unknown) => `${v as number} key(s)` },
      ageCol,
      { ...actionCol, width: 95 },
    ],
    secrets: [
      nameCol, nsCol,
      { title: 'Type',  dataIndex: 'secretType', key: 'secretType', ellipsis: true },
      { title: 'Data',  dataIndex: 'dataCount',  key: 'dataCount',  width: 90, render: (v: unknown) => `${v as number} key(s)` },
      ageCol,
      { ...actionCol, width: 95 },
    ],
    ingresses: [
      nameCol, nsCol,
      { title: 'Hosts',   dataIndex: 'hosts',   key: 'hosts',   ellipsis: true },
      { title: 'Address', dataIndex: 'address', key: 'address', width: 160 },
      ageCol,
      { ...actionCol, width: 95 },
    ],
  };

  // ── Derived data ──────────────────────────────────────────────────────────────

  const filtered = searchText
    ? resources.filter(r =>
        Object.values(r).some(v => String(v ?? '').toLowerCase().includes(searchText.toLowerCase()))
      )
    : resources;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {notifHolder}

      {/* ── Header ── */}
      <Header style={{
        display: 'flex', alignItems: 'center', gap: 16,
        backgroundColor: '#001529', padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}>
        <Title level={4} style={{ color: 'white', margin: 0, whiteSpace: 'nowrap', letterSpacing: 1 }}>
          ☸️ K8s Client
        </Title>

        <div style={{ flex: 1 }} />

        <Space size="middle">
          {/* Context selector */}
          <Space size={6}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: 0.5 }}>CONTEXT</Text>
            <Select
              value={currentContext || undefined}
              placeholder="Select context…"
              onChange={handleContextSwitch}
              loading={ctxLoading}
              style={{ minWidth: 200 }}
              options={contexts.map(c => ({
                label: (
                  <Space size={4}>
                    <Badge status={c.isCurrent ? 'success' : 'default'} />
                    <span>{c.name}</span>
                    {c.cluster && <Text type="secondary" style={{ fontSize: 11 }}>({c.cluster})</Text>}
                  </Space>
                ),
                value: c.name,
              }))}
              optionLabelProp="value"
            />
          </Space>

          {/* Namespace selector */}
          <Space size={6}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: 0.5 }}>NAMESPACE</Text>
            <AutoComplete
              value={currentNamespace}
              onChange={(v) => setCurrentNamespace(v)}
              style={{ minWidth: 150 }}
              options={[
                { label: '🌐 All Namespaces', value: '__all__' },
                ...namespaces.map(n => ({ label: n, value: n })),
              ]}
              placeholder="Enter or select namespace"
              filterOption={(input, option) =>
                (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Space>

          {/* Refresh */}
          <Tooltip title="Refresh">
            <Button
              ghost
              icon={<ReloadOutlined />}
              loading={resLoading}
              onClick={() => { fetchContexts(); fetchNamespaces(); fetchResources(activeTab, currentNamespace); }}
            />
          </Tooltip>
        </Space>
      </Header>

      {/* ── Content ── */}
      <Content style={{ padding: '16px 24px' }}>

        {/* Tabs + search bar */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: '0 16px',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => { setActiveTab(key); setSearchText(''); }}
            style={{ flex: 1, minWidth: 0 }}
            items={RESOURCE_TYPES.map(rt => ({ key: rt.key, label: rt.label }))}
          />
          <Input
            prefix={<SearchOutlined style={{ color: '#aaa' }} />}
            placeholder="Filter…"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
            style={{ width: 200 }}
            size="small"
          />
        </div>

        {/* Info bar */}
        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {resLoading ? 'Loading…' : (
              <>
                <Text strong style={{ fontSize: 12 }}>{filtered.length}</Text> resource(s)
                {searchText && <> matching &ldquo;{searchText}&rdquo;</>}
                {' '}in{' '}
                <Text code style={{ fontSize: 12 }}>
                  {currentNamespace === '__all__' ? 'all namespaces' : currentNamespace}
                </Text>
              </>
            )}
          </Text>
        </div>

        {/* Error */}
        {resError && (
          <Alert
            type="error"
            message="Failed to load resources"
            description={<><code>{resError}</code><br />Make sure kubectl is configured and the cluster is reachable.</>}
            style={{ marginBottom: 12 }}
            action={<Button size="small" onClick={() => fetchResources(activeTab, currentNamespace)}>Retry</Button>}
            closable
          />
        )}

        {/* Resource table */}
        <Table
          columns={COLUMNS[activeTab] ?? []}
          dataSource={filtered}
          rowKey={(r) => (r.uid as string) || `${r.namespace}-${r.name}`}
          loading={resLoading}
          size="small"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 20, showSizeChanger: true, pageSizeOptions: ['10','20','50','100'], showTotal: (t) => `Total ${t}` }}
          style={{ backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
        />
      </Content>

      {/* ── Drawers & Modals ── */}
      <LogsDrawer
        open={logsState.open}
        pod={logsState.pod}
        namespace={logsState.namespace}
        containers={logsState.containers}
        onClose={() => setLogsState(p => ({ ...p, open: false }))}
      />
      <ExecDrawer
        open={execState.open}
        pod={execState.pod}
        namespace={execState.namespace}
        containers={execState.containers}
        onClose={() => setExecState(p => ({ ...p, open: false }))}
      />
      <DescribeModal
        open={descState.open}
        title={descState.title}
        content={descState.content}
        loading={descState.loading}
        onClose={() => setDescState(p => ({ ...p, open: false }))}
      />
      <ScaleModal
        open={scaleState.open}
        resourceType={scaleState.resourceType}
        name={scaleState.name}
        namespace={scaleState.namespace}
        currentReplicas={scaleState.currentReplicas}
        onConfirm={handleScale}
        onClose={() => setScaleState(p => ({ ...p, open: false }))}
        loading={scaleLoading}
      />
    </Layout>
  );
}
