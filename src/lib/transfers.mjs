import crypto from 'node:crypto';
import { dataPath, readJson, withLock, writeJson } from './store.mjs';
import { keyedHash } from './sessions.mjs';
import { BookError, storeImage } from './notebooks.mjs';
const tokenPath = (token) => {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token))
    throw new BookError('Dieser Upload-Link ist ungültig.', 404);
  return dataPath('transfers', `${keyedHash('transfer', token)}.json`);
};
export async function createTransfer(owner) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 10 * 60 * 1000;
  await writeJson(tokenPath(token), { owner, expires, images: [] });
  return { token, expires };
}
export async function transferStatus(token, owner) {
  const transfer = await readJson(tokenPath(token), null);
  if (
    !transfer ||
    transfer.expires < Date.now() ||
    (owner && transfer.owner !== owner)
  )
    throw new BookError('Dieser Upload-Link ist abgelaufen.', 404);
  return transfer;
}
export async function transferUpload(token, bytes) {
  return withLock(`transfer-${keyedHash('transfer', token)}`, async () => {
    const transfer = await transferStatus(token);
    if (transfer.images.length >= 20)
      throw new BookError('Für diesen Link sind höchstens 20 Bilder erlaubt.');
    const image = await storeImage(transfer.owner, bytes);
    transfer.images.push(image.src);
    await writeJson(tokenPath(token), transfer);
    return image;
  });
}
