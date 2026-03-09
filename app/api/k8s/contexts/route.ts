import { NextRequest, NextResponse } from 'next/server';
import { kubectl } from '../_utils';

export async function GET() {
  try {
    const { stdout } = await kubectl(['config', 'view', '-o', 'json']);
    const config = JSON.parse(stdout);

    const currentContext = config['current-context'] ?? '';
    const contexts = (config.contexts ?? []).map((ctx: { name: string; context?: { cluster?: string; user?: string; namespace?: string } }) => ({
      name: ctx.name,
      cluster: ctx.context?.cluster ?? '',
      user: ctx.context?.user ?? '',
      namespace: ctx.context?.namespace ?? '',
      isCurrent: ctx.name === currentContext,
    }));

    return NextResponse.json({ contexts, currentContext });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message ?? 'Failed to get contexts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { context } = await request.json();
    if (!context) {
      return NextResponse.json({ error: 'context is required' }, { status: 400 });
    }
    await kubectl(['config', 'use-context', context]);
    return NextResponse.json({ success: true, context });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message ?? 'Failed to switch context' }, { status: 500 });
  }
}
