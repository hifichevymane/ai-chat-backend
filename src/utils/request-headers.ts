import type { Request } from 'express';

export function getAccessToken(req: Request): string | null {
  return req.headers.authorization?.split(' ')[1] ?? null;
}
