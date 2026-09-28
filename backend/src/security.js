import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
export const token = () => randomBytes(32).toString('hex');
export const digest = value => createHash('sha256').update(value).digest('hex');
export const id = prefix => `${prefix}-${randomBytes(8).toString('hex').toUpperCase()}`;
export function fail(status, message) { throw Object.assign(new Error(message), { status }); }
export function text(value, label, min = 1, max = 1000) {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) fail(400, `${label} must contain ${min}–${max} characters.`);
  return value.trim();
}
export function email(value) {
  const result = text(value, 'Email', 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) fail(400, 'Enter a valid email address.');
  return result;
}
export function amount(value, min = 1, max = 10000000) {
  if (!['string', 'number'].includes(typeof value) || !Number.isFinite(Number(value)) || Number(value) < min || Number(value) > max) fail(400, `Amount must be between ${min} and ${max}.`);
  return Math.round(Number(value) * 100) / 100;
}
export function password(value) {
  if (typeof value !== 'string' || value.length < 8 || value.length > 128 || !/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) fail(400, 'Password needs 8–128 characters with uppercase, lowercase and a number.');
  return value;
}
export async function hashPassword(value) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(value, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}
export async function verifyPassword(value, saved) {
  if (typeof value !== 'string' || value.length > 128) return false;
  const [salt, hash] = saved.split(':');
  const actual = await scrypt(value, salt, 64);
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}
export const publicUser = ({ passwordHash, ...user }) => user;
