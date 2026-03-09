import { NextRequest, NextResponse } from 'next/server';
import { kubectl } from '../_utils';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const pod = params.get('pod');
  const namespace = params.get('namespace') ?? 'default';
  const container = params.get('container');
  const tail = params.get('tail') ?? '200';
  const previous = params.get('previous') === 'true';

  if (!pod) {
    return NextResponse.json({ error: 'pod is required' }, { status: 400 });
  }

  try {
    const args = ['logs', pod, '-n', namespace, `--tail=${tail}`];
    if (container) args.push('-c', container);
    if (previous) args.push('--previous');

    const { stdout } = await kubectl(args, { maxBuffer: 20 * 1024 * 1024, timeout: 15000 });
    return NextResponse.json({ logs: stdout });
  } catch (error: unknown) {
    const err = error as { message?: string; stdout?: string; stderr?: string };
    return NextResponse.json(
      { error: err.message ?? 'Failed to get logs', logs: err.stdout ?? '' },
      { status: 500 }
    );
  }
}
