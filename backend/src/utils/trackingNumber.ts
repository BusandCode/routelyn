import { randomInt } from 'crypto';

export const TRACKING_REGEX = /^RLN-\d{8}$/;

export function generateTrackingNumber(): string {
  return `RLN-${randomInt(10_000_000, 99_999_999)}`;
}
