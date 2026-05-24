import { customAlphabet } from 'nanoid';

const alphabet = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const generate = customAlphabet(alphabet, 5);

export function generateLicenseKey(prefix = 'KVL') {
  return `${prefix}-${generate()}-${generate()}-${generate()}-${generate()}`;
}

export function generateOrderId() {
  return `KVL-ORD-${Date.now().toString(36).toUpperCase()}-${generate()}`;
}
