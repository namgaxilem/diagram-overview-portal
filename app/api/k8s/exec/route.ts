import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { kubectl } from '../_utils';

export async function POST(request: NextRequest) {
  try {
    const { pod, namespace, container, command } = await request.json();

    if (!pod || !command) {
      return NextResponse.json({ error: 'pod and command are required' }, { status: 400 });
    }

    const args = ['exec', pod];
    if (namespace) {
      args.push('-n', namespace);
    }
    if (container) {
      args.push('-c', container);
    }
    args.push('--', 'sh', '-c', command);

    const { stdout, stderr } = await kubectl(args, { timeout: 30000 });

    return NextResponse.json({
      stdout: stdout ?? '',
      stderr: stderr ?? '',
      exitCode: 0,
    });
  } catch (error: unknown) {
    const err = error as { message?: string; stdout?: string; stderr?: string; code?: number };
    return NextResponse.json(
      {
        stdout: err.stdout ?? '',
        stderr: err.stderr ?? err.message ?? 'Command failed',
        exitCode: err.code ?? 1,
      },
      { status: 200 }
    );
  }
}
