import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { kubectl, getAge } from '../_utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapItem(type: string, item: any) {
  const base = {
    name: item.metadata.name as string,
    namespace: item.metadata.namespace as string,
    age: getAge(item.metadata.creationTimestamp as string),
    creationTimestamp: item.metadata.creationTimestamp as string,
    labels: item.metadata.labels ?? {},
    uid: item.metadata.uid as string,
  };

  if (type === 'pods') {
    const containers: string[] = (item.spec.containers ?? []).map((c: { name: string }) => c.name);
    const statuses = item.status.containerStatuses ?? [];
    const ready = statuses.filter((c: { ready: boolean }) => c.ready).length;
    const restarts = statuses.reduce(
      (sum: number, c: { restartCount?: number }) => sum + (c.restartCount ?? 0),
      0
    );
    return {
      ...base,
      status: item.status.phase as string,
      ready: `${ready}/${containers.length}`,
      restarts,
      node: item.spec.nodeName as string,
      podIP: item.status.podIP as string,
      containers,
    };
  }

  if (type === 'deployments') {
    return {
      ...base,
      ready: `${item.status.readyReplicas ?? 0}/${item.spec.replicas ?? 0}`,
      upToDate: item.status.updatedReplicas ?? 0,
      available: item.status.availableReplicas ?? 0,
      replicas: item.spec.replicas ?? 0,
    };
  }

  if (type === 'statefulsets') {
    return {
      ...base,
      ready: `${item.status.readyReplicas ?? 0}/${item.spec.replicas ?? 0}`,
      replicas: item.spec.replicas ?? 0,
    };
  }

  if (type === 'services') {
    const ports = (item.spec.ports ?? [])
      .map(
        (p: { port: number; targetPort?: string | number; protocol?: string }) =>
          `${p.port}${p.targetPort != null ? ':' + p.targetPort : ''}/${p.protocol ?? 'TCP'}`
      )
      .join(', ');
    const ingress = item.status?.loadBalancer?.ingress ?? [];
    return {
      ...base,
      serviceType: item.spec.type as string,
      clusterIP: item.spec.clusterIP as string,
      externalIP:
        ingress.map((i: { ip?: string; hostname?: string }) => i.ip ?? i.hostname).join(', ') ||
        '<none>',
      ports,
    };
  }

  if (type === 'configmaps') {
    return {
      ...base,
      dataCount: Object.keys(item.data ?? {}).length,
      data: item.data ?? {},
    };
  }

  if (type === 'secrets') {
    return {
      ...base,
      secretType: item.type as string,
      dataCount: Object.keys(item.data ?? {}).length,
    };
  }

  if (type === 'ingresses') {
    const rules = item.spec.rules ?? [];
    const hosts = rules
      .map((r: { host?: string }) => r.host)
      .filter(Boolean)
      .join(', ');
    const ingress = item.status?.loadBalancer?.ingress ?? [];
    const address = ingress
      .map((i: { ip?: string; hostname?: string }) => i.ip ?? i.hostname)
      .join(', ');
    return {
      ...base,
      hosts: hosts || '<none>',
      address: address || '<pending>',
    };
  }

  return base;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get('type') ?? 'pods';
  const namespace = params.get('namespace') ?? 'default';
  const allNamespaces = params.get('all') === 'true';

  try {
    const nsArgs = allNamespaces ? ['--all-namespaces'] : ['-n', namespace];
    const { stdout } = await kubectl(['get', type, ...nsArgs, '-o', 'json']);
    const data = JSON.parse(stdout);
    const items = (data.items ?? []).map((item: unknown) => mapItem(type, item));
    return NextResponse.json({ items, type });
  } catch (error: unknown) {
    const err = error as { message?: string; stdout?: string; stderr?: string };
    return NextResponse.json(
      { error: err.message ?? 'Failed to get resources', stderr: err.stderr ?? '' },
      { status: 500 }
    );
  }
}
