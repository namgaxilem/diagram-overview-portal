import { NextRequest, NextResponse } from 'next/server';
import { kubectl } from '../_utils';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get('type') ?? 'pod';
  const name = params.get('name');
  const namespace = params.get('namespace') ?? 'default';

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  try {
    const { stdout } = await kubectl(['describe', type, name, '-n', namespace]);
    return NextResponse.json({ output: stdout });
  } catch (error: unknown) {
    const err = error as { message?: string; stdout?: string; stderr?: string };
    return NextResponse.json(
      { error: err.message ?? 'Failed to describe resource', output: err.stdout ?? '' },
      { status: 500 }
    );
  }
}
