import { NextResponse } from 'next/server';
import { kubectl } from '../_utils';

export async function GET() {
  try {
    const { stdout } = await kubectl(['get', 'namespaces', '-o', 'json']);
    const data = JSON.parse(stdout);
    const namespaces: string[] = (data.items ?? []).map((ns: { metadata: { name: string } }) => ns.metadata.name);
    return NextResponse.json({ namespaces });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message ?? 'Failed to get namespaces' }, { status: 500 });
  }
}
