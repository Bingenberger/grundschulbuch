export function createTransfer(
  owner: string,
): Promise<{ token: string; expires: number }>;
export function transferStatus(
  token: string,
  owner?: string,
): Promise<{ owner: string; expires: number; images: string[] }>;
export function transferUpload(
  token: string,
  bytes: Buffer,
): Promise<{ src: string }>;
