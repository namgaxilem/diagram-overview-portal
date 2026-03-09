import { NextRequest, NextResponse } from 'next/server';
import { kubectl } from '../_utils';

export async function POST(request: NextRequest) {
  try {
    const { type, name, namespace, replicas } = await request.json();

    if (!type || !name || !namespace || replicas == null) {
      return NextResponse.json({ error: 'type, name, namespace, replicas are required' }, { status: 400 });
    }

    const { stdout } = await kubectl([
      'scale', `${type}/${name}`,
      '-n', namespace,
      `--replicas=${replicas}`,
    ]);

    return NextResponse.json({ success: true, output: stdout });
  } catch (error: unknown) {
    const err = error as { message?: string; stderr?: string };
    return NextResponse.json(
      { error: err.message ?? 'Failed to scale', stderr: err.stderr ?? '' },
      { status: 500 }
    );
  }
}
