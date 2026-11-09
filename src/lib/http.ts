import { BookError } from './notebooks.mjs';
/** Bound streaming bodies too, rather than trusting Content-Length. */
export async function boundedBody(
  request: Request,
  limit: number,
): Promise<Buffer> {
  if (Number(request.headers.get('content-length')) > limit)
    throw new BookError('Datei oder Seite ist zu groß.', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new BookError('Leere Anfrage.');
  const parts: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) {
      await reader.cancel();
      throw new BookError('Datei oder Seite ist zu groß.', 413);
    }
    parts.push(value);
  }
  return Buffer.concat(parts);
}
