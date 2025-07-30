import 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    cookies: Record<string, string>;
  }
}
