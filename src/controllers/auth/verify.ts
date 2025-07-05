import type { Request, Response } from 'express';
import { AuthService } from '../../services';

interface VerifyRequestBody {
  token: string;
}

export const verify = async (
  req: Request<unknown, unknown, VerifyRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ message: 'Token is required' });
      return;
    }

    const authService = new AuthService();
    const isTokenValid = await authService.verifyJWT(token);

    if (!isTokenValid) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
