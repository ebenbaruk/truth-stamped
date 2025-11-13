import * as crypto from 'crypto';
import * as fs from 'fs';

/**
 * Hash a file using SHA-256
 */
export async function hashFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => {
      hash.update(data);
    });

    stream.on('end', () => {
      resolve('0x' + hash.digest('hex'));
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Hash a string using SHA-256
 */
export function hashString(data: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return '0x' + hash.digest('hex');
}
