import { readAccounts } from '@/lib/accounts.mjs';
import { SCHEMA_VERSION, schemaVersion } from '@/lib/store.mjs';

export const dynamic = 'force-dynamic';

// Ready means: data directory migrated to the expected schema and the
// account file readable. No external services are needed.
export async function GET() {
  try {
    if ((await schemaVersion()) !== SCHEMA_VERSION) return Response.json({ status: 'schema' }, { status: 503 });
    await readAccounts();
    return Response.json({ status: 'ok' });
  } catch {
    return Response.json({ status: 'daten' }, { status: 503 });
  }
}
