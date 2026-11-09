export async function childApi<T>(
  action: string,
  values: object = {},
): Promise<T> {
  const response = await fetch('/api/kinder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...values, action }),
    cache: 'no-store',
  });
  const data = await response.json();
  if (!response.ok)
    throw Object.assign(new Error(data.error), { status: response.status });
  return data;
}
export async function qrDigest(value: string): Promise<string> {
  const hash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(hash), (n) =>
    n.toString(16).padStart(2, '0'),
  ).join('');
}
export async function classApi<T>(
  action: string,
  values: object = {},
): Promise<T> {
  const response = await fetch('/api/klassen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...values, action }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  return result;
}
