import { NextRequest, NextResponse } from 'next/server';
import { kubectl } from '../_utils';

export async function DELETE(request: NextRequest) {
  try {
    const { type, name, namespace } = await request.json();

    if (!type || !name || !namespace) {
      return NextResponse.json({ error: 'type, name, namespace are required' }, { status: 400 });
    }

    const { stdout } = await kubectl(['delete', type, name, '-n', namespace]);
    return NextResponse.json({ success: true, output: stdout });
  } catch (error: unknown) {
    const err = error as { message?: string; stderr?: string };
    return NextResponse.json(
      { error: err.message ?? 'Failed to delete resource', stderr: err.stderr ?? '' },
      { status: 500 }
    );
  }
}
