export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
export async function api<T>(action: string, values: object = {}): Promise<T> {
  const response = await fetch('/api/werkstatt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...values, action }),
    cache: 'no-store',
  });
  const body = await response.json();
  if (!response.ok)
    throw new ApiError(
      body.error || 'Anfrage fehlgeschlagen.',
      response.status,
    );
  return body as T;
}
/** `query` lets children fill a placeholder (book and element id). */
export async function uploadImage(file: Blob, query = ''): Promise<string> {
  if (file.size > 12 * 1024 * 1024)
    throw new Error('Bilder dürfen höchstens 12 MB groß sein.');
  const response = await fetch(`/api/medien${query}`, {
    method: 'POST',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  });
  const body = await response.json().catch(() => ({ error: 'Das Bild konnte nicht gespeichert werden.' }));
  if (!response.ok) throw new Error(body.error);
  return body.src;
}
