import { compare, hash } from 'bcrypt';
import { JsonWebTokenError, Jwt, sign } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { NextFunction, Request, Response } from 'express';
import {
  ERROR,
  SUCCESS,
  catchError,
  sendResponse,
} from './controller.helper-functions';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const generatedHash = await hash(req.body.password, 10);
    const user: any = new User({
      username: req.body.username,
      email: req.body.email,
      password: generatedHash,
    });
    const userCreated = await user.save();
    res
      .status(201)
      .json(
        sendResponse(SUCCESS, 'Signup successful,User is created', userCreated)
      );
  } catch (err) {
    console.log(err);
    catchError(next, err, 500, 'Invalid authentication credentials');
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser: any = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      return res.status(401).json(sendResponse(ERROR, 'Authentication Failed'));
    }
    const giveAccess = await compare(req.body.password, foundUser.password);
    if (!giveAccess) {
      return res.status(401).json(sendResponse(ERROR, 'Authentication Failed'));
    }

    const jwtToken = sign(
      {
        email: foundUser.email,
        userId: foundUser._id,
        username: foundUser.username,
      },
      process.env.JWT_KEY!,
      { expiresIn: '1h' }
    );
    const responseToBeSent = {
      token: jwtToken,
      expiresIn: 3600,
      userId: foundUser._id,
      username: foundUser.username,
    };
    res
      .status(200)
      .json(sendResponse(SUCCESS, 'Login Successful', responseToBeSent));
  } catch (err) {
    catchError(next, err, 500, 'Error found when logging in');
  }
};
