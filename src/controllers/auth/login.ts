import type { Request, Response } from 'express';
import { AuthService } from '../../services';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const authService = new AuthService();
    const user = await authService.login(email, password);
    const token = authService.generateToken(user.id, user.email);
    res.status(200).json({ token });
  } catch {
    res.status(401).json({ error: 'Invalid email or password' });
  }
};
