import { sql } from '@/lib/db';

export async function GET() {
  const [row] = await sql`SELECT NOW() as now`;
  return Response.json({ ok: true, now: row?.now ?? null });
}
