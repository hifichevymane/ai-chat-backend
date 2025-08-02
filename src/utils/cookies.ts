import type { Request, Response, CookieOptions } from 'express';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  signed: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};

export function getRefreshTokenCookie(req: Request): string | null {
  const cookies = req.signedCookies as Record<string, string | undefined>;
  return cookies[REFRESH_TOKEN_COOKIE_NAME] ?? null;
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTIONS);
}

export function setRefreshTokenCookie(
  res: Response,
  refreshToken: string,
  tokenExpirationTimeInMs: number
): void {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    ...REFRESH_TOKEN_COOKIE_OPTIONS,
    maxAge: tokenExpirationTimeInMs
  });
}
