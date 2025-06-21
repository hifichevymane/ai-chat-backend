import type { Request, Response } from 'express';

export const healthCheck = (_: Request, res: Response): void => {
  res.status(200).json({ code: 200, status: 'OK' });
};
