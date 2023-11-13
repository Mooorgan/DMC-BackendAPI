import { Request, NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { catchError } from '../controllers/controller.helper-functions';

export const checkAuth = (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]!;
    const decodedToken: any = verify(token, process.env.JWT_KEY!);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
      username: decodedToken.username,
    };
    next();
  } catch (err) {
    catchError(next, err, 500, 'You are not granted access');
  }
};
