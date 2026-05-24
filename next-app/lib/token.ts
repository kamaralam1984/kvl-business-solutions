import crypto from 'crypto';

export function generateToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function expiresIn(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
